import "dotenv/config";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { put } from "@vercel/blob";
import { prisma } from "../src/lib/prisma";

const PICTURES_DIR = join(process.cwd(), "products", "Jade Pictures");
const FOLDER_RE = /^Bangle(\d+)_([A-Z]+)_CK(\d+)_(\d+)$/;

const TYPE_MAP: Record<string, { zh: string; en: string }> = {
  YT: { zh: "圆条", en: "Round Bar" },
  ZQ: { zh: "正圈", en: "Classic Round" },
  GF: { zh: "贵妃", en: "Oval" },
};

type ParsedBangle = {
  folder: string;
  no: string;
  typeCode: string;
  size: string;
  priceCents: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  heicPaths: string[];
};

function parseFolder(folder: string): ParsedBangle | null {
  const m = FOLDER_RE.exec(folder);
  if (!m) return null;
  const [, no, typeCode, size, price] = m;
  const type = TYPE_MAP[typeCode];
  if (!type) {
    console.warn(`Unknown type code "${typeCode}" in ${folder} — skipping.`);
    return null;
  }

  const dir = join(PICTURES_DIR, folder);
  const heicPaths = readdirSync(dir)
    .filter((f) => /\.heic$/i.test(f))
    .sort()
    .map((f) => join(dir, f));

  const name = `翡翠手镯 · ${type.zh} · 圈口${size}（No.${no}）`;
  const slug = folder.toLowerCase().replace(/_/g, "-");
  const description =
    `天然翡翠手镯，${type.zh}款式，圈口约 ${size}mm。天然玉石，色泽温润，每件独一无二，仅此一件。\n` +
    `Natural jadeite bangle, ${type.en} profile, inner diameter approx. ${size}mm. One of a kind.`;

  return {
    folder,
    no,
    typeCode,
    size,
    priceCents: Number(price) * 100,
    name,
    slug,
    sku: folder,
    description,
    heicPaths,
  };
}

function convertHeicToJpeg(heicPath: string, outDir: string, index: number): Buffer {
  const outPath = join(outDir, `img-${index}.jpg`);
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "85", "-Z", "2000", heicPath, "--out", outPath]);
  return readFileSync(outPath);
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

  if (!existsSync(PICTURES_DIR)) {
    throw new Error(`Pictures dir not found: ${PICTURES_DIR}`);
  }

  const folders = readdirSync(PICTURES_DIR).filter((f) => FOLDER_RE.test(f)).sort();
  const parsed = folders.map(parseFolder).filter((p): p is ParsedBangle => p !== null);

  const withImages = parsed.filter((p) => p.heicPaths.length > 0);
  const skipped = parsed.filter((p) => p.heicPaths.length === 0);

  console.log(`Found ${folders.length} bangle folder(s): ${withImages.length} with images, ${skipped.length} skipped (no HEIC).`);
  if (skipped.length > 0) {
    console.log(`Skipped (no usable image): ${skipped.map((s) => s.folder).join(", ")}`);
  }

  const targets = limit ? withImages.slice(0, limit) : withImages;

  if (dryRun) {
    console.log("\n=== DRY RUN — parsed products ===");
    console.table(
      targets.map((p) => ({
        no: p.no,
        type: TYPE_MAP[p.typeCode].zh,
        size: p.size,
        priceRM: p.priceCents / 100,
        images: p.heicPaths.length,
        slug: p.slug,
      }))
    );
    const totalImages = withImages.reduce((n, p) => n + p.heicPaths.length, 0);
    console.log(`\nTotal products to import: ${withImages.length}, total images: ${totalImages}.`);
    return;
  }

  const tmpRoot = mkdtempSync(join(tmpdir(), "jade-convert-"));
  const summary: { no: string; type: string; priceRM: number; images: number; slug: string }[] = [];

  try {
    for (const p of targets) {
      const existing = await prisma.product.findUnique({ where: { sku: p.sku } });

      let uploadedUrls: string[];
      if (existing && existing.imageUrls.length > 0) {
        uploadedUrls = existing.imageUrls;
        console.log(`Reusing ${uploadedUrls.length} already-uploaded image(s) for ${p.sku}`);
      } else {
        uploadedUrls = [];
        for (let i = 0; i < p.heicPaths.length; i++) {
          const buffer = convertHeicToJpeg(p.heicPaths[i], tmpRoot, i);
          const blob = await put(`products/jade-${p.slug}-${i}.jpg`, buffer, {
            access: "public",
            contentType: "image/jpeg",
            addRandomSuffix: true,
          });
          uploadedUrls.push(blob.url);
        }
      }

      await prisma.product.upsert({
        where: { sku: p.sku },
        update: {
          name: p.name,
          description: p.description,
          priceCents: p.priceCents,
          imageUrls: uploadedUrls,
          category: "BANGLE",
        },
        create: {
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          description: p.description,
          category: "BANGLE",
          priceCents: p.priceCents,
          imageUrls: uploadedUrls,
          stockQty: 1,
          isActive: true,
        },
      });

      summary.push({
        no: p.no,
        type: TYPE_MAP[p.typeCode].zh,
        priceRM: p.priceCents / 100,
        images: uploadedUrls.length,
        slug: p.slug,
      });
      console.log(`Imported: ${p.name} — ${uploadedUrls.length} image(s)`);
    }
  } finally {
    rmSync(tmpRoot, { recursive: true, force: true });
  }

  console.log("\n=== Import summary ===");
  console.table(summary);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
