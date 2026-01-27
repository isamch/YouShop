export const SERVICES_CONFIG = {
  AUTH_SERVICE: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  CATALOG_SERVICE: process.env.CATALOG_SERVICE_URL || 'http://localhost:3002',
  INVENTORY_SERVICE: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3003',
  ORDERS_SERVICE: process.env.ORDERS_SERVICE_URL || 'http://localhost:3004',
  PAYMENT_SERVICE: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
};