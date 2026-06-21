import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin12345";

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, role: "ADMIN" },
  });

  // Remove old placeholder catalog from earlier MVP seed runs.
  await prisma.product.deleteMany({
    where: { slug: { in: ["ceramic-mug", "canvas-tote-bag", "scented-candle"] } },
  });

  const products = [
    {
      name: "翡翠佛公吊坠",
      slug: "jade-buddha-pendant",
      description: "天然翡翠手工雕刻佛公，福寿安康，寓意吉祥圆满。\nHand-carved natural jadeite Buddha pendant, symbolizing good fortune and contentment.",
      category: "BUDDHA" as const,
      priceCents: 128000,
      stockQty: 6,
    },
    {
      name: "翡翠观音吊坠",
      slug: "jade-guanyin-pendant",
      description: "慈悲观音，智慧守护，愿你始终保持善念，拥有安定而坚定的内心。\nA Guanyin pendant carved from natural jadeite — compassion, wisdom, and protection.",
      category: "GUANYIN" as const,
      priceCents: 158000,
      stockQty: 4,
    },
    {
      name: "翡翠福豆吊坠",
      slug: "jade-fortune-bean-pendant",
      description: "福豆寓意福气连连，小巧精致，适合日常佩戴。\nA fortune bean pendant — natural jadeite, delicate and meant for everyday wear.",
      category: "FORTUNE_BEAN" as const,
      priceCents: 68000,
      stockQty: 12,
    },
    {
      name: "翡翠叶子吊坠",
      slug: "jade-leaf-pendant",
      description: "翠叶吊坠，温润通透，象征生机与希望。\nA jade leaf pendant, smooth and luminous, symbolizing vitality and hope.",
      category: "LEAF" as const,
      priceCents: 72000,
      stockQty: 10,
    },
    {
      name: "翡翠如意吊坠",
      slug: "jade-ruyi-pendant",
      description: "如意吊坠，寓意万事如意，事业顺遂。\nA ruyi pendant carved from natural jadeite, symbolizing that all wishes come true.",
      category: "RUYI" as const,
      priceCents: 98000,
      stockQty: 8,
    },
    {
      name: "翡翠手镯",
      slug: "jade-bangle",
      description: "天然翡翠手镯，圆润饱满，是传家与珍藏的经典之选。\nA natural jadeite bangle — full, smooth, and a classic choice for heirloom collections.",
      category: "BANGLE" as const,
      priceCents: 268000,
      stockQty: 5,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`Seeded admin user (${adminEmail}) and ${products.length} jade products.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
