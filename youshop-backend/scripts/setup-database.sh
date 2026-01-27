#!/bin/bash

echo "🚀 YouShop Database Setup Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if PostgreSQL is running
check_postgres() {
    echo -e "${YELLOW}📡 Checking PostgreSQL connections...${NC}"
    
    # Check each database port
    ports=(5432 5433 5434 5435)
    for port in "${ports[@]}"; do
        if nc -z localhost $port 2>/dev/null; then
            echo -e "${GREEN}✅ PostgreSQL running on port $port${NC}"
        else
            echo -e "${RED}❌ PostgreSQL not running on port $port${NC}"
            echo -e "${YELLOW}Please start PostgreSQL on port $port${NC}"
            exit 1
        fi
    done
}

# Function to install dependencies
install_deps() {
    echo -e "${YELLOW}📦 Installing required dependencies...${NC}"
    npm install pg uuid bcrypt
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Function to reset databases
reset_databases() {
    echo -e "${YELLOW}🗑️ Resetting databases...${NC}"
    node scripts/reset-databases.js
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Databases reset successfully${NC}"
    else
        echo -e "${RED}❌ Database reset failed${NC}"
        exit 1
    fi
}

# Function to run migrations
run_migrations() {
    echo -e "${YELLOW}🔄 Running database migrations...${NC}"
    
    # Start each service briefly to create tables
    services=("auth-service" "catalog-service" "inventory-service" "orders-service")
    
    for service in "${services[@]}"; do
        echo -e "${YELLOW}Starting $service for migration...${NC}"
        npm run start:dev $service &
        SERVICE_PID=$!
        
        # Wait for service to start and create tables
        sleep 10
        
        # Kill the service
        kill $SERVICE_PID 2>/dev/null
        wait $SERVICE_PID 2>/dev/null
        
        echo -e "${GREEN}✅ $service tables created${NC}"
    done
}

# Function to seed data
seed_data() {
    echo -e "${YELLOW}🌱 Seeding database with real data...${NC}"
    node scripts/seed-real-data.js
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Data seeding completed${NC}"
    else
        echo -e "${RED}❌ Data seeding failed${NC}"
        exit 1
    fi
}

# Function to show summary
show_summary() {
    echo -e "${GREEN}"
    echo "🎉 Database setup completed successfully!"
    echo "========================================"
    echo "📊 Databases created:"
    echo "  • auth_db (port 5432) - Users and authentication"
    echo "  • catalog_db (port 5433) - Products and categories"  
    echo "  • inventory_db (port 5434) - Stock and SKUs"
    echo "  • orders_db (port 5435) - Orders and order items"
    echo ""
    echo "👤 Test Users Created:"
    echo "  • admin@youshop.com (password: password123) - Admin"
    echo "  • john.doe@email.com (password: password123) - Customer"
    echo "  • jane.smith@email.com (password: password123) - Customer"
    echo ""
    echo "📦 Sample Data:"
    echo "  • 8 Categories (Electronics, Clothing, etc.)"
    echo "  • 30+ Products with real names and prices"
    echo "  • 75+ SKUs with stock levels"
    echo ""
    echo "🚀 Next Steps:"
    echo "  1. Start all services: npm run start:dev"
    echo "  2. Test API Gateway: http://localhost:3000"
    echo "  3. Login with test users above"
    echo -e "${NC}"
}

# Main execution
main() {
    echo -e "${YELLOW}Starting database setup process...${NC}"
    
    check_postgres
    install_deps
    reset_databases
    run_migrations
    seed_data
    show_summary
    
    echo -e "${GREEN}🎯 All done! Your YouShop database is ready.${NC}"
}

# Run main function
main