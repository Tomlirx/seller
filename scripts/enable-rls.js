const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    await client.connect();
    console.log('✓ Connected to production database');

    const { rows } = await client.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public';
    `);

    for (const { tablename } of rows) {
      await client.query(`ALTER TABLE "public"."${tablename}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`✓ Enabled RLS on "${tablename}"`);
    }

    console.log(`\nDone. Enabled RLS on ${rows.length} table(s).`);
  } catch (error) {
    console.error('✗ Failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
