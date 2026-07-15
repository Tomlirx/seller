import Link from "next/link";
import Image from "next/image";
import { categoryLabel } from "@/lib/categories";
import { Price } from "@/components/price";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  priceCents: number;
  imageUrls: string[];
  isSold?: boolean;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col gap-3">
      <div className="aspect-square bg-stage overflow-hidden relative transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-product)]">
        {product.imageUrls[0] ? (
          <>
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-[1.04] ${product.isSold ? "brightness-[0.55] grayscale-[0.5]" : ""}`}
            />
            {product.isSold && (
              <span className="absolute top-2 right-2 z-20 bg-canvas/90 text-gold text-[10px] tracking-[0.15em] px-2.5 py-1 border border-gold/40">
                已售 SOLD
              </span>
            )}
            {!product.isSold && (
              <div className="absolute inset-0 flex items-center justify-center bg-stage-ink/0 group-hover:bg-stage-ink/10 transition-colors">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-stage/90 text-stage-ink text-xs tracking-widest px-3 py-1.5">
                  查看详情 VIEW
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-stage-ink-soft text-sm">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="font-serif font-medium text-ink">{product.name}</p>
        <p className="text-sm text-text-faint">{categoryLabel(product.category)?.zh ?? product.category}</p>
        <p><Price priceCents={product.priceCents} /></p>
      </div>
    </Link>
  );
}
