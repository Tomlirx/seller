import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { OrderStatusSelect } from "@/components/order-status-select";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink mb-6">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-ink-soft">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-line rounded p-4 bg-ivory-light">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-serif text-ink">Order #{order.id.slice(-8)}</p>
                  <p className="text-sm text-ink-soft">{order.user.email}</p>
                </div>
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </div>
              <ul className="text-sm text-ink-soft mb-2">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity}× {item.product.name}
                  </li>
                ))}
              </ul>
              {order.shippingLine1 && (
                <p className="text-sm text-ink-soft mb-2">
                  Ship to: {order.shippingName}, {order.shippingLine1}
                  {order.shippingLine2 ? `, ${order.shippingLine2}` : ""}, {order.shippingCity},{" "}
                  {order.shippingState} {order.shippingPostal}, {order.shippingCountry}
                </p>
              )}
              <p className="font-serif text-gold">{formatPrice(order.totalCents)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
