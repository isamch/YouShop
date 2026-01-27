const { Client } = require('pg');

const databases = {
  auth: { host: 'localhost', port: 5432, database: 'auth_db', user: 'postgres', password: 'isampgsql123!' },
  catalog: { host: 'localhost', port: 5432, database: 'catalog_db', user: 'postgres', password: 'isampgsql123!' },
  inventory: { host: 'localhost', port: 5432, database: 'inventory_db', user: 'postgres', password: 'isampgsql123!' },
  orders: { host: 'localhost', port: 5432, database: 'orders_db', user: 'postgres', password: 'isampgsql123!' }
};

async function createTables() {
  console.log('📋 Creating database tables...');

  try {
    // Auth Database Tables
    console.log('👤 Creating auth tables...');
    const authClient = new Client(databases.auth);
    await authClient.connect();
    
    await authClient.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        "firstName" VARCHAR(100) NOT NULL,
        "lastName" VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'customer',
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    await authClient.end();

    // Catalog Database Tables
    console.log('📦 Creating catalog tables...');
    const catalogClient = new Client(databases.catalog);
    await catalogClient.connect();
    
    await catalogClient.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        "sortOrder" INTEGER DEFAULT 0,
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        "categoryId" UUID REFERENCES categories(id),
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    await catalogClient.end();

    // Inventory Database Tables
    console.log('📊 Creating inventory tables...');
    const inventoryClient = new Client(databases.inventory);
    await inventoryClient.connect();
    
    await inventoryClient.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS sku (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "productId" UUID NOT NULL,
        "skuCode" VARCHAR(100) UNIQUE NOT NULL,
        attributes JSONB,
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS stock (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "skuId" UUID REFERENCES sku(id),
        quantity INTEGER DEFAULT 0,
        "reservedQuantity" INTEGER DEFAULT 0,
        "availableQuantity" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    await inventoryClient.end();

    // Orders Database Tables
    console.log('🛒 Creating orders tables...');
    const ordersClient = new Client(databases.orders);
    await ordersClient.connect();
    
    await ordersClient.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
      CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
      
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "orderNumber" VARCHAR(100) UNIQUE NOT NULL,
        "userId" UUID NOT NULL,
        status order_status DEFAULT 'pending',
        "paymentStatus" payment_status DEFAULT 'pending',
        subtotal DECIMAL(10,2) NOT NULL,
        "taxAmount" DECIMAL(10,2) DEFAULT 0,
        "shippingAmount" DECIMAL(10,2) DEFAULT 0,
        "discountAmount" DECIMAL(10,2) DEFAULT 0,
        "totalAmount" DECIMAL(10,2) NOT NULL,
        "shippingAddress" JSONB,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "orderId" UUID REFERENCES orders(id) ON DELETE CASCADE,
        "productId" UUID NOT NULL,
        "skuId" UUID NOT NULL,
        "productName" VARCHAR(255) NOT NULL,
        "skuCode" VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL,
        "unitPrice" DECIMAL(10,2) NOT NULL,
        "totalPrice" DECIMAL(10,2) NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    await ordersClient.end();

    console.log('✅ All tables created successfully!');

  } catch (error) {
    console.error('❌ Table creation failed:', error);
  }
}

createTables();