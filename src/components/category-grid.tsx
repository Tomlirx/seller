import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PRODUCT_CATEGORIES } from "@/lib/categories";

export async function CategoryGrid({ variant = "grid" }: { variant?: "grid" | "circles" }) {
  const categories = PRODUCT_CATEGORIES.filter((c) => c.value !== "OTHER");

  const representativeProducts = await Promise.all(
    categories.map((c) =>
      prisma.product.findFirst({
        where: { category: c.value, isActive: true },
        orderBy: { createdAt: "desc" },
      })
    )
  );

  if (variant === "circles") {
    return (
      <div className="flex flex-wrap justify-center gap-8 sm:gap-10">
        {categories.map((c, i) => {
          const product = representativeProducts[i];
          const image = product?.imageUrls[0];
          return (
            <Link
              key={c.value}
              href={`/collections/${c.value}`}
              className="group flex flex-col items-center gap-3 w-24 sm:w-28"
            >
              <div className="aspect-square w-24 sm:w-28 rounded-full bg-ivory-light border border-line overflow-hidden relative">
                {image ? (
                  <Image
                    src={image}
                    alt={c.zh}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-ink-soft text-[10px] text-center px-2">
                    No image
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
        const image = product?.imageUrls[0];
        return (
          <Link
            key={c.value}
            href={`/collections/${c.value}`}
            className="group flex flex-col gap-3"
          >
            <div className="aspect-[4/5] bg-ivory-light border border-line rounded overflow-hidden relative">
              {image ? (
                <Image
                  src={image}
                  alt={c.zh}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-ink-soft text-sm">
                  No image
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
