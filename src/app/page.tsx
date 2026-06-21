import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Shop</h1>
      {products.length === 0 ? (
        <p className="text-zinc-500">No products yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex flex-col gap-2"
            >
              <div className="aspect-square bg-zinc-100 rounded overflow-hidden relative">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:opacity-90"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-zinc-400 text-sm">
                    No image
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-zinc-600">{formatPrice(product.priceCents)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
