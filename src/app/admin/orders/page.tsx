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
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-zinc-500">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">Order #{order.id.slice(-8)}</p>
                  <p className="text-sm text-zinc-500">{order.user.email}</p>
                </div>
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </div>
              <ul className="text-sm text-zinc-600 mb-2">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity}× {item.product.name}
                  </li>
                ))}
              </ul>
              {order.shippingLine1 && (
                <p className="text-sm text-zinc-500 mb-2">
                  Ship to: {order.shippingName}, {order.shippingLine1}
                  {order.shippingLine2 ? `, ${order.shippingLine2}` : ""}, {order.shippingCity},{" "}
                  {order.shippingState} {order.shippingPostal}, {order.shippingCountry}
                </p>
              )}
              <p className="font-medium">{formatPrice(order.totalCents)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
