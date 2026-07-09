import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { PageContainer } from "@/components/page-container";
import { Divider } from "@/components/divider";

const STATUS_LABELS: Record<string, { zh: string; className: string }> = {
  PENDING: { zh: "待付款", className: "text-text-muted border-line" },
  PAID: { zh: "已付款", className: "text-gold border-gold/40" },
  FULFILLED: { zh: "已发货", className: "text-success border-line" },
  CANCELLED: { zh: "已取消", className: "text-text-faint border-line" },
};

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
    <main className="flex-1">
      <PageContainer className="py-16 max-w-3xl">
        <p className="text-xs tracking-[0.3em] text-gold mb-3">MY ORDERS</p>
        <h1 className="font-serif text-3xl text-ink mb-4">我的订单 · Your Orders</h1>
        <Divider className="mb-10" />
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-ink-soft mb-6">暂无订单 · No orders yet.</p>
            <Link
              href="/collections"
              data-cta
              className="inline-flex items-center gap-3 border border-gold/40 text-gold px-8 py-4 text-sm uppercase tracking-[0.12em] hover:bg-gold hover:text-canvas transition-colors"
            >
              去逛逛 Browse Collections
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => {
              const status = STATUS_LABELS[order.status] ?? { zh: order.status, className: "text-text-muted border-line" };
              return (
                <div key={order.id} className="border border-line p-6 bg-surface">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-serif text-ink">订单 #{order.id.slice(-8)}</p>
                    <span className={`text-[11px] tracking-[0.15em] border px-2.5 py-1 ${status.className}`}>
                      {status.zh} {order.status}
                    </span>
                  </div>
                  <ul className="text-sm text-ink-soft mb-4">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.quantity}× {item.product.name}
                      </li>
                    ))}
                  </ul>
                  <p className="font-serif text-gold text-right">{formatPrice(order.totalCents)}</p>
                </div>
              );
            })}
          </div>
        )}
      </PageContainer>
    </main>
  );
}
