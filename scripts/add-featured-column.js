const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    await client.connect();
    console.log('✓ Connected to production database');

    const sql = `
      ALTER TABLE "public"."Product"
      ADD COLUMN IF NOT EXISTS "isFeatured" boolean NOT NULL DEFAULT false;
    `;

    await client.query(sql);
    console.log('✓ Added Product.isFeatured column');
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
