import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Divider } from "@/components/divider";
import { TrustBadges } from "@/components/trust-badges";
import { PageContainer } from "@/components/page-container";
import { CategoryGrid } from "@/components/category-grid";
import { HeroCarousel } from "@/components/hero-carousel";

export const dynamic = "force-dynamic";

const INSTAGRAM_IMAGES = [
  "/marketing/lanyu-hero.jpg",
  "/marketing/lanyu-guanyin.jpg",
  "/marketing/lanyu-story.jpg",
  "/marketing/lanyu-hero.jpg",
  "/marketing/lanyu-guanyin.jpg",
];

export default async function Home() {
  const featured = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  const [heroProduct, ...gridProducts] = featured;

  return (
    <main className="flex-1">
      <HeroCarousel />

      <PageContainer>
        {/* Trust badges */}
        <section className="py-16">
          <TrustBadges />
        </section>

        <Divider className="mb-16" />

        {/* Philosophy quote, on ink-wash mountain backdrop */}
        <section className="relative text-center py-20 mb-16 overflow-hidden rounded">
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/marketing/lanyu-hero-illustrated.svg"
              alt=""
              fill
              className="object-cover object-top"
            />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto px-4">
            <p className="text-xs tracking-[0.25em] text-gold mb-3">品牌理念</p>
            <p className="font-serif text-2xl text-ink leading-relaxed">
              每一件作品
              <br />
              都承载一份祝福
            </p>
            <p className="text-sm text-ink-soft mt-4 leading-relaxed">
              我们相信，玉石不仅是自然的馈赠，
              <br />
              更是连接内心与世界的桥梁。
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-1 text-sm text-gold mt-6 hover:underline"
            >
              了解更多 <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        {/* Category circles */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <p className="font-serif text-2xl text-ink">藏品系列</p>
            <p className="text-xs tracking-widest text-ink-soft mt-2">CURATED COLLECTIONS</p>
          </div>
          <CategoryGrid variant="circles" />
        </section>

        {/* Featured gallery */}
        {heroProduct && (
          <section className="mb-20">
            <div className="text-center mb-10">
              <p className="font-serif text-2xl text-ink">精选珍品</p>
              <p className="text-xs tracking-widest text-ink-soft mt-2">FEATURED PIECES</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href={`/products/${heroProduct.slug}`}
                className="group aspect-[4/5] bg-ivory-light border border-line rounded overflow-hidden relative"
              >
                {heroProduct.imageUrls[0] ? (
                  <Image
                    src={heroProduct.imageUrls[0]}
                    alt={heroProduct.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-ink-soft text-sm">
                    No image
                  </div>
                )}
              </Link>
              <div className="grid grid-cols-2 gap-4">
                {gridProducts.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group aspect-square bg-ivory-light border border-line rounded overflow-hidden relative"
                  >
                    {product.imageUrls[0] ? (
                      <Image
                        src={product.imageUrls[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-ink-soft text-xs">
                        No image
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Craftsmanship */}
        <section className="grid sm:grid-cols-2 gap-8 items-center py-4 mb-20">
          <div className="flex flex-col gap-3">
            <p className="text-xs tracking-[0.25em] text-gold">匠心工艺</p>
            <p className="font-serif text-2xl text-ink">传承千年工艺</p>
            <p className="font-serif text-2xl text-ink">匠心手作</p>
            <Divider className="!justify-start" />
            <p className="text-ink-soft leading-relaxed">
              从选料到成品，
              <br />
              每一步都凝聚匠人的心血与专注。
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded">
            <Image src="/marketing/lanyu-story.jpg" alt="匠心工艺" fill className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-ink/10">
              <span
                aria-disabled="true"
                title="视频即将上线 Video coming soon"
                className="cursor-default flex h-14 w-14 items-center justify-center rounded-full bg-ivory-light/90 text-ink"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M8 5 L19 12 L8 19 Z" />
                </svg>
              </span>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <p className="font-serif text-2xl text-ink">藏家故事</p>
            <p className="text-xs tracking-widest text-ink-soft mt-2">FROM OUR COLLECTORS</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex gap-4 border border-line rounded p-6">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-full overflow-hidden bg-ivory-light">
                <Image src="/marketing/lanyu-guanyin.jpg" alt="" fill className="object-cover" />
              </div>
              <div>
                <p className="text-ink leading-relaxed">
                  “这块观音让我在困境中找到内心的平静与力量。”
                </p>
                <p className="text-xs tracking-widest text-ink-soft mt-3">— 来自上海的藏家</p>
              </div>
            </div>
            <div className="flex gap-4 border border-line rounded p-6">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-full overflow-hidden bg-ivory-light">
                <Image src="/marketing/lanyu-story.jpg" alt="" fill className="object-cover" />
              </div>
              <div>
                <p className="text-ink leading-relaxed">
                  “岚玉的品质和寓意，是我送给家人的最好礼物。”
                </p>
                <p className="text-xs tracking-widest text-ink-soft mt-3">— 来自北京的藏家</p>
              </div>
            </div>
          </div>
        </section>

        {/* Instagram strip */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs tracking-widest text-ink-soft">INSTAGRAM</p>
            <span
              title="即将上线 Coming soon"
              className="cursor-default flex items-center gap-2 text-xs tracking-widest text-ink-soft"
            >
              关注我们 @lanyu.jade
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {INSTAGRAM_IMAGES.map((src, i) => (
              <div key={i} className="aspect-square relative bg-ivory-light border border-line rounded overflow-hidden">
                <Image src={src} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      </PageContainer>
    </main>
  );
}
