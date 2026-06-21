import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/new" className="bg-black text-white rounded px-3 py-2 text-sm">
          New product
        </Link>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Price</th>
            <th className="py-2">Stock</th>
            <th className="py-2">Active</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="py-2">{product.name}</td>
              <td className="py-2">{formatPrice(product.priceCents)}</td>
              <td className="py-2">{product.stockQty}</td>
              <td className="py-2">{product.isActive ? "Yes" : "No"}</td>
              <td className="py-2">
                <Link href={`/admin/products/${product.id}`} className="underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && <p className="text-zinc-500 mt-4">No products yet.</p>}
    </div>
  );
}
