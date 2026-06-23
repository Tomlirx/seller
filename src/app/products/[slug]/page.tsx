import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { categoryLabel } from "@/lib/categories";
import { Divider } from "@/components/divider";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { BuyNowButton } from "@/components/buy-now-button";
import { ProductGallery } from "@/components/product-gallery";
import { PageContainer } from "@/components/page-container";
import { TrustBadges } from "@/components/trust-badges";
import { ProductCard } from "@/components/product-card";
import { StickyAddToCartBar } from "@/components/sticky-add-to-cart-bar";
import { getRecommendedProducts } from "@/lib/recommendations";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product || !product.isActive) {
    notFound();
  }

  const category = categoryLabel(product.category);
  const recommended = await getRecommendedProducts([product.id], 4);
  const sentinelId = `add-to-cart-sentinel-${product.id}`;

  return (
    <main className="flex-1">
      <PageContainer className="py-10">
        <nav className="text-xs text-ink-soft mb-6">
          <Link href="/" className="hover:text-gold">首页 Home</Link>
          {" / "}
          {category && (
            <>
              <Link href={`/collections/${product.category}`} className="hover:text-gold">
                {category.zh}
              </Link>
              {" / "}
            </>
          )}
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid sm:grid-cols-2 gap-10">
          <ProductGallery images={product.imageUrls} alt={product.name} />
          <div className="flex flex-col gap-4">
            {category && (
              <p className="text-xs tracking-widest text-gold">
                {category.zh} · {category.en.toUpperCase()}
              </p>
            )}
            <h1 className="font-serif text-2xl text-ink">{product.name}</h1>
            <Divider className="!justify-start" />
            <p className="text-xl text-gold">{formatPrice(product.priceCents)}</p>
            <p className="text-ink-soft whitespace-pre-line leading-relaxed">{product.description}</p>

            <span className="inline-block w-fit text-xs border border-line rounded-full px-3 py-1 text-ink-soft">
              天然翡翠 · 单品现货 NATURAL JADEITE · SINGLE PIECE
            </span>

            {product.stockQty > 0 ? (
              <div id={sentinelId} className="flex flex-col gap-3">
                <AddToCartButton
                  productId={product.id}
                  name={product.name}
                  priceCents={product.priceCents}
                  imageUrl={product.imageUrls[0] ?? null}
                />
                <BuyNowButton productId={product.id} />
              </div>
            ) : (
              <p className="text-red-600 font-medium">Out of stock</p>
            )}

            <div className="mt-2">
              <TrustBadges
                items={[
                  { icon: "shield", zh: "严选品质", en: "QUALITY" },
                  { icon: "leaf", zh: "匠心甄选", en: "CURATED" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Product details / quality */}
        <section className="grid sm:grid-cols-2 gap-8 mt-20">
          <div>
            <p className="font-serif text-xl text-ink mb-3">商品详情</p>
            <Divider className="!justify-start mb-4" />
            <p className="text-ink-soft leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
          <div>
            <p className="font-serif text-xl text-ink mb-3">品质保障</p>
            <Divider className="!justify-start mb-4" />
            <p className="text-ink-soft leading-relaxed">
              每一件岚玉商品均经过严格筛选与品质鉴定，确保天然无染色、无人工处理。
              <br />
              Every piece is carefully inspected to ensure it is natural, untreated jadeite.
            </p>
          </div>
        </section>

        {/* Packaging & service */}
        <section className="mt-16">
          <p className="font-serif text-xl text-ink mb-3">包装与服务</p>
          <Divider className="!justify-start mb-4" />
          <p className="text-ink-soft leading-relaxed">
            精致礼盒包装，附带证书与保养说明，支持七天无理由退换。
            <br />
            Presented in an elegant gift box with a certificate of authenticity and care instructions. 7-day no-questions-asked returns.
          </p>
        </section>

        {/* Recommendations */}
        {recommended.length > 0 && (
          <section className="mt-20">
            <div className="text-center mb-10">
              <p className="font-serif text-2xl text-ink">为你推荐</p>
              <p className="text-xs tracking-widest text-ink-soft mt-2">RECOMMENDED FOR YOU</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {recommended.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </PageContainer>

      {product.stockQty > 0 && (
        <StickyAddToCartBar
          productId={product.id}
          name={product.name}
          priceCents={product.priceCents}
          imageUrl={product.imageUrls[0] ?? null}
          sentinelId={sentinelId}
        />
      )}
    </main>
  );
}
