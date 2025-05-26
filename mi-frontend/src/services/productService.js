import api from './config/api';
import { PRODUCT_ENDPOINTS } from './config/endpoints';

export const getProducts = async (params = {}) => {
    const response = await api.get(PRODUCT_ENDPOINTS.BASE, { params });
    return response.data;
};

export const getProduct = async (id) => {
    const response = await api.get(PRODUCT_ENDPOINTS.DETAIL(id));
    return response.data;
};

export const createProduct = async (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
    });
    
    const response = await api.post(PRODUCT_ENDPOINTS.BASE, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
    });
    
    const response = await api.patch(PRODUCT_ENDPOINTS.DETAIL(id), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(PRODUCT_ENDPOINTS.DETAIL(id));
    return response.data;
};

export const searchProducts = async (query) => {
    const response = await api.get(PRODUCT_ENDPOINTS.SEARCH, {
        params: { search: query }
    });
    return response.data;
};

export const getProductsByCategory = async (categoryId) => {
    const response = await api.get(PRODUCT_ENDPOINTS.CATEGORY(categoryId));
    return response.data;
};

export const getLowStockProducts = async () => {
    const response = await api.get(PRODUCT_ENDPOINTS.LOW_STOCK);
    return response.data;
};

export const getInventoryStatus = async () => {
    const response = await api.get(PRODUCT_ENDPOINTS.INVENTORY);
    return response.data;
};