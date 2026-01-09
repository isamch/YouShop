const axios = require('axios');

// Configuration
const SERVICES = {
  auth: 'http://localhost:3001/api',
  catalog: 'http://localhost:3002/api', 
  inventory: 'http://localhost:3003/api',
  orders: 'http://localhost:3004/api'
};
let authToken = '';

// Helper function to make API calls
async function apiCall(service, endpoint, data = null, useAuth = false) {
  try {
    const config = {
      method: data ? 'POST' : 'GET',
      url: `${SERVICES[service]}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      },
      ...(data ? { data } : {})
    };

    console.log(`Making ${config.method} request to: ${config.url}`);
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error calling ${service}${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

// Wait function
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Seed data
const seedData = {
  users: [
    {
      email: 'admin@youshop.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User'
    },
    {
      email: 'john.doe@example.com',
      password: 'User123!',
      firstName: 'John',
      lastName: 'Doe'
    },
    {
      email: 'jane.smith@example.com',
      password: 'User123!',
      firstName: 'Jane',
      lastName: 'Smith'
    }
  ],

  categories: [
    {
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      isActive: true,
      sortOrder: 1
    },
    {
      name: 'Clothing',
      description: 'Fashion and apparel',
      isActive: true,
      sortOrder: 2
    },
    {
      name: 'Books',
      description: 'Books and educational materials',
      isActive: true,
      sortOrder: 3
    },
    {
      name: 'Home & Garden',
      description: 'Home improvement and garden supplies',
      isActive: true,
      sortOrder: 4
    },
    {
      name: 'Sports',
      description: 'Sports equipment and accessories',
      isActive: true,
      sortOrder: 5
    }
  ],

  products: [
    // Electronics
    {
      name: 'iPhone 15 Pro',
      description: 'Latest iPhone with advanced camera system and A17 Pro chip',
      price: 999.99,
      sku: 'IPH15PRO',
      images: ['iphone15pro-1.jpg', 'iphone15pro-2.jpg'],
      isActive: true,
      isFeatured: true,
      weight: 0.206,
      dimensions: '15.1 x 7.1 x 0.8 cm',
      tags: ['smartphone', 'apple', 'ios', 'premium'],
      categoryName: 'Electronics'
    },
    {
      name: 'Samsung Galaxy S24',
      description: 'Flagship Android smartphone with AI features',
      price: 899.99,
      sku: 'SGS24',
      images: ['galaxy-s24-1.jpg', 'galaxy-s24-2.jpg'],
      isActive: true,
      isFeatured: true,
      weight: 0.195,
      dimensions: '14.7 x 7.0 x 0.76 cm',
      tags: ['smartphone', 'samsung', 'android'],
      categoryName: 'Electronics'
    },
    {
      name: 'MacBook Air M3',
      description: '13-inch laptop with M3 chip and all-day battery life',
      price: 1299.99,
      sku: 'MBAM3',
      images: ['macbook-air-m3-1.jpg', 'macbook-air-m3-2.jpg'],
      isActive: true,
      isFeatured: true,
      weight: 1.24,
      dimensions: '30.41 x 21.5 x 1.13 cm',
      tags: ['laptop', 'apple', 'macbook', 'productivity'],
      categoryName: 'Electronics'
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Premium noise-canceling wireless headphones',
      price: 399.99,
      sku: 'SWXM5',
      images: ['sony-wh1000xm5-1.jpg', 'sony-wh1000xm5-2.jpg'],
      isActive: true,
      isFeatured: false,
      weight: 0.25,
      dimensions: '26.4 x 19.3 x 7.3 cm',
      tags: ['headphones', 'sony', 'wireless', 'noise-canceling'],
      categoryName: 'Electronics'
    },

    // Clothing
    {
      name: 'Classic White T-Shirt',
      description: '100% cotton comfortable white t-shirt',
      price: 29.99,
      sku: 'CWT001',
      images: ['white-tshirt-1.jpg', 'white-tshirt-2.jpg'],
      isActive: true,
      isFeatured: false,
      weight: 0.15,
      dimensions: 'Various sizes',
      tags: ['t-shirt', 'cotton', 'casual', 'basic'],
      categoryName: 'Clothing'
    },
    {
      name: 'Denim Jeans',
      description: 'Classic blue denim jeans with modern fit',
      price: 79.99,
      sku: 'DJ001',
      images: ['denim-jeans-1.jpg', 'denim-jeans-2.jpg'],
      isActive: true,
      isFeatured: true,
      weight: 0.6,
      dimensions: 'Various sizes',
      tags: ['jeans', 'denim', 'casual', 'fashion'],
      categoryName: 'Clothing'
    },

    // Books
    {
      name: 'Clean Code',
      description: 'A Handbook of Agile Software Craftsmanship by Robert C. Martin',
      price: 45.99,
      sku: 'CC001',
      images: ['clean-code-1.jpg'],
      isActive: true,
      isFeatured: true,
      weight: 0.7,
      dimensions: '23.5 x 19.1 x 2.8 cm',
      tags: ['programming', 'software', 'development', 'technical'],
      categoryName: 'Books'
    },
    {
      name: 'The Pragmatic Programmer',
      description: 'Your Journey to Mastery by David Thomas and Andrew Hunt',
      price: 42.99,
      sku: 'TPP001',
      images: ['pragmatic-programmer-1.jpg'],
      isActive: true,
      isFeatured: false,
      weight: 0.65,
      dimensions: '23.4 x 19.0 x 2.5 cm',
      tags: ['programming', 'career', 'development', 'technical'],
      categoryName: 'Books'
    },

    // Home & Garden
    {
      name: 'Smart LED Bulb',
      description: 'WiFi-enabled color-changing LED bulb',
      price: 24.99,
      sku: 'SLB001',
      images: ['smart-led-bulb-1.jpg'],
      isActive: true,
      isFeatured: false,
      weight: 0.08,
      dimensions: '6.0 x 6.0 x 10.8 cm',
      tags: ['smart-home', 'led', 'lighting', 'wifi'],
      categoryName: 'Home & Garden'
    },

    // Sports
    {
      name: 'Yoga Mat',
      description: 'Non-slip exercise yoga mat with carrying strap',
      price: 39.99,
      sku: 'YM001',
      images: ['yoga-mat-1.jpg', 'yoga-mat-2.jpg'],
      isActive: true,
      isFeatured: false,
      weight: 1.2,
      dimensions: '183 x 61 x 0.6 cm',
      tags: ['yoga', 'exercise', 'fitness', 'mat'],
      categoryName: 'Sports'
    }
  ]
};

// SKU variations for products
const skuVariations = {
  'IPH15PRO': [
    { suffix: '128-BLK', name: 'iPhone 15 Pro 128GB Black', price: 999.99, attributes: { storage: '128GB', color: 'Black' } },
    { suffix: '256-BLK', name: 'iPhone 15 Pro 256GB Black', price: 1099.99, attributes: { storage: '256GB', color: 'Black' } },
    { suffix: '128-WHT', name: 'iPhone 15 Pro 128GB White', price: 999.99, attributes: { storage: '128GB', color: 'White' } },
    { suffix: '256-WHT', name: 'iPhone 15 Pro 256GB White', price: 1099.99, attributes: { storage: '256GB', color: 'White' } }
  ],
  'SGS24': [
    { suffix: '128-BLK', name: 'Galaxy S24 128GB Black', price: 899.99, attributes: { storage: '128GB', color: 'Black' } },
    { suffix: '256-BLK', name: 'Galaxy S24 256GB Black', price: 999.99, attributes: { storage: '256GB', color: 'Black' } }
  ],
  'CWT001': [
    { suffix: 'S', name: 'Classic White T-Shirt Size S', price: 29.99, attributes: { size: 'S' } },
    { suffix: 'M', name: 'Classic White T-Shirt Size M', price: 29.99, attributes: { size: 'M' } },
    { suffix: 'L', name: 'Classic White T-Shirt Size L', price: 29.99, attributes: { size: 'L' } },
    { suffix: 'XL', name: 'Classic White T-Shirt Size XL', price: 32.99, attributes: { size: 'XL' } }
  ],
  'DJ001': [
    { suffix: '30', name: 'Denim Jeans W30', price: 79.99, attributes: { waist: '30' } },
    { suffix: '32', name: 'Denim Jeans W32', price: 79.99, attributes: { waist: '32' } },
    { suffix: '34', name: 'Denim Jeans W34', price: 79.99, attributes: { waist: '34' } },
    { suffix: '36', name: 'Denim Jeans W36', price: 79.99, attributes: { waist: '36' } }
  ]
};

// Main seeding function
async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Register admin user and get token
    console.log('1. Creating admin user...');
    const adminUser = await apiCall('auth', '/auth/register', seedData.users[0]);
    console.log('✅ Admin user created');

    // Login to get token (skip authentication for seeding)
    console.log('⚠️  Skipping authentication for seeding');
    console.log('✅ Ready to seed data\n');

    // 2. Create additional users
    console.log('2. Creating additional users...');
    for (let i = 1; i < seedData.users.length; i++) {
      try {
        await apiCall('auth', '/auth/register', seedData.users[i]);
        console.log(`✅ User ${seedData.users[i].email} created`);
      } catch (error) {
        console.log(`⚠️  User ${seedData.users[i].email} might already exist`);
      }
    }
    console.log('');

    // 3. Create categories
    console.log('3. Creating categories...');
    const createdCategories = {};
    for (const category of seedData.categories) {
      try {
        const createdCategory = await apiCall('catalog', '/categories', category);
        createdCategories[category.name] = createdCategory.id;
        console.log(`✅ Category "${category.name}" created`);
        await wait(100);
      } catch (error) {
        console.log(`⚠️  Category "${category.name}" might already exist`);
      }
    }
    console.log('');

    // 4. Create products
    console.log('4. Creating products...');
    const createdProducts = {};
    for (const product of seedData.products) {
      try {
        const productData = {
          ...product,
          categoryId: createdCategories[product.categoryName]
        };
        delete productData.categoryName;

        const createdProduct = await apiCall('catalog', '/products', productData);
        createdProducts[product.sku] = createdProduct.id;
        console.log(`✅ Product "${product.name}" created`);
        await wait(100);
      } catch (error) {
        console.log(`⚠️  Product "${product.name}" might already exist`);
      }
    }
    console.log('');

    // 5. Create SKUs
    console.log('5. Creating SKUs...');
    const createdSkus = {};
    for (const [baseSku, variations] of Object.entries(skuVariations)) {
      const productId = createdProducts[baseSku];
      if (!productId) continue;

      for (const variation of variations) {
        try {
          const skuData = {
            code: `${baseSku}-${variation.suffix}`,
            productId: productId,
            name: variation.name,
            description: `${variation.name} - Premium quality`,
            price: variation.price,
            attributes: variation.attributes,
            isActive: true,
            trackQuantity: true,
            allowBackorder: false
          };

          const createdSku = await apiCall('inventory', '/sku', skuData);
          createdSkus[skuData.code] = createdSku.id;
          console.log(`✅ SKU "${skuData.code}" created`);
          await wait(100);
        } catch (error) {
          console.log(`⚠️  SKU "${baseSku}-${variation.suffix}" might already exist`);
        }
      }
    }
    console.log('');

    // 6. Create stock for SKUs
    console.log('6. Creating stock...');
    for (const [skuCode, skuId] of Object.entries(createdSkus)) {
      try {
        const stockData = {
          skuId: skuId,
          locationId: 'warehouse-001',
          availableQuantity: Math.floor(Math.random() * 100) + 50, // 50-150 items
          reorderPoint: 10,
          maxStock: 1000
        };

        await apiCall('inventory', '/stock', stockData);
        console.log(`✅ Stock created for SKU "${skuCode}"`);
        await wait(100);
      } catch (error) {
        console.log(`⚠️  Stock for SKU "${skuCode}" might already exist`);
      }
    }
    console.log('');

    // 7. Create sample orders
    console.log('7. Creating sample orders...');
    const sampleOrders = [
      {
        userId: 'user-123',
        items: [
          {
            productId: createdProducts['IPH15PRO'],
            skuId: Object.values(createdSkus)[0],
            quantity: 1,
            unitPrice: 999.99
          }
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'USA',
          phone: '+1234567890'
        },
        notes: 'First sample order'
      },
      {
        userId: 'user-456',
        items: [
          {
            productId: createdProducts['CWT001'],
            skuId: Object.values(createdSkus)[4],
            quantity: 2,
            unitPrice: 29.99
          },
          {
            productId: createdProducts['DJ001'],
            skuId: Object.values(createdSkus)[6],
            quantity: 1,
            unitPrice: 79.99
          }
        ],
        shippingAddress: {
          firstName: 'Jane',
          lastName: 'Smith',
          address1: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90210',
          country: 'USA',
          phone: '+1987654321'
        },
        notes: 'Clothing order'
      }
    ];

    for (let i = 0; i < sampleOrders.length; i++) {
      try {
        const order = sampleOrders[i];
        const createdOrder = await apiCall('orders', '/orders', order);
        console.log(`✅ Sample order ${i + 1} created: ${createdOrder.orderNumber}`);
        await wait(200);
      } catch (error) {
        console.log(`⚠️  Sample order ${i + 1} creation failed`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Users: ${seedData.users.length}`);
    console.log(`   • Categories: ${Object.keys(createdCategories).length}`);
    console.log(`   • Products: ${Object.keys(createdProducts).length}`);
    console.log(`   • SKUs: ${Object.keys(createdSkus).length}`);
    console.log(`   • Sample Orders: ${sampleOrders.length}`);
    console.log('\n🚀 You can now test the APIs with realistic data!');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };