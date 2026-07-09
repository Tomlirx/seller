import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/page-container";
import { Divider } from "@/components/divider";
import { CollectionFilters } from "@/components/collection-filters";
import { ProductCard } from "@/components/product-card";
import { categoryLabel, PRODUCT_CATEGORY_VALUES, ProductCategoryValue } from "@/lib/categories";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const label = categoryLabel(category as ProductCategoryValue);
  if (!label) return {};
  return {
    title: `${label.zh} ${label.en}`,
    description: label.description || `岚玉 ${label.zh} 系列 — 天然翡翠精选藏品。`,
  };
}

export default async function CollectionCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string; min?: string; max?: string }>;
}) {
  const { category } = await params;
  if (!PRODUCT_CATEGORY_VALUES.includes(category as ProductCategoryValue)) {
    notFound();
  }
  const activeCategory = category as ProductCategoryValue;
  const label = categoryLabel(activeCategory);

  const { page, min, max } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);
  const minCents = min ? Number(min) * 100 : undefined;
  const maxCents = max ? Number(max) * 100 : undefined;

  const where = {
    isActive: true,
    category: activeCategory,
    ...(minCents !== undefined || maxCents !== undefined
      ? {
          priceCents: {
            ...(minCents !== undefined ? { gte: minCents } : {}),
            ...(maxCents !== undefined ? { lte: maxCents } : {}),
          },
        }
      : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="flex-1">
      <PageContainer className="py-16">
        <nav className="text-xs text-ink-soft mb-6">
          <Link href="/" className="hover:text-gold">首页 Home</Link>
          {" / "}
          <Link href="/collections" className="hover:text-gold">品类 Collections</Link>
          {" / "}
          <span className="text-ink">{label?.zh}</span>
        </nav>

        <div className="text-center mb-10">
          <p className="font-serif text-2xl text-ink">{label?.zh}</p>
          <p className="text-xs tracking-widest text-ink-soft mt-2">{label?.en.toUpperCase()}</p>
          {label?.description && <p className="text-sm text-ink-soft mt-3">{label.description}</p>}
          <Divider className="mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] gap-10">
          <CollectionFilters active={activeCategory} />

          <div>
            {products.length === 0 ? (
              <p className="text-ink-soft text-center py-16">暂无商品 · No products yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/collections/${activeCategory}?page=${p}`}
                    className={`h-8 w-8 flex items-center justify-center rounded-full border text-sm transition-colors ${
                      p === pageNum
                        ? "bg-gold text-canvas border-gold"
                        : "border-line text-ink-soft hover:border-gold hover:text-gold"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
