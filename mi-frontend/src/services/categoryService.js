import api from './config/api';
import { CATEGORY_ENDPOINTS } from './config/endpoints';

export const getCategories = async () => {
    const response = await api.get(CATEGORY_ENDPOINTS.BASE);
    return response.data;
};

export const getCategory = async (id) => {
    const response = await api.get(CATEGORY_ENDPOINTS.DETAIL(id));
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await api.post(CATEGORY_ENDPOINTS.BASE, categoryData);
    return response.data;
};

export const updateCategory = async (id, categoryData) => {
    const response = await api.patch(CATEGORY_ENDPOINTS.DETAIL(id), categoryData);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(CATEGORY_ENDPOINTS.DETAIL(id));
    return response.data;
}; 