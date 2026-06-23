import { prisma } from "@/lib/prisma";

export function getRecommendedProducts(excludeIds: string[], take = 4) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}
