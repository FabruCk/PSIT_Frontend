import api from './config/api';
import { CATEGORY_ENDPOINTS } from './config/endpoints';

export const getCategories = async () => {
    try {
        console.log('Obteniendo categorías...');
        const response = await api.get(CATEGORY_ENDPOINTS.BASE);
        console.log('Respuesta de getCategories:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        throw error;
    }
};

export const getCategory = async (id) => {
    try {
        const response = await api.get(CATEGORY_ENDPOINTS.DETAIL(id));
        return response.data;
    } catch (error) {
        console.error(`Error al obtener categoría ${id}:`, error);
        throw error;
    }
};

export const createCategory = async (categoryData) => {
    try {
        // Validar datos requeridos
        if (!categoryData.nombre) {
            throw new Error('El nombre de la categoría es requerido');
        }

        // Preparar los datos para enviar
        const datosParaEnviar = {
            name: categoryData.nombre,
            description: categoryData.descripcion || '',
            parent_id: categoryData.parent === '' ? null : categoryData.parent
        };

        console.log('Enviando datos al servidor:', datosParaEnviar);
        const response = await api.post(CATEGORY_ENDPOINTS.BASE, datosParaEnviar);
        console.log('Respuesta del servidor:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al crear categoría:', error);
        if (error.response) {
            console.error('Detalles del error:', error.response.data);
            throw new Error(error.response.data.message || 'Error al crear la categoría');
        }
        throw error;
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        // Preparar los datos para actualizar
        const datosParaEnviar = {
            name: categoryData.nombre,
            description: categoryData.descripcion || '',
            parent_id: categoryData.parent === '' ? null : categoryData.parent
        };

        const response = await api.patch(CATEGORY_ENDPOINTS.DETAIL(id), datosParaEnviar);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar categoría ${id}:`, error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(CATEGORY_ENDPOINTS.DETAIL(id));
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar categoría ${id}:`, error);
        throw error;
    }
};

// Funciones adicionales útiles
export const getPrincipalCategories = async () => {
    try {
        console.log('Obteniendo categorías principales...');
        const response = await api.get(CATEGORY_ENDPOINTS.LIST_PRINCIPAL);
        console.log('Respuesta de getPrincipalCategories:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener categorías principales:', error);
        throw error;
    }
};

export const getChildCategories = async (parentId) => {
    try {
        const response = await api.get(CATEGORY_ENDPOINTS.LIST_CHILDREN(parentId));
        return response.data;
    } catch (error) {
        console.error(`Error al obtener subcategorías de ${parentId}:`, error);
        throw error;
    }
};

export const getCategoryProducts = async (categoryId) => {
    try {
        const response = await api.get(CATEGORY_ENDPOINTS.LIST_PRODUCTS(categoryId));
        return response.data;
    } catch (error) {
        console.error(`Error al obtener productos de la categoría ${categoryId}:`, error);
        throw error;
    }
}; 