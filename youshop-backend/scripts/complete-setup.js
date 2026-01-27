const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

async function setupDatabase() {
  console.log('🚀 YouShop Database Complete Setup');
  console.log('==================================\n');

  // Step 1: Install dependencies
  const depsInstalled = await runCommand(
    'npm install pg uuid bcrypt', 
    'Installing dependencies'
  );
  if (!depsInstalled) return;

  // Step 2: Reset databases
  const dbReset = await runCommand(
    'node scripts/reset-databases.js',
    'Resetting databases'
  );
  if (!dbReset) return;

  // Step 3: Wait a moment
  console.log('⏳ Waiting for databases to be ready...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Step 4: Create tables by running services briefly
  const services = ['auth-service', 'catalog-service', 'inventory-service', 'orders-service'];
  
  for (const service of services) {
    console.log(`🔄 Creating tables for ${service}...`);
    
    // Start service in background
    const serviceProcess = exec(`npm run start:dev ${service}`);
    
    // Wait for service to start and create tables
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Kill the service
    serviceProcess.kill();
    
    console.log(`✅ Tables created for ${service}`);
  }

  // Step 5: Seed data
  const dataSeeded = await runCommand(
    'node scripts/seed-real-data.js',
    'Seeding database with real data'
  );
  if (!dataSeeded) return;

  // Success summary
  console.log('\n🎉 Database setup completed successfully!');
  console.log('========================================');
  console.log('📊 Databases created:');
  console.log('  • auth_db (port 5432) - Users and authentication');
  console.log('  • catalog_db (port 5433) - Products and categories');
  console.log('  • inventory_db (port 5434) - Stock and SKUs');
  console.log('  • orders_db (port 5435) - Orders and order items');
  console.log('\n👤 Test Users Created:');
  console.log('  • admin@youshop.com (password: password123) - Admin');
  console.log('  • john.doe@email.com (password: password123) - Customer');
  console.log('  • jane.smith@email.com (password: password123) - Customer');
  console.log('\n📦 Sample Data:');
  console.log('  • 8 Categories (Electronics, Clothing, etc.)');
  console.log('  • 30+ Products with real names and prices');
  console.log('  • 75+ SKUs with stock levels');
  console.log('\n🚀 Next Steps:');
  console.log('  1. Start all services: npm run start:dev');
  console.log('  2. Test API Gateway: http://localhost:3000');
  console.log('  3. Login with test users above');
  console.log('\n🎯 All done! Your YouShop database is ready.');
}

setupDatabase().catch(console.error);