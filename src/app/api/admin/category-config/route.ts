import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PRODUCT_CATEGORY_VALUES } from "@/lib/categories";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const configs = await prisma.categoryConfig.findMany();
  return Response.json(configs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category, imageUrl } = await req.json();

  if (!PRODUCT_CATEGORY_VALUES.includes(category)) {
    return Response.json({ error: "Invalid category" }, { status: 400 });
  }

  const config = await prisma.categoryConfig.upsert({
    where: { category },
    create: { category, imageUrl: imageUrl || null },
    update: { imageUrl: imageUrl || null },
  });

  return Response.json(config);
}
