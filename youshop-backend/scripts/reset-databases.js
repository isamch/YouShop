const { Client } = require('pg');

const databases = [
  { name: 'auth_db', port: 5432 },
  { name: 'catalog_db', port: 5432 },
  { name: 'inventory_db', port: 5432 },
  { name: 'orders_db', port: 5432 }
];

async function resetDatabases() {
  console.log('🗑️ Starting database reset...');

  for (const db of databases) {
    try {
      // Connect to postgres default database
      const client = new Client({
        host: 'localhost',
        port: db.port,
        user: 'postgres',
        password: 'isampgsql123!',
        database: 'postgres'
      });

      await client.connect();
      console.log(`📡 Connected to PostgreSQL on port ${db.port}`);

      // Terminate all connections to the target database
      await client.query(`
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = '${db.name}' AND pid <> pg_backend_pid()
      `);

      // Drop database if exists
      await client.query(`DROP DATABASE IF EXISTS ${db.name}`);
      console.log(`🗑️ Dropped database: ${db.name}`);

      // Create database
      await client.query(`CREATE DATABASE ${db.name}`);
      console.log(`✅ Created database: ${db.name}`);

      await client.end();
    } catch (error) {
      console.error(`❌ Error with database ${db.name}:`, error.message);
    }
  }

  console.log('✅ Database reset completed!');
}

resetDatabases().catch(console.error);