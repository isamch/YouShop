const { Client } = require('pg');

async function setupDatabases() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'isampgsql123!',
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    const databases = ['auth_db', 'catalog_db', 'inventory_db', 'orders_db'];
    
    for (const db of databases) {
      try {
        await client.query(`CREATE DATABASE ${db}`);
        console.log(`✅ Database ${db} created`);
      } catch (error) {
        if (error.code === '42P04') {
          console.log(`⚠️  Database ${db} already exists`);
        } else {
          console.error(`❌ Error creating ${db}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    console.log('Make sure PostgreSQL is running and credentials are correct');
  } finally {
    await client.end();
  }
}

setupDatabases();