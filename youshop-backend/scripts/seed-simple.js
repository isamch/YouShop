const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const databases = {
  auth: { host: 'localhost', port: 5432, database: 'auth_db', user: 'postgres', password: 'isampgsql123!' },
  catalog: { host: 'localhost', port: 5432, database: 'catalog_db', user: 'postgres', password: 'isampgsql123!' },
  inventory: { host: 'localhost', port: 5432, database: 'inventory_db', user: 'postgres', password: 'isampgsql123!' },
};

async function seedDatabase() {
  console.log('🌱 Starting simple database seeding...');

  try {
    // Auth Database
    console.log('👤 Seeding auth database...');
    const authClient = new Client(databases.auth);
    await authClient.connect();

    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminId = uuidv4();

    await authClient.query(`
      INSERT INTO users (id, email, "firstName", "lastName", password, roles, "isActive", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `, [adminId, 'admin@youshop.com', 'Admin', 'User', hashedPassword, 'admin']);

    await authClient.end();

    // Catalog Database
    console.log('📦 Seeding catalog database...');
    const catalogClient = new Client(databases.catalog);
    await catalogClient.connect();

    const categoryId = uuidv4();
    await catalogClient.query(`
      INSERT INTO categories (id, name, description, "isActive", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, true, NOW(), NOW())
    `, [categoryId, 'Electronics', 'Electronic devices and gadgets']);

    const productId = uuidv4();
    await catalogClient.query(`
      INSERT INTO products (id, name, description, price, "categoryId", "isActive", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
    `, [productId, 'iPhone 15 Pro', 'Latest Apple smartphone', 999.99, categoryId]);

    await catalogClient.end();

    // Inventory Database
    console.log('📊 Seeding inventory database...');
    const inventoryClient = new Client(databases.inventory);
    await inventoryClient.connect();

    const skuId = uuidv4();
    await inventoryClient.query(`
      INSERT INTO skus (id, "productId", code, name, "isActive", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, true, NOW(), NOW())
    `, [skuId, productId, 'SKU-IPHONE15PRO-1', 'iPhone 15 Pro - Default']);

    const stockId = uuidv4();
    await inventoryClient.query(`
      INSERT INTO stocks (id, "skuId", "availableQuantity", "reservedQuantity", "totalQuantity", "isActive", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, 0, $3, true, NOW(), NOW())
    `, [stockId, skuId, 50]);

    await inventoryClient.end();

    console.log('✅ Simple seeding completed successfully!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedDatabase();
