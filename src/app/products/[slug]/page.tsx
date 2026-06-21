import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/add-to-cart-button";

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

  return (
    <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-10 grid sm:grid-cols-2 gap-8">
      <div className="aspect-square bg-zinc-100 rounded overflow-hidden relative">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-zinc-400 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-xl">{formatPrice(product.priceCents)}</p>
        <p className="text-zinc-600 whitespace-pre-line">{product.description}</p>
        {product.stockQty > 0 ? (
          <AddToCartButton
            productId={product.id}
            name={product.name}
            priceCents={product.priceCents}
            imageUrl={product.imageUrl}
          />
        ) : (
          <p className="text-red-600 font-medium">Out of stock</p>
        )}
      </div>
    </main>
  );
}
