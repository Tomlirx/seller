import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";

type Product = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrls: string[];
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col gap-2">
      <div className="aspect-square bg-ivory-light border border-line rounded overflow-hidden relative">
        {product.imageUrls[0] ? (
          <>
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:opacity-90"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-ink/0 group-hover:bg-ink/10 transition-colors">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-ivory-light/90 text-ink text-xs tracking-widest px-3 py-1.5 rounded-full">
                查看详情 VIEW
              </span>
            </div>
          </>
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
  );
}
