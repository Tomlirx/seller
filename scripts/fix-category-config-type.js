const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    await client.connect();
    console.log('✓ Connected to production database');

    const sql = `
      ALTER TABLE "public"."CategoryConfig"
      ALTER COLUMN "category" TYPE "ProductCategory" USING "category"::"ProductCategory";
    `;

    await client.query(sql);
    console.log('✓ Fixed CategoryConfig.category column type');
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
