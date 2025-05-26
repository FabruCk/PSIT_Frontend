// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
    LOGIN: '/token/',
    REFRESH: '/token/refresh/',
    CURRENT_USER: '/users/me/',
};

// Endpoints de productos
export const PRODUCT_ENDPOINTS = {
    BASE: '/products/',
    DETAIL: (id) => `/products/${id}/`,
    SEARCH: '/products/search/',
    CATEGORY: (categoryId) => `/products/category/${categoryId}/`,
    INVENTORY: '/products/inventory/',
    LOW_STOCK: '/products/low-stock/',
};

// Endpoints de categorías
export const CATEGORY_ENDPOINTS = {
    BASE: '/categories/',
    DETAIL: (id) => `/categories/${id}/`,
};

// Endpoints de proveedores
export const SUPPLIER_ENDPOINTS = {
    BASE: '/suppliers/',
    DETAIL: (id) => `/suppliers/${id}/`,
};

// Endpoints de movimientos de inventario
export const INVENTORY_MOVEMENT_ENDPOINTS = {
    BASE: '/inventory-movements/',
    DETAIL: (id) => `/inventory-movements/${id}/`,
    PRODUCT: (productId) => `/inventory-movements/product/${productId}/`,
};