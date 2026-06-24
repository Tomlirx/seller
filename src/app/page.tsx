import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { TrustBadges } from "@/components/trust-badges";
import { PageContainer } from "@/components/page-container";
import { CategoryGrid } from "@/components/category-grid";
import { categoryLabel } from "@/lib/categories";
import { HeroCarousel } from "@/components/hero-carousel";
import { NewsletterForm } from "@/components/newsletter-form";
import { FadeInSection } from "@/components/fade-in-section";

export const dynamic = "force-dynamic";

const INSTAGRAM_IMAGES = [
  "/marketing/lanyu-pendant-rock.png",
  "/marketing/lanyu-guanyin.jpg",
  "/marketing/lanyu-buddha.png",
  "/marketing/lanyu-story.jpg",
  "/marketing/lanyu-moongate.png",
];

const USP_ITEMS = [
  {
    zh: "天然玉石",
    en: "坚持天然A货玉石，每件均经过严格甄选。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-9 w-9">
        <path d="M12 3 L19 9 L16 21 L8 21 L5 9 Z" strokeLinejoin="round" />
        <path d="M12 3 L12 21 M5 9 L19 9" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    zh: "原创设计",
    en: "融合东方文化与现代设计语言，打造经典作品。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-9 w-9">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8 L12 16 M8 12 L16 12" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    zh: "匠心工艺",
    en: "多年玉雕师手工制作，每件作品独一无二。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-9 w-9">
        <path d="M4 20 L10 14 M13 11 L20 4 L19 8 L16 11 L13 11 Z" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="8.5" cy="15.5" r="2.2" />
      </svg>
    ),
  },
  {
    zh: "终身养护",
    en: "提供保养、清洁、收藏咨询服务。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-9 w-9">
        <path d="M12 21 C6 16 3 12.5 3 8.8 C3 6.1 5.1 4 7.7 4 C9.7 4 11.1 5.1 12 6.7 C12.9 5.1 14.3 4 16.3 4 C18.9 4 21 6.1 21 8.8 C21 12.5 18 16 12 21 Z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default async function Home() {
  const featured = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
  const manualCollection = await prisma.product.findMany({
    where: { isActive: true, isCollectionFeatured: true },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });
  const manualCollectionIds = new Set(manualCollection.map((p) => p.id));
  const collectionProducts =
    manualCollection.length >= 5
      ? manualCollection
      : [...manualCollection, ...featured.filter((p) => !manualCollectionIds.has(p.id))].slice(0, 5);

  const remaining = featured.slice(5).length >= 3 ? featured.slice(5) : featured.slice(0, 3);

  const manualFeatured = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { updatedAt: "desc" },
    take: 3,
  });
  const manualFeaturedIds = new Set(manualFeatured.map((p) => p.id));
  const featuredSelection =
    manualFeatured.length >= 3
      ? manualFeatured
      : [...manualFeatured, ...remaining.filter((p) => !manualFeaturedIds.has(p.id))].slice(0, 3);
  const [heroProduct, ...gridProducts] = featuredSelection;

  return (
    <main className="flex-1">
      <HeroCarousel />

      {/* Brand / Philosophy */}
      <FadeInSection>
        <section className="relative py-24 sm:py-36 bg-[#FAF8F4] overflow-hidden">
          <div className="absolute -right-[8%] -top-[5%] w-[60%] h-[120%] opacity-[0.07] pointer-events-none">
            <Image src="/marketing/lanyu-ink-mountain.png" alt="" fill className="object-cover" />
          </div>
          <PageContainer>
            <div className="relative z-10 grid sm:grid-cols-[44%_56%] gap-12 sm:gap-20 items-center">
              <div className="flex flex-col gap-5">
                <p className="text-xs tracking-[0.3em] text-gold">BRAND PHILOSOPHY</p>
                <h2 className="font-serif text-3xl sm:text-4xl text-ink leading-tight">东方玉石美学</h2>
                <p className="text-ink-soft leading-[2]">
                  岚玉相信，真正值得珍藏的作品，
                  <br />
                  不仅来自天然玉石，更来自时间、文化与匠人的温度。
                  <br />
                  我们希望每一件作品，都能成为佩戴者生命故事的一部分。
                </p>
                <Link href="/collections" className="inline-flex items-center gap-2 text-sm text-gold mt-4 hover:translate-x-1 transition-transform">
                  了解品牌 <span aria-hidden>→</span>
                </Link>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/marketing/lanyu-moongate.png"
                  alt="东方玉石美学"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-[1.04]"
                />
              </div>
            </div>
          </PageContainer>
        </section>
      </FadeInSection>

      {/* Intro banner */}
      <FadeInSection>
        <Link href="/collections/BANGLE">
          <section className="relative w-full h-[40vh] sm:h-[55vh] cursor-pointer group overflow-hidden">
            <Image src="/marketing/lanyu-bangle-banner.png" alt="手镯 Bangle Collection" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
          </section>
        </Link>
      </FadeInSection>

      {/* Collection grid */}
      {collectionProducts.length > 0 && (
        <FadeInSection>
          <section className="py-24 sm:py-36 bg-white">
            <PageContainer>
              <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
                <div>
                  <p className="text-xs tracking-[0.3em] text-gold mb-3">COLLECTION</p>
                  <h2 className="font-serif text-3xl sm:text-4xl text-ink mb-3">精选系列</h2>
                  <p className="text-ink-soft text-sm max-w-md">以天然翡翠、和田玉及东方珠宝为灵感，探索岚玉当代东方设计语言。</p>
                </div>
                <Link href="/collections" className="text-sm text-gold hover:underline whitespace-nowrap">
                  查看全部 →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-7">
                {collectionProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.slug}`} className="group cursor-pointer transition-transform duration-300 hover:-translate-y-2">
                    <div className="relative aspect-square bg-[#F8F5F0] p-8 sm:p-10 overflow-hidden">
                      {product.imageUrls[0] ? (
                        <>
                          <Image
                            src={product.imageUrls[0]}
                            alt={product.name}
                            fill
                            className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.08]"
                          />
                          <span className="absolute top-2 left-2 z-10 bg-ink/80 text-ivory-light text-[9px] tracking-[0.1em] px-2 py-1">实物原图</span>
                        </>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-ink-soft text-xs">No image</div>
                      )}
                    </div>
                    <div className="pt-5 text-center">
                      <h3 className="font-serif text-base sm:text-lg text-ink mb-1">{product.name}</h3>
                      <p className="text-[11px] tracking-[0.15em] text-[#998E84]">{categoryLabel(product.category)?.zh}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </PageContainer>
          </section>
        </FadeInSection>
      )}

      {/* Featured gallery */}
      {heroProduct && (
        <FadeInSection>
          <section className="py-24 sm:py-40 bg-[#F7F3ED]">
            <PageContainer>
              <div className="grid sm:grid-cols-[38%_62%] gap-12 sm:gap-20 items-center">
                <div className="flex flex-col gap-5">
                  <p className="text-xs tracking-[0.3em] text-gold">FEATURED</p>
                  <h2 className="font-serif text-3xl sm:text-4xl text-ink">甄选珍品</h2>
                  <p className="text-ink-soft leading-[2]">
                    甄选代表岚玉品牌精神的收藏级作品，让天然玉石在现代设计中焕发新的生命。
                  </p>
                  <Link
                    href={`/products/${heroProduct.slug}`}
                    className="inline-flex w-fit items-center gap-3 border border-[#D8C7B5] text-gold px-8 py-4 text-sm tracking-wide hover:bg-gold hover:text-white transition-colors mt-2"
                  >
                    立即探索
                  </Link>
                </div>
                <div className="grid grid-cols-2 grid-rows-2 gap-5 h-[420px] sm:h-[480px]">
                  <Link href={`/products/${heroProduct.slug}`} className="group row-span-2 relative overflow-hidden">
                    {heroProduct.imageUrls[0] ? (
                      <>
                        <Image src={heroProduct.imageUrls[0]} alt={heroProduct.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-[1.06]" />
                        <span className="absolute top-3 left-3 z-10 bg-ink/80 text-ivory-light text-[10px] tracking-[0.1em] px-2.5 py-1">实物原图</span>
                      </>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-ivory-light text-ink-soft text-sm">No image</div>
                    )}
                  </Link>
                  {gridProducts.slice(0, 2).map((product) => (
                    <Link key={product.id} href={`/products/${product.slug}`} className="group relative overflow-hidden">
                      {product.imageUrls[0] ? (
                        <>
                          <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-[1.06]" />
                          <span className="absolute top-2 left-2 z-10 bg-ink/80 text-ivory-light text-[9px] tracking-[0.1em] px-2 py-1">实物原图</span>
                        </>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-ivory-light text-ink-soft text-xs">No image</div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </PageContainer>
          </section>
        </FadeInSection>
      )}

      {/* Editorial */}
      <FadeInSection>
        <section className="bg-white">
          <div className="relative w-full h-[45vh] sm:h-[60vh]">
            <Image src="/marketing/lanyu-buddha.png" alt="一块玉，一段故事" fill className="object-cover" />
            <div className="absolute inset-0 flex items-center pl-[7vw] pr-10">
              <div className="max-w-[420px]">
                <p className="text-xs tracking-[0.3em] text-[#A08E7A] mb-4 sm:mb-6">EDITORIAL</p>
                <h2 className="font-serif text-2xl sm:text-4xl text-ink leading-[1.35]">
                  一块玉，
                  <br />
                  一段故事。
                </h2>
              </div>
            </div>
          </div>
          <div className="bg-[#FBF8F4] py-24 sm:py-36">
            <PageContainer>
              <div className="max-w-[640px] mx-auto text-center">
                <p className="text-ink-soft leading-[2.1]">
                  从矿脉到匠人工作室，从设计草图到最终成品，岚玉坚持每一件作品都拥有完整的创作轨迹。真正值得珍藏的，不仅是玉石，更是其中承载的时间。
                </p>
              </div>
            </PageContainer>
          </div>
        </section>
      </FadeInSection>

      {/* USP */}
      <FadeInSection>
        <section className="py-24 sm:py-36 bg-white">
          <PageContainer>
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-xs tracking-[0.3em] text-gold mb-4">WHY LAN YU</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink mb-4">东方美学 · 匠心传承</h2>
              <p className="text-ink-soft">每一件作品，都坚持天然玉石、原创设计、手工雕刻与终身养护。</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {USP_ITEMS.map((item) => (
                <div key={item.zh} className="text-center px-4 py-6 transition-transform duration-300 hover:-translate-y-2">
                  <span className="mx-auto mb-6 flex h-20 w-20 sm:h-22 sm:w-22 items-center justify-center rounded-full border border-[#E4D8CB] text-gold">
                    {item.icon}
                  </span>
                  <h3 className="font-serif text-lg text-ink mb-3">{item.zh}</h3>
                  <p className="text-sm text-[#8E847B] leading-[1.9]">{item.en}</p>
                </div>
              ))}
            </div>
          </PageContainer>
        </section>
      </FadeInSection>

      {/* Craftsmanship */}
      <FadeInSection>
        <section className="py-24 sm:py-40 bg-[#F7F3ED]">
          <PageContainer>
            <div className="grid sm:grid-cols-[58%_42%] gap-12 sm:gap-20 items-center">
              <div className="relative aspect-[4/3] overflow-hidden order-2 sm:order-1">
                <Image src="/marketing/lanyu-story.jpg" alt="匠心工艺" fill className="object-cover transition-transform duration-1000 hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <span
                    aria-disabled="true"
                    title="视频即将上线 Video coming soon"
                    className="cursor-default flex h-[80px] w-[80px] sm:h-[90px] sm:w-[90px] items-center justify-center rounded-full bg-white transition-transform hover:scale-[1.08]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gold ml-1">
                      <path d="M8 5 L19 12 L8 19 Z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-5 order-1 sm:order-2">
                <p className="text-xs tracking-[0.3em] text-[#A28E79]">CRAFTSMANSHIP</p>
                <h2 className="font-serif text-3xl sm:text-[2.5rem] text-ink leading-[1.4]">
                  一件作品，需要经历数十道工序。
                </h2>
                <p className="text-[#8D837A] leading-[2]">
                  从原石挑选、设计绘图、玉雕、抛光、镶嵌，直到最终检验。每一步都由经验丰富的工匠完成。
                </p>
              </div>
            </div>
          </PageContainer>
        </section>
      </FadeInSection>

      {/* Story / testimonial */}
      <FadeInSection>
        <section className="py-24 sm:py-40 bg-white">
          <PageContainer>
            <div className="grid sm:grid-cols-2 gap-12 sm:gap-20 items-center">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src="/marketing/lanyu-guanyin.jpg" alt="" fill className="object-cover transition-transform duration-1000 hover:scale-105" />
              </div>
              <div>
                <p className="text-xs tracking-[0.3em] text-[#A08D78] mb-5">CUSTOMER STORY</p>
                <blockquote className="font-serif text-2xl sm:text-[2.3rem] font-light leading-[1.8] text-ink mb-7">
                  &ldquo; 我收藏的不只是玉，
                  <br />
                  而是一段值得纪念的人生。 &rdquo;
                </blockquote>
                <p className="text-[#8B8178] leading-[2] mb-3">收到作品那一刻，真正打动我的，不是它的价值，而是那种温润与安静。</p>
                <p className="text-[#8B8178] leading-[2]">它陪伴我完成了人生中很多重要时刻。</p>
                <div className="mt-7 text-gold font-medium tracking-[0.1em]">—— LAN YU Collector</div>
              </div>
            </div>
          </PageContainer>
        </section>
      </FadeInSection>

      {/* Categories */}
      <FadeInSection>
        <section className="py-24 sm:py-36 bg-[#F7F3ED]">
          <PageContainer>
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.3em] text-gold mb-3">CURATED COLLECTIONS</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink">藏品系列</h2>
            </div>
            <CategoryGrid variant="circles" />
          </PageContainer>
        </section>
      </FadeInSection>

      {/* Full-width banner */}
      <FadeInSection>
        <section className="relative w-full h-[35vh] sm:h-[50vh]">
          <Image src="/marketing/lanyu-ink-mountain.png" alt="" fill className="object-cover" />
        </section>
      </FadeInSection>

      {/* Trust badges */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <PageContainer>
            <TrustBadges />
          </PageContainer>
        </section>
      </FadeInSection>

      {/* Instagram strip */}
      <FadeInSection>
        <section className="pt-24 pb-16 sm:pt-36 sm:pb-24 bg-white">
          <PageContainer>
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.3em] text-gold mb-3">@LANYU_JADE</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink mb-3">Follow Our Journey</h2>
              <p className="text-ink-soft text-sm">Discover craftsmanship, daily inspiration, and new collections.</p>
            </div>
          </PageContainer>
          <div className="grid grid-cols-2 sm:grid-cols-5">
            {INSTAGRAM_IMAGES.map((src, i) => (
              <div key={i} className="aspect-square relative overflow-hidden">
                <Image src={src} alt="" fill className="object-cover transition-transform duration-700 hover:scale-[1.08]" />
              </div>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* Newsletter */}
      <FadeInSection>
        <section className="py-24 sm:py-40 bg-[#F6F3ED] text-center">
          <PageContainer>
            <p className="text-xs tracking-[0.3em] text-[#A88E72] mb-4">JOIN OUR NEWSLETTER</p>
            <h2 className="font-serif text-3xl sm:text-[2.6rem] text-ink leading-[1.4] mb-12">
              Receive Stories,
              <br />
              Collections &amp; Invitations
            </h2>
            <div className="max-w-[480px] mx-auto">
              <NewsletterForm />
            </div>
          </PageContainer>
        </section>
      </FadeInSection>
    </main>
  );
}
