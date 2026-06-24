import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { categoryLabel } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-ink">Products</h1>
        <Link href="/admin/products/new" className="bg-gold text-ivory-light rounded px-3 py-2 text-sm">
          New product
        </Link>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-line">
            <th className="py-2">Name</th>
            <th className="py-2">Category</th>
            <th className="py-2">Price</th>
            <th className="py-2">Stock</th>
            <th className="py-2">Active</th>
            <th className="py-2">Featured</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-line">
              <td className="py-2">{product.name}</td>
              <td className="py-2">{categoryLabel(product.category)?.zh ?? product.category}</td>
              <td className="py-2">{formatPrice(product.priceCents)}</td>
              <td className="py-2">{product.stockQty}</td>
              <td className="py-2">{product.isActive ? "Yes" : "No"}</td>
              <td className="py-2">{product.isFeatured ? "Yes" : "No"}</td>
              <td className="py-2">
                <Link href={`/admin/products/${product.id}`} className="underline text-gold">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && <p className="text-ink-soft mt-4">No products yet.</p>}
    </div>
  );
}
