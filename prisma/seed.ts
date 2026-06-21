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

  const products = [
    {
      name: "Ceramic Mug",
      slug: "ceramic-mug",
      description: "A handmade ceramic mug, perfect for your morning coffee.",
      priceCents: 1800,
      stockQty: 25,
    },
    {
      name: "Canvas Tote Bag",
      slug: "canvas-tote-bag",
      description: "A sturdy canvas tote bag for everyday errands.",
      priceCents: 2200,
      stockQty: 40,
    },
    {
      name: "Scented Candle",
      slug: "scented-candle",
      description: "A soy wax candle with a warm, woody scent.",
      priceCents: 1500,
      stockQty: 30,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`Seeded admin user (${adminEmail}) and ${products.length} sample products.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
