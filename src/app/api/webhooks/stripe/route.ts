import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (order && order.status === "PENDING") {
        const shipping = session.collected_information?.shipping_details ?? null;

        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data: {
              status: "PAID",
              shippingName: shipping?.name,
              shippingLine1: shipping?.address?.line1,
              shippingLine2: shipping?.address?.line2,
              shippingCity: shipping?.address?.city,
              shippingState: shipping?.address?.state,
              shippingPostal: shipping?.address?.postal_code,
              shippingCountry: shipping?.address?.country,
            },
          }),
          ...order.items.map((item) =>
            prisma.product.update({
              where: { id: item.productId },
              data: { stockQty: { decrement: item.quantity } },
            })
          ),
        ]);
      }
    }
  }

  return NextResponse.json({ received: true });
}
