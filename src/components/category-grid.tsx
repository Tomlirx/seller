import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PRODUCT_CATEGORIES } from "@/lib/categories";

export async function CategoryGrid({ variant = "grid" }: { variant?: "grid" | "circles" }) {
  const categories = PRODUCT_CATEGORIES;

  const representativeProducts = await Promise.all(
    categories.map((c) =>
      prisma.product.findFirst({
        where: { category: c.value, isActive: true },
        orderBy: { createdAt: "desc" },
      })
    )
  );

  const categoryConfigs = await prisma.categoryConfig.findMany();
  const categoryImageMap = Object.fromEntries(
    categoryConfigs.map((cfg) => [cfg.category, cfg.imageUrl])
  );

  if (variant === "circles") {
    return (
      <div className="flex flex-wrap justify-center gap-8 sm:gap-10">
        {categories.map((c, i) => {
          const product = representativeProducts[i];
          const image = categoryImageMap[c.value] || product?.imageUrls[0];
          return (
            <Link
              key={c.value}
              href={`/collections/${c.value}`}
              className="group flex flex-col items-center gap-3 w-24 sm:w-28"
            >
              <div className="aspect-square w-24 sm:w-28 rounded-full bg-stage border border-line-strong overflow-hidden relative flex items-center justify-center">
                {image ? (
                  <Image
                    src={image}
                    alt={c.zh}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-stage-ink-soft gap-1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="9" cy="9" r="1.5" />
                      <path d="M21 15l-5-5L7 21" />
                    </svg>
                    <span className="text-[9px] text-center px-1">{c.zh}</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="font-serif text-sm text-ink">{c.zh}</p>
                <p className="text-[10px] tracking-widest text-ink-soft">{c.en.toUpperCase()}</p>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
      {categories.map((c, i) => {
        const product = representativeProducts[i];
        const image = categoryImageMap[c.value] || product?.imageUrls[0];
        return (
          <Link
            key={c.value}
            href={`/collections/${c.value}`}
            className="group flex flex-col gap-3"
          >
            <div className="aspect-[4/5] bg-stage overflow-hidden relative flex items-center justify-center">
              {image ? (
                <Image
                  src={image}
                  alt={c.zh}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-stage-ink-soft gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="M21 15l-5-5L7 21" />
                  </svg>
                  <span className="text-xs text-center px-2">{c.zh}</span>
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="font-serif text-lg text-ink">{c.zh}</p>
              <p className="text-[11px] tracking-widest text-ink-soft">{c.en.toUpperCase()}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
