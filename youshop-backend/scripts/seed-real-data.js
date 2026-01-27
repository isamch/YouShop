const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// Database connections
const databases = {
  auth: { host: 'localhost', port: 5432, database: 'auth_db', user: 'postgres', password: 'isampgsql123!' },
  catalog: { host: 'localhost', port: 5432, database: 'catalog_db', user: 'postgres', password: 'isampgsql123!' },
  inventory: { host: 'localhost', port: 5432, database: 'inventory_db', user: 'postgres', password: 'isampgsql123!' },
  orders: { host: 'localhost', port: 5432, database: 'orders_db', user: 'postgres', password: 'isampgsql123!' }
};

// Real data
const categories = [
  { name: 'Electronics', description: 'Electronic devices and gadgets', sortOrder: 1 },
  { name: 'Clothing', description: 'Fashion and apparel', sortOrder: 2 },
  { name: 'Home & Garden', description: 'Home improvement and garden supplies', sortOrder: 3 },
  { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear', sortOrder: 4 },
  { name: 'Books', description: 'Books and educational materials', sortOrder: 5 },
  { name: 'Beauty & Health', description: 'Beauty products and health supplements', sortOrder: 6 },
  { name: 'Toys & Games', description: 'Toys and gaming products', sortOrder: 7 },
  { name: 'Automotive', description: 'Car parts and accessories', sortOrder: 8 }
];

const products = [
  // Electronics
  { name: 'iPhone 15 Pro', description: 'Latest Apple smartphone with A17 Pro chip', price: 999.99, categoryName: 'Electronics' },
  { name: 'Samsung Galaxy S24', description: 'Premium Android smartphone', price: 899.99, categoryName: 'Electronics' },
  { name: 'MacBook Air M3', description: '13-inch laptop with M3 chip', price: 1299.99, categoryName: 'Electronics' },
  { name: 'Dell XPS 13', description: 'Ultra-portable Windows laptop', price: 1099.99, categoryName: 'Electronics' },
  { name: 'Sony WH-1000XM5', description: 'Noise-canceling wireless headphones', price: 399.99, categoryName: 'Electronics' },
  { name: 'iPad Pro 12.9"', description: 'Professional tablet with M2 chip', price: 1099.99, categoryName: 'Electronics' },
  { name: 'Nintendo Switch OLED', description: 'Gaming console with OLED screen', price: 349.99, categoryName: 'Electronics' },
  { name: 'Apple Watch Series 9', description: 'Advanced smartwatch', price: 399.99, categoryName: 'Electronics' },
  
  // Clothing
  { name: 'Levi\'s 501 Jeans', description: 'Classic straight-fit denim jeans', price: 89.99, categoryName: 'Clothing' },
  { name: 'Nike Air Force 1', description: 'Iconic basketball sneakers', price: 110.00, categoryName: 'Clothing' },
  { name: 'Adidas Ultraboost 22', description: 'Premium running shoes', price: 180.00, categoryName: 'Clothing' },
  { name: 'Champion Hoodie', description: 'Comfortable pullover hoodie', price: 45.99, categoryName: 'Clothing' },
  { name: 'Ray-Ban Aviator', description: 'Classic aviator sunglasses', price: 154.99, categoryName: 'Clothing' },
  { name: 'North Face Jacket', description: 'Waterproof outdoor jacket', price: 199.99, categoryName: 'Clothing' },
  
  // Home & Garden
  { name: 'Dyson V15 Detect', description: 'Cordless vacuum cleaner', price: 749.99, categoryName: 'Home & Garden' },
  { name: 'Instant Pot Duo 7-in-1', description: 'Multi-use pressure cooker', price: 99.99, categoryName: 'Home & Garden' },
  { name: 'Philips Hue Smart Bulbs', description: 'Color-changing LED bulbs', price: 49.99, categoryName: 'Home & Garden' },
  { name: 'KitchenAid Stand Mixer', description: 'Professional stand mixer', price: 379.99, categoryName: 'Home & Garden' },
  
  // Sports & Outdoors
  { name: 'Peloton Bike+', description: 'Interactive exercise bike', price: 2495.00, categoryName: 'Sports & Outdoors' },
  { name: 'Yeti Rambler Tumbler', description: 'Insulated stainless steel tumbler', price: 34.99, categoryName: 'Sports & Outdoors' },
  { name: 'Coleman Camping Tent', description: '4-person dome tent', price: 129.99, categoryName: 'Sports & Outdoors' },
  
  // Books
  { name: 'The Psychology of Money', description: 'Financial wisdom book by Morgan Housel', price: 16.99, categoryName: 'Books' },
  { name: 'Atomic Habits', description: 'Self-improvement book by James Clear', price: 18.99, categoryName: 'Books' },
  { name: 'Dune', description: 'Classic science fiction novel', price: 12.99, categoryName: 'Books' },
  
  // Beauty & Health
  { name: 'Cetaphil Daily Cleanser', description: 'Gentle face cleanser', price: 12.99, categoryName: 'Beauty & Health' },
  { name: 'Olaplex Hair Treatment', description: 'Professional hair repair treatment', price: 28.99, categoryName: 'Beauty & Health' },
  { name: 'Vitamin D3 Supplements', description: 'Daily vitamin D supplements', price: 19.99, categoryName: 'Beauty & Health' },
  
  // Toys & Games
  { name: 'LEGO Creator Expert', description: 'Advanced building set', price: 199.99, categoryName: 'Toys & Games' },
  { name: 'Monopoly Board Game', description: 'Classic family board game', price: 24.99, categoryName: 'Toys & Games' },
  { name: 'PlayStation 5', description: 'Next-gen gaming console', price: 499.99, categoryName: 'Toys & Games' },
  
  // Automotive
  { name: 'Michelin Pilot Sport Tires', description: 'High-performance car tires', price: 299.99, categoryName: 'Automotive' },
  { name: 'Garmin DashCam', description: 'HD dashboard camera', price: 199.99, categoryName: 'Automotive' }
];

const users = [
  { email: 'admin@youshop.com', firstName: 'Admin', lastName: 'User', role: 'admin' },
  { email: 'john.doe@email.com', firstName: 'John', lastName: 'Doe', role: 'customer' },
  { email: 'jane.smith@email.com', firstName: 'Jane', lastName: 'Smith', role: 'customer' },
  { email: 'mike.johnson@email.com', firstName: 'Mike', lastName: 'Johnson', role: 'customer' },
  { email: 'sarah.wilson@email.com', firstName: 'Sarah', lastName: 'Wilson', role: 'customer' },
  { email: 'david.brown@email.com', firstName: 'David', lastName: 'Brown', role: 'customer' },
  { email: 'lisa.davis@email.com', firstName: 'Lisa', lastName: 'Davis', role: 'customer' },
  { email: 'tom.miller@email.com', firstName: 'Tom', lastName: 'Miller', role: 'customer' },
  { email: 'anna.garcia@email.com', firstName: 'Anna', lastName: 'Garcia', role: 'customer' },
  { email: 'chris.martinez@email.com', firstName: 'Chris', lastName: 'Martinez', role: 'customer' }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed Auth Database
    console.log('👤 Seeding auth database...');
    const authClient = new Client(databases.auth);
    await authClient.connect();

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    for (const user of users) {
      const userId = uuidv4();
      await authClient.query(`
        INSERT INTO users (id, email, "firstName", "lastName", password, role, "isActive", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
      `, [userId, user.email, user.firstName, user.lastName, hashedPassword, user.role]);
    }
    await authClient.end();

    // Seed Catalog Database
    console.log('📦 Seeding catalog database...');
    const catalogClient = new Client(databases.catalog);
    await catalogClient.connect();

    const categoryIds = {};
    for (const category of categories) {
      const categoryId = uuidv4();
      categoryIds[category.name] = categoryId;
      await catalogClient.query(`
        INSERT INTO categories (id, name, description, "sortOrder", "isActive", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, true, NOW(), NOW())
      `, [categoryId, category.name, category.description, category.sortOrder]);
    }

    const productIds = {};
    for (const product of products) {
      const productId = uuidv4();
      productIds[product.name] = productId;
      const categoryId = categoryIds[product.categoryName];
      await catalogClient.query(`
        INSERT INTO products (id, name, description, price, "categoryId", "isActive", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
      `, [productId, product.name, product.description, product.price, categoryId]);
    }
    await catalogClient.end();

    // Seed Inventory Database
    console.log('📊 Seeding inventory database...');
    const inventoryClient = new Client(databases.inventory);
    await inventoryClient.connect();

    for (const [productName, productId] of Object.entries(productIds)) {
      // Create 2-3 SKUs per product
      const skuCount = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < skuCount; i++) {
        const skuId = uuidv4();
        const skuCode = `SKU-${productName.replace(/[^A-Z0-9]/gi, '').toUpperCase()}-${i + 1}`;
        const stockQuantity = Math.floor(Math.random() * 100) + 10;
        
        // Insert SKU
        await inventoryClient.query(`
          INSERT INTO sku (id, "productId", "skuCode", attributes, "isActive", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, true, NOW(), NOW())
        `, [skuId, productId, skuCode, JSON.stringify({ variant: i + 1 })]);

        // Insert Stock
        await inventoryClient.query(`
          INSERT INTO stock (id, "skuId", quantity, "reservedQuantity", "availableQuantity", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, 0, $3, NOW(), NOW())
        `, [uuidv4(), skuId, stockQuantity]);
      }
    }
    await inventoryClient.end();

    console.log('✅ Database seeding completed successfully!');
    console.log(`👤 Created ${users.length} users`);
    console.log(`📂 Created ${categories.length} categories`);
    console.log(`📦 Created ${products.length} products`);
    console.log(`📊 Created ${products.length * 2.5} SKUs with stock`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedDatabase();