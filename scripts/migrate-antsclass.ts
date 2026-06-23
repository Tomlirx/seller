import "dotenv/config";
import * as cheerio from "cheerio";
import { put } from "@vercel/blob";
import { prisma } from "../src/lib/prisma";
import type { ProductCategory } from "@prisma/client";

const BASE = "https://shop.antsclass.com";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
};

type ParsedProduct = {
  name: string;
  sku: string;
  slug: string;
  priceCents: number;
  description: string;
  imageUrls: string[];
  category: ProductCategory;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function getProductUrls(): Promise<string[]> {
  const urls = new Set<string>();
  for (const page of [1, 2, 3]) {
    const listUrl = page === 1 ? `${BASE}/shop/` : `${BASE}/shop/page/${page}/`;
    const html = await fetchHtml(listUrl);
    const $ = cheerio.load(html);
    $('a[href*="/product/"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href && /^https:\/\/shop\.antsclass\.com\/product\/[a-z0-9-]+\/?$/.test(href)) {
        urls.add(href.endsWith("/") ? href : `${href}/`);
      }
    });
  }
  return Array.from(urls);
}

function parsePriceCents($: cheerio.CheerioAPI): number | null {
  const priceBlock = $(".wp-block-woocommerce-product-price").first();
  const ins = priceBlock.find("ins bdi");
  const target = ins.length > 0 ? ins.first() : priceBlock.find("bdi").first();
  const text = target.text().replace(/RM/i, "").replace(/,/g, "").trim();
  const value = parseFloat(text);
  return Number.isFinite(value) ? Math.round(value * 100) : null;
}

async function parseProduct(url: string): Promise<ParsedProduct | null> {
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const name = $(".wp-block-post-title").first().text().trim();
  const sku = $(".sku").first().text().trim();
  const priceCents = parsePriceCents($);
  const description = $(".wp-block-post-excerpt__excerpt").first().text().replace(/\s+/g, " ").trim();
  const categoryTags = $(".taxonomy-product_cat a")
    .map((_, el) => $(el).text().trim().toLowerCase())
    .get();
  const category: ProductCategory = categoryTags.some((c) => c.includes("bracelet")) ? "BANGLE" : "OTHER";

  const imageUrls: string[] = [];
  $(".woocommerce-product-gallery__image a").each((_, el) => {
    const href = $(el).attr("href");
    if (href) imageUrls.push(href);
  });

  const slugMatch = url.match(/\/product\/([a-z0-9-]+)\/?$/);
  const slug = slugMatch?.[1];

  if (!sku || !slug || priceCents === null) {
    console.warn(`Skipping ${url}: missing sku, slug, or price`);
    return null;
  }

  return { name, sku, slug, priceCents, description, imageUrls, category };
}

async function uploadImage(sourceUrl: string, filenameHint: string): Promise<string | null> {
  try {
    const res = await fetch(sourceUrl, { headers: HEADERS });
    if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const ext = sourceUrl.split("?")[0].split(".").pop() || "jpg";
    const blob = await put(`products/antsclass-${filenameHint}.${ext}`, buffer, {
      access: "public",
      contentType: res.headers.get("content-type") ?? undefined,
      addRandomSuffix: true,
    });
    return blob.url;
  } catch (err) {
    console.error(`Failed to upload image ${sourceUrl}:`, err);
    return null;
  }
}

async function main() {
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

  const urls = await getProductUrls();
  const targetUrls = limit ? urls.slice(0, limit) : urls;
  console.log(`Found ${urls.length} products on antsclass.com; importing ${targetUrls.length}.`);

  const summary: { slug: string; sku: string; priceCents: number; images: number }[] = [];

  for (const url of targetUrls) {
    const parsed = await parseProduct(url);
    if (!parsed) continue;

    const uploadedUrls: string[] = [];
    for (let i = 0; i < parsed.imageUrls.length; i++) {
      const uploaded = await uploadImage(parsed.imageUrls[i], `${parsed.slug}-${i}`);
      if (uploaded) uploadedUrls.push(uploaded);
    }

    await prisma.product.upsert({
      where: { sku: parsed.sku },
      update: {
        name: parsed.name,
        description: parsed.description,
        priceCents: parsed.priceCents,
        imageUrls: uploadedUrls,
        category: parsed.category,
      },
      create: {
        name: parsed.name,
        slug: parsed.slug,
        sku: parsed.sku,
        description: parsed.description,
        category: parsed.category,
        priceCents: parsed.priceCents,
        imageUrls: uploadedUrls,
        stockQty: 1,
        isActive: false,
      },
    });

    summary.push({ slug: parsed.slug, sku: parsed.sku, priceCents: parsed.priceCents, images: uploadedUrls.length });
    console.log(`Imported: ${parsed.name} (${parsed.sku}) — ${uploadedUrls.length} image(s)`);

    await sleep(300);
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
