import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { categoryLabel } from "@/lib/categories";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  priceCents: number;
  imageUrls: string[];
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
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-stage-ink/0 group-hover:bg-stage-ink/10 transition-colors">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-stage/90 text-stage-ink text-xs tracking-widest px-3 py-1.5">
                查看详情 VIEW
              </span>
            </div>
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
        <p className="text-gold">{formatPrice(product.priceCents)}</p>
      </div>
    </Link>
  );
}
