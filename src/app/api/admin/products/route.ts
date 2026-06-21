import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  description: z.string(),
  priceCents: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  stockQty: z.number().int().nonnegative(),
  isActive: z.boolean(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { imageUrl, ...rest } = parsed.data;

  const existing = await prisma.product.findUnique({ where: { slug: rest.slug } });
  if (existing) {
    return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: { ...rest, imageUrl: imageUrl || null },
  });

  return NextResponse.json(product, { status: 201 });
}
