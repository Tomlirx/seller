import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="theme-light flex-1 w-full bg-canvas text-ink">
      <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center gap-4 mb-8 text-sm">
        <Link href="/admin/products" className="font-medium text-gold underline">
          Products
        </Link>
        <Link href="/admin/orders" className="font-medium text-gold underline">
          Orders
        </Link>
        <Link href="/admin/categories" className="font-medium text-gold underline">
          Categories
        </Link>
      </div>
        {children}
      </div>
    </main>
  );
}
