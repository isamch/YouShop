const axios = require('axios');

// Configuration
const SERVICES = {
  auth: 'http://localhost:3001/api',
  catalog: 'http://localhost:3002/api'
};

// Helper function
async function apiCall(service, endpoint, data = null) {
  try {
    const config = {
      method: data ? 'POST' : 'GET',
      url: `${SERVICES[service]}${endpoint}`,
      headers: { 'Content-Type': 'application/json' },
      ...(data ? { data } : {})
    };

    console.log(`Making ${config.method} request to: ${config.url}`);
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error:`, error.response?.data || error.message);
    return null;
  }
}

// Simple seed data
const seedData = {
  users: [
    {
      email: 'admin@youshop.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User'
    }
  ],
  categories: [
    {
      name: 'Electronics',
      description: 'Electronic devices',
      isActive: true,
      sortOrder: 1
    },
    {
      name: 'Clothing',
      description: 'Fashion items',
      isActive: true,
      sortOrder: 2
    }
  ]
};

async function simpleSeed() {
  console.log('🌱 Starting simple seeding...\n');

  // 1. Create admin user
  console.log('1. Creating admin user...');
  const adminUser = await apiCall('auth', '/auth/register', seedData.users[0]);
  if (adminUser) {
    console.log('✅ Admin user created');
  }

  // 2. Create categories
  console.log('\n2. Creating categories...');
  for (const category of seedData.categories) {
    const result = await apiCall('catalog', '/categories', category);
    if (result) {
      console.log(`✅ Category "${category.name}" created`);
    } else {
      console.log(`❌ Failed to create category "${category.name}"`);
    }
  }

  console.log('\n🎉 Simple seeding completed!');
}

simpleSeed();