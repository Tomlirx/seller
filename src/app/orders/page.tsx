import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex-1 mx-auto max-w-2xl w-full px-4 py-10">
      <h1 className="font-serif text-2xl text-ink mb-6">我的订单 · Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-ink-soft">暂无订单 · No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-line rounded p-4 bg-ivory-light">
              <div className="flex items-center justify-between mb-2">
                <p className="font-serif text-ink">订单 #{order.id.slice(-8)}</p>
                <span className="text-sm uppercase tracking-wide text-gold">
                  {order.status}
                </span>
              </div>
              <ul className="text-sm text-ink-soft mb-2">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity}× {item.product.name}
                  </li>
                ))}
              </ul>
              <p className="font-serif text-gold">{formatPrice(order.totalCents)}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
