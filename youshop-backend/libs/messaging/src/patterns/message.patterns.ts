/**
 * Message Patterns
 * 
 * @description
 * Defines message patterns for inter-service communication
 */

// Auth Service Patterns
export const AUTH_PATTERNS = {
  VALIDATE_TOKEN: 'auth.validate_token',
  GET_USER: 'auth.get_user',
  CHECK_PERMISSIONS: 'auth.check_permissions',
} as const;

// Catalog Service Patterns
export const CATALOG_PATTERNS = {
  GET_PRODUCT: 'catalog.get_product',
  GET_PRODUCTS: 'catalog.get_products',
  CHECK_PRODUCT_EXISTS: 'catalog.check_product_exists',
  UPDATE_PRODUCT_STOCK: 'catalog.update_product_stock',
} as const;

// Inventory Service Patterns
export const INVENTORY_PATTERNS = {
  CHECK_STOCK: 'inventory.check_stock',
  RESERVE_STOCK: 'inventory.reserve_stock',
  RELEASE_STOCK: 'inventory.release_stock',
  UPDATE_STOCK: 'inventory.update_stock',
  GET_STOCK_STATUS: 'inventory.get_stock_status',
} as const;

// Orders Service Patterns
export const ORDERS_PATTERNS = {
  CREATE_ORDER: 'orders.create_order',
  GET_ORDER: 'orders.get_order',
  UPDATE_ORDER_STATUS: 'orders.update_order_status',
  CANCEL_ORDER: 'orders.cancel_order',
  GET_USER_ORDERS: 'orders.get_user_orders',
} as const;

// All Patterns
export const MESSAGE_PATTERNS = {
  ...AUTH_PATTERNS,
  ...CATALOG_PATTERNS,
  ...INVENTORY_PATTERNS,
  ...ORDERS_PATTERNS,
} as const;