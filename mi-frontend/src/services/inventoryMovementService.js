import api from './config/api';
import { INVENTORY_MOVEMENT_ENDPOINTS } from './config/endpoints';

export const getInventoryMovements = async () => {
    const response = await api.get(INVENTORY_MOVEMENT_ENDPOINTS.BASE);
    return response.data;
};

export const getInventoryMovement = async (id) => {
    const response = await api.get(INVENTORY_MOVEMENT_ENDPOINTS.DETAIL(id));
    return response.data;
};

export const createInventoryMovement = async (movementData) => {
    const response = await api.post(INVENTORY_MOVEMENT_ENDPOINTS.BASE, movementData);
    return response.data;
};

export const getProductMovements = async (productId) => {
    const response = await api.get(INVENTORY_MOVEMENT_ENDPOINTS.PRODUCT(productId));
    return response.data;
}; 