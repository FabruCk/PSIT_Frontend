import api from './config/api';
import { PRODUCT_ENDPOINTS } from './config/endpoints';

export const getProducts = async (params = {}) => {
    console.log('Llamando al servicio: getProducts', params);
    try {
        const response = await api.get(PRODUCT_ENDPOINTS.BASE, { params });
        console.log('Respuesta de getProducts:', response.data);
        return response.data; // Devolvemos la respuesta cruda para que el componente la procese si es paginada
    } catch (error) {
        console.error('Error al obtener productos:', error);
        if (error.response) {
            console.error('Detalles del error del servidor (getProducts):', error.response.data);
            throw new Error(error.response.data.detail || error.response.data.message || JSON.stringify(error.response.data) || 'Error desconocido al obtener productos');
        } else if (error.request) {
             console.error('No se recibió respuesta del servidor.', error.request);
             throw new Error('No se recibió respuesta del servidor al obtener productos.');
        } else {
            console.error('Error configurando la solicitud:', error.message);
            throw new Error('Error al configurar la solicitud para obtener productos.' + error.message);
        }
    }
};

export const getProduct = async (id) => {
    const response = await api.get(PRODUCT_ENDPOINTS.DETAIL(id));
    return response.data;
};

export const createProduct = async (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
            const value = typeof productData[key] === 'boolean' ? String(productData[key]) : productData[key];
            formData.append(key, value);
        }
    });
    
    console.log('Enviando FormData para crear producto:');
    for (let pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }

    try {
        const response = await api.post(PRODUCT_ENDPOINTS.BASE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Respuesta exitosa de createProduct:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al crear producto:', error);
        if (error.response) {
            console.error('Detalles del error del servidor (createProduct):', error.response.data);
            throw new Error(error.response.data.detail || error.response.data.message || JSON.stringify(error.response.data) || 'Error desconocido al crear producto');
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor.', error.request);
            throw new Error('No se recibió respuesta del servidor al crear producto.');
        } else {
            console.error('Error configurando la solicitud:', error.message);
            throw new Error('Error al configurar la solicitud para crear producto.' + error.message);
        }
    }
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