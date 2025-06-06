import api from './config/api';
import { REGISTER_MAINTENANCE_ENDPOINTS } from './config/endpoints';

class MaintenanceService {
    constructor() {
        this.endpoints = REGISTER_MAINTENANCE_ENDPOINTS;
    }

    // Obtener todos los registros de mantenimiento
    async getMaintenanceRecords() {
        try {
            const response = await api.get(this.endpoints.GET_ALL);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Obtener todos los mantenimientos
    async getAllMaintenances() {
        try {
            const response = await api.get(this.endpoints.GET_ALL);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Obtener un mantenimiento por ID
    async getMaintenanceById(id) {
        try {
            const response = await api.get(`${this.endpoints.GET_BY_ID}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Crear un nuevo mantenimiento
    async createMaintenance(maintenanceData) {
        try {
            const response = await api.post(this.endpoints.CREATE, maintenanceData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar un mantenimiento existente
    async updateMaintenance(id, maintenanceData) {
        try {
            const response = await api.put(`${this.endpoints.UPDATE}/${id}`, maintenanceData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Eliminar un mantenimiento
    async deleteMaintenance(id) {
        try {
            const response = await api.delete(`${this.endpoints.DELETE}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Obtener mantenimientos por estado
    async getMaintenancesByStatus(status) {
        try {
            const response = await api.get(`${this.endpoints.GET_BY_STATUS}/${status}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Obtener mantenimientos por equipo
    async getMaintenancesByEquipment(equipmentId) {
        try {
            const response = await api.get(`${this.endpoints.GET_BY_EQUIPMENT}/${equipmentId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const maintenanceService = new MaintenanceService();

export const getMaintenanceRecords = () => maintenanceService.getMaintenanceRecords();
export default maintenanceService; 