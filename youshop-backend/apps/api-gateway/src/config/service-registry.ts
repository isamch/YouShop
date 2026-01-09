export interface ServiceConfig {
  name: string;
  url: string;
  healthCheck: string;
  timeout: number;
}

export const SERVICE_REGISTRY: Record<string, ServiceConfig> = {
  auth: {
    name: 'auth-service',
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    healthCheck: '/api/health',
    timeout: 5000,
  },
  catalog: {
    name: 'catalog-service',
    url: process.env.CATALOG_SERVICE_URL || 'http://localhost:3002',
    healthCheck: '/api/health',
    timeout: 5000,
  },
  inventory: {
    name: 'inventory-service',
    url: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3003',
    healthCheck: '/api/health',
    timeout: 5000,
  },
  orders: {
    name: 'orders-service',
    url: process.env.ORDERS_SERVICE_URL || 'http://localhost:3004',
    healthCheck: '/api/health',
    timeout: 5000,
  },
};