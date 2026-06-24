import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { PRODUCT_CATEGORY_VALUES } from "@/lib/categories";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  description: z.string(),
  category: z.enum(PRODUCT_CATEGORY_VALUES),
  priceCents: z.number().int().nonnegative(),
  imageUrls: z.array(z.string().url()),
  stockQty: z.number().int().nonnegative(),
  isActive: z.boolean(),
  isFeatured: z.boolean().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: parsed.data,
  });

  return NextResponse.json(product, { status: 201 });
}
