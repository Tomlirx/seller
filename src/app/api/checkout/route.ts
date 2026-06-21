import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
  }

  const productIds = parsed.data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  const lineItems: { product: (typeof products)[number]; quantity: number }[] = [];
  for (const item of parsed.data.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json({ error: "A product in your cart is no longer available" }, { status: 400 });
    }
    if (product.stockQty < item.quantity) {
      return NextResponse.json({ error: `Not enough stock for ${product.name}` }, { status: 400 });
    }
    lineItems.push({ product, quantity: item.quantity });
  }

  const totalCents = lineItems.reduce((sum, i) => sum + i.product.priceCents * i.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      totalCents,
      items: {
        create: lineItems.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          unitPriceCents: i.product.priceCents,
        })),
      },
    },
  });

  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email ?? undefined,
    line_items: lineItems.map((i) => ({
      quantity: i.quantity,
      price_data: {
        currency: "usd",
        unit_amount: i.product.priceCents,
        product_data: { name: i.product.name },
      },
    })),
    shipping_address_collection: { allowed_countries: ["US", "CA"] },
    success_url: `${origin}/checkout/success?orderId=${order.id}`,
    cancel_url: `${origin}/cart`,
    client_reference_id: order.id,
    metadata: { orderId: order.id },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: checkoutSession.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
