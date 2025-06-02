export const API_URL = 'http://localhost:8000/api';

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login/', // Endpoint para iniciar sesión
    LOGOUT: '/auth/logout/', // logout de la api
    REGISTER: '/auth/register/', // Endpoint para registrar un nuevo usuario
    REFRESH: '/auth/token/refresh/',
    CURRENT_USER: '/auth/user/'
};

// Endpoints de usuarios
export const USER_ENDPOINTS = {
    CREATE: '/users/',
    UPDATE: (id) => `/users/${id}/`,
    DELETE: (id) => `/users/${id}/`,
    GET_ALL: '/users/',
    GET_BY_ID: (id) => `/users/${id}/`,
    FILTER: '/users/filter/'
};

//Categoria Endpoints
export const CATEGORY_ENDPOINTS = {
    BASE: '/categories/', // Endpoint para listar las categorías
    CREATE: '/categories/', // Endpoint para crear una categoría
    DETAIL: (id) => `/categories/${id}/`, // Endpoint para listar categoría específica
    LIST_PRINCIPAL: '/categories/?parent=null', // Endpoint para listar las categorías principales
    LIST_CHILDREN: (parentId) => `/categories/?parent=${parentId}`, // Endpoint para listar las categorías hijas de una categoría principal
    UPDATE_FULL: (id) => `/categories/${id}/`, // Endpoint para actualización completa (PUT)
    UPDATE_PARTIAL: (id) => `/categories/${id}/`, // Endpoint para actualización parcial (PATCH)
    MOVE_CHILD: (id) => `/categories/${id}/`, // Endpoint para mover una SUBcategoría a otra categoría
    SUB_TO_PARENT: (id) => `/categories/${id}/`, // Endpoint para mover una SUBcategoría a una categoría principal
    DELETE: (id) => `/categories/${id}/`, // Endpoint para eliminar una categoría
    LIST_PRODUCTS: (id) => `/categories/${id}/products/`, // Endpoint para listar los productos de una categoría
};

// Endpoints de proveedores
export const SUPPLIER_ENDPOINTS = {
    BASE: '/suppliers/', // Endpoint para listar los proveedores
    CREATE: '/suppliers/', //Crear proveedor
    DETAIL: (id) => `/suppliers/${id}/`, //Proveedor especifico listar
    UPDATE_FULL: (id) => `/suppliers/${id}/`, //Actualizar proveedor
    UPDATE_PARTIAL: (id) => `/suppliers/${id}/`, //Actualizar parcialmente proveedor
    DELETE: (id) => `/suppliers/${id}/`, //Eliminar proveedor
    LIST_PRODUCTS: (id) => `/suppliers/${id}/products/`, //Listar productos de un proveedor
};

// Endpoints de productos
export const PRODUCT_ENDPOINTS = {
    BASE: '/products/', // Endpoint para obtener todos los productos
    CREATE: '/products/', //Crear producto
    DETAIL: (id) => `/products/${id}/`, //Producto especifico listar
    UPDATE_FULL: (id) => `/products/${id}/`, //Actualizar producto
    UPDATE_PARTIAL: (id) => `/products/${id}/`, //Actualizar parcialmente producto
    DELETE: (id) => `/products/${id}/`, //Eliminar producto
    LIST_LOW_STOCK: '/products/low_stock/', //Listar productos con stock bajo
    SUMMARY: '/products/stock_summary/', //Resumen de productos
    LIST_CATEGORIES: (id) => `/products/${id}/categories/`, //Listar categorías de un producto
    LIST_SUPPLIERS: (id) => `/products/${id}/suppliers/`, //Listar proveedores de un producto
    UPDATE_STOCK: (id) => `/products/${id}/adjust_stock/`, //Actualizar stock de un producto
};

// Endpoints de movimientos de inventario
export const INVENTORY_MOVEMENT_ENDPOINTS = {
    BASE: '/movements/', //Endpoint para listar los movimientos de inventario
    CREATE: '/movements/', //Crear movimiento de inventario
    RECENT: '/movements/recent/', //Listar los últimos movimientos de inventario
    DETAIL: (id) => `/movements/${id}/`, //Movimiento de inventario especifico listar
    SUMMARY: '/movements/summary/', //Resumen de movimientos de inventario
    UPDATE_FULL: (id) => `/movements/${id}/`, //Actualizar movimiento de inventario
    UPDATE_PARTIAL: (id) => `/movements/${id}/`, //Actualizar parcialmente movimiento de inventario
    DELETE: (id) => `/movements/${id}/`, //Eliminar movimiento de inventario
    FILTER_AND_ORDER: (value, order) => `/movements/?search=${value}&ordering=${order}/`, //Filtrar movimientos de inventario por campo
    FILTER: (value) => `/movements/?search=${value}/`,//Filtrar por nombre o tipo
    ORDER_BY_DATE: (order) => `/movements/?ordering=${order}date/`, //Ordenar movimientos de inventario por fecha 
    ORDER_BY_CANT: (order) => `/movements/?ordering=${order}cant/`, //Ordenar movimientos de inventario por cantidad 
};

//Mantenimiento registros 
export const REGISTER_MAINTENANCE_ENDPOINTS = {
    BASE: `/maintenance/`,//listar el registro completo
    CREATE: `/maintenance/`, //Crear un nuevo registro
    PENDING: `/maintenance/pending/`, //listar mantenimientos pendientes
    COMPLETE: (id) => `/maintenance/${id}/complete/`, //completar mantenimiento o completar
    UPDATE_FULL: (id) => `/maintenance/${id}/`, //actualizar todo el mantenimieto
    UPDATE_PARTIAL: (id) => `/maintenance/${id}/`, //actualizar algunos datos
    DELETE: (id) => `/maintenance/${id}/`
}

