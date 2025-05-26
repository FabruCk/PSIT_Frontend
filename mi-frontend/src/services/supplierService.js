import api from './config/api';
import { SUPPLIER_ENDPOINTS } from './config/endpoints';

export const getSuppliers = async () => {
    const response = await api.get(SUPPLIER_ENDPOINTS.BASE);
    return response.data;
};

export const getSupplier = async (id) => {
    const response = await api.get(SUPPLIER_ENDPOINTS.DETAIL(id));
    return response.data;
};

export const createSupplier = async (supplierData) => {
    const response = await api.post(SUPPLIER_ENDPOINTS.BASE, supplierData);
    return response.data;
};

export const updateSupplier = async (id, supplierData) => {
    const response = await api.patch(SUPPLIER_ENDPOINTS.DETAIL(id), supplierData);
    return response.data;
};

export const deleteSupplier = async (id) => {
    const response = await api.delete(SUPPLIER_ENDPOINTS.DETAIL(id));
    return response.data;
}; 