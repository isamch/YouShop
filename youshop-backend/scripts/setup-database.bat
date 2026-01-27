@echo off
echo 🚀 YouShop Database Setup Script
echo ================================

REM Function to check PostgreSQL connections
echo 📡 Checking PostgreSQL connections...

REM Check each port
for %%p in (5432 5433 5434 5435) do (
    netstat -an | find "%%p" >nul
    if errorlevel 1 (
        echo ❌ PostgreSQL not running on port %%p
        echo Please start PostgreSQL on port %%p
        pause
        exit /b 1
    ) else (
        echo ✅ PostgreSQL running on port %%p
    )
)

REM Install dependencies
echo 📦 Installing required dependencies...
call npm install pg uuid bcrypt
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed

REM Reset databases
echo 🗑️ Resetting databases...
node scripts/reset-databases.js
if errorlevel 1 (
    echo ❌ Database reset failed
    pause
    exit /b 1
)
echo ✅ Databases reset successfully

REM Run migrations by starting services briefly
echo 🔄 Running database migrations...

echo Starting auth-service for migration...
start /b npm run start:dev auth-service
timeout /t 15 /nobreak >nul
taskkill /f /im node.exe >nul 2>&1

echo Starting catalog-service for migration...
start /b npm run start:dev catalog-service  
timeout /t 15 /nobreak >nul
taskkill /f /im node.exe >nul 2>&1

echo Starting inventory-service for migration...
start /b npm run start:dev inventory-service
timeout /t 15 /nobreak >nul
taskkill /f /im node.exe >nul 2>&1

echo Starting orders-service for migration...
start /b npm run start:dev orders-service
timeout /t 15 /nobreak >nul
taskkill /f /im node.exe >nul 2>&1

echo ✅ Database tables created

REM Seed data
echo 🌱 Seeding database with real data...
node scripts/seed-real-data.js
if errorlevel 1 (
    echo ❌ Data seeding failed
    pause
    exit /b 1
)
echo ✅ Data seeding completed

REM Show summary
echo.
echo 🎉 Database setup completed successfully!
echo ========================================
echo 📊 Databases created:
echo   • auth_db (port 5432) - Users and authentication
echo   • catalog_db (port 5433) - Products and categories  
echo   • inventory_db (port 5434) - Stock and SKUs
echo   • orders_db (port 5435) - Orders and order items
echo.
echo 👤 Test Users Created:
echo   • admin@youshop.com (password: password123) - Admin
echo   • john.doe@email.com (password: password123) - Customer
echo   • jane.smith@email.com (password: password123) - Customer
echo.
echo 📦 Sample Data:
echo   • 8 Categories (Electronics, Clothing, etc.)
echo   • 30+ Products with real names and prices
echo   • 75+ SKUs with stock levels
echo.
echo 🚀 Next Steps:
echo   1. Start all services: npm run start:dev
echo   2. Test API Gateway: http://localhost:3000
echo   3. Login with test users above
echo.
echo 🎯 All done! Your YouShop database is ready.

pause