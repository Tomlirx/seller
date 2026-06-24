const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    await client.connect();
    console.log('✓ Connected to production database');

    const sql = `
      CREATE TABLE IF NOT EXISTS "public"."CategoryConfig" (
        "id" text NOT NULL,
        "category" text NOT NULL,
        "imageUrl" text,
        "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "CategoryConfig_pkey" PRIMARY KEY ("id")
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "CategoryConfig_category_key" on "public"."CategoryConfig"("category");
    `;

    await client.query(sql);
    console.log('✓ CategoryConfig table created successfully');
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
