import api from './config/api';
import { SUPPLIER_ENDPOINTS } from './config/endpoints';

export const getSuppliers = async () => {
    try {
        console.log('Obteniendo proveedores...');
        const response = await api.get(SUPPLIER_ENDPOINTS.BASE);
        console.log('Respuesta de getSuppliers:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        throw error;
    }
};

export const getSupplier = async (id) => {
    try {
        console.log(`Obteniendo proveedor ${id}...`);
        const response = await api.get(SUPPLIER_ENDPOINTS.DETAIL(id));
        console.log(`Respuesta de getSupplier ${id}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener proveedor ${id}:`, error);
        throw error;
    }
};

export const createSupplier = async (supplierData) => {
    try {
        console.log('Enviando datos del proveedor al servidor:', supplierData);
        const response = await api.post(SUPPLIER_ENDPOINTS.BASE, supplierData);
        console.log('Respuesta del servidor (crear proveedor):', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        if (error.response) {
            console.error('Detalles del error de la API:', error.response.data);
            throw new Error(error.response.data.message || 'Error al crear el proveedor');
        }
        throw error;
    }
};

export const updateSupplier = async (id, supplierData) => {
    try {
        const response = await api.patch(SUPPLIER_ENDPOINTS.DETAIL(id), supplierData);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar proveedor ${id}:`, error);
        throw error;
    }
};

export const deleteSupplier = async (id) => {
    try {
        console.log(`Intentando eliminar proveedor con ID: ${id}`);
        const response = await api.delete(SUPPLIER_ENDPOINTS.DETAIL(id));
        console.log(`Proveedor ${id} eliminado con éxito. Respuesta:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar proveedor ${id}:`, error);
        if (error.response) {
            console.error('Detalles del error de la API:', error.response.data);
            throw new Error(error.response.data.message || `Error al eliminar el proveedor ${id}`);
        }
        throw error;
    }
}; 