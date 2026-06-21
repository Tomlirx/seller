import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_VALUES } from "@/lib/categories";
import { Divider } from "@/components/divider";
import { TrustBadges } from "@/components/trust-badges";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = PRODUCT_CATEGORY_VALUES.find((c) => c === category);

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(activeCategory ? { category: activeCategory } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative h-[480px] sm:h-[560px] w-full overflow-hidden">
        <Image
          src="/marketing/lanyu-hero.jpg"
          alt="岚玉 — 天然翡翠"
          fill
          priority
          className="object-cover object-[88%_45%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--ivory)_0%,var(--ivory)_56%,transparent_88%)]" />
        <div className="relative z-10 h-full mx-auto max-w-5xl px-4 flex flex-col justify-center gap-4 max-w-md">
          <p className="font-serif text-4xl text-ink">岚玉</p>
          <p className="text-sm tracking-[0.3em] text-gold">LAN YU</p>
          <Divider className="!justify-start" />
          <p className="font-serif text-lg text-ink">天然翡翠 · 精选藏品</p>
          <p className="text-xs tracking-widest text-ink-soft">FROM PRIVATE COLLECTION</p>
          <a
            href="#catalog"
            className="mt-4 inline-block w-fit border border-gold text-gold px-6 py-2 text-sm tracking-wide hover:bg-gold hover:text-ivory-light transition-colors"
          >
            进入商城 · SHOP COLLECTION
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-5xl w-full px-4">
        {/* Trust badges */}
        <section className="py-12">
          <TrustBadges />
        </section>

        <Divider className="mb-12" />

        {/* Story section */}
        <section className="grid sm:grid-cols-2 gap-8 items-center py-4 mb-16">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded">
            <Image
              src="/marketing/lanyu-story.jpg"
              alt="从珍藏到分享"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-serif text-2xl text-ink">从珍藏到分享</p>
            <Divider className="!justify-start" />
            <p className="text-ink-soft leading-relaxed">
              希望每一块玉石，
              <br />
              都能遇见属于自己的珍惜之人。
            </p>
            <p className="text-xs tracking-widest text-ink-soft mt-2">
              EVERY STONE DESERVES SOMEONE WHO TREASURES IT
            </p>
          </div>
        </section>

        {/* Category nav */}
        <section id="catalog" className="pt-4">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Link
              href="/"
              className={`px-4 py-1.5 text-sm border rounded-full transition-colors ${
                !activeCategory
                  ? "bg-gold text-ivory-light border-gold"
                  : "border-line text-ink-soft hover:border-gold hover:text-gold"
              }`}
            >
              全部 All
            </Link>
            {PRODUCT_CATEGORIES.filter((c) => c.value !== "OTHER").map((c) => (
              <Link
                key={c.value}
                href={`/?category=${c.value}`}
                className={`px-4 py-1.5 text-sm border rounded-full transition-colors ${
                  activeCategory === c.value
                    ? "bg-gold text-ivory-light border-gold"
                    : "border-line text-ink-soft hover:border-gold hover:text-gold"
                }`}
              >
                {c.zh}
              </Link>
            ))}
          </div>

          {/* Product grid */}
          {products.length === 0 ? (
            <p className="text-ink-soft text-center pb-16">暂无商品 · No products yet. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pb-20">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group flex flex-col gap-2"
                >
                  <div className="aspect-square bg-ivory-light border border-line rounded overflow-hidden relative">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:opacity-90"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-ink-soft text-sm">
                        No image
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-serif text-ink">{product.name}</p>
                    <p className="text-gold">{formatPrice(product.priceCents)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
