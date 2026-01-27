const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

const databases = {
  auth: { host: 'localhost', port: 5432, database: 'auth_db', user: 'postgres', password: 'isampgsql123!' },
  catalog: { host: 'localhost', port: 5432, database: 'catalog_db', user: 'postgres', password: 'isampgsql123!' },
  inventory: { host: 'localhost', port: 5432, database: 'inventory_db', user: 'postgres', password: 'isampgsql123!' },
  orders: { host: 'localhost', port: 5432, database: 'orders_db', user: 'postgres', password: 'isampgsql123!' }
};

async function seedOrders() {
  console.log('🛒 Creating sample orders...');

  try {
    // Get users from auth database
    const authClient = new Client(databases.auth);
    await authClient.connect();
    const usersResult = await authClient.query('SELECT id FROM users WHERE role = $1', ['customer']);
    const users = usersResult.rows;
    await authClient.end();

    // Get products and SKUs
    const catalogClient = new Client(databases.catalog);
    await catalogClient.connect();
    const productsResult = await catalogClient.query('SELECT id, name, price FROM products LIMIT 20');
    const products = productsResult.rows;
    await catalogClient.end();

    const inventoryClient = new Client(databases.inventory);
    await inventoryClient.connect();
    const skusResult = await inventoryClient.query('SELECT id, "productId", "skuCode" FROM sku LIMIT 30');
    const skus = skusResult.rows;
    await inventoryClient.end();

    // Create orders
    const ordersClient = new Client(databases.orders);
    await ordersClient.connect();

    const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const paymentStatuses = ['pending', 'paid'];

    for (let i = 0; i < 15; i++) {
      const orderId = uuidv4();
      const orderNumber = `ORD-2024-${String(i + 1).padStart(4, '0')}`;
      const userId = users[Math.floor(Math.random() * users.length)].id;
      const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const paymentStatus = status === 'pending' ? 'pending' : 'paid';

      // Random order items (1-4 items per order)
      const itemCount = Math.floor(Math.random() * 4) + 1;
      const orderItems = [];
      let subtotal = 0;

      for (let j = 0; j < itemCount; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const sku = skus.find(s => s.productId === product.id) || skus[Math.floor(Math.random() * skus.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const unitPrice = parseFloat(product.price);
        const totalPrice = unitPrice * quantity;

        orderItems.push({
          productId: product.id,
          skuId: sku.id,
          productName: product.name,
          skuCode: sku.skuCode,
          quantity,
          unitPrice,
          totalPrice
        });

        subtotal += totalPrice;
      }

      const taxAmount = subtotal * 0.1; // 10% tax
      const shippingAmount = subtotal > 100 ? 0 : 15.99; // Free shipping over $100
      const totalAmount = subtotal + taxAmount + shippingAmount;

      const shippingAddress = {
        firstName: 'John',
        lastName: 'Doe',
        address1: `${Math.floor(Math.random() * 9999) + 1} Main St`,
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
        state: 'NY',
        postalCode: String(Math.floor(Math.random() * 90000) + 10000),
        country: 'USA'
      };

      // Insert order
      await ordersClient.query(`
        INSERT INTO orders (
          id, "orderNumber", "userId", status, "paymentStatus", 
          subtotal, "taxAmount", "shippingAmount", "totalAmount", 
          "shippingAddress", "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        orderId, orderNumber, userId, status, paymentStatus,
        subtotal, taxAmount, shippingAmount, totalAmount,
        JSON.stringify(shippingAddress),
        new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        new Date()
      ]);

      // Insert order items
      for (const item of orderItems) {
        await ordersClient.query(`
          INSERT INTO order_items (
            id, "orderId", "productId", "skuId", "productName", 
            "skuCode", quantity, "unitPrice", "totalPrice", "createdAt", "updatedAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          uuidv4(), orderId, item.productId, item.skuId, item.productName,
          item.skuCode, item.quantity, item.unitPrice, item.totalPrice,
          new Date(), new Date()
        ]);
      }

      console.log(`✅ Created order ${orderNumber} with ${itemCount} items`);
    }

    await ordersClient.end();

    console.log('🎉 Orders seeding completed!');
    console.log('📊 Created 15 sample orders with multiple items each');

  } catch (error) {
    console.error('❌ Orders seeding failed:', error);
  }
}

seedOrders();