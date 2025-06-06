import api from './config/api';
import { REGISTER_MAINTENANCE_ENDPOINTS } from './config/endpoints';

class MaintenanceService {
    constructor() {
        this.endpoints = REGISTER_MAINTENANCE_ENDPOINTS;
    }

    // Obtener todos los registros de mantenimiento
    async getMaintenanceRecords() {
        console.log('Llamando al servicio: getMaintenanceRecords');
        try {
            const response = await api.get(this.endpoints.BASE); // Usar BASE endpoint para listar todos
            console.log('Respuesta de getMaintenanceRecords:', response.data);
             // Manejar respuesta paginada si aplica
            return Array.isArray(response.data) ? response.data : response.data.results || [];
        } catch (error) {
            console.error('Error al obtener registros de mantenimiento:', error);
            if (error.response) {
                console.error('Detalles del error del servidor:', error.response.data);
                 throw new Error(error.response.data.message || JSON.stringify(error.response.data) || 'Error al obtener registros de mantenimiento');
            }
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
        console.log(`Llamando al servicio: getMaintenanceById (${id})`);
        try {
            const response = await api.get(this.endpoints.DETAIL(id));
            console.log(`Respuesta de getMaintenanceById (${id}):`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener mantenimiento ${id}:`, error);
            if (error.response) {
                console.error('Detalles del error del servidor:', error.response.data);
                 throw new Error(error.response.data.message || JSON.stringify(error.response.data) || `Error al obtener mantenimiento ${id}`);
            }
            throw error;
        }
    }

    // Crear un nuevo mantenimiento
    async createMaintenance(maintenanceData) {
        console.log('Llamando al servicio: createMaintenance', maintenanceData);
        try {
            const response = await api.post(this.endpoints.CREATE, maintenanceData);
            console.log('Respuesta del servidor (crear mantenimiento):', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al crear mantenimiento:', error);
            if (error.response) {
                console.error('Detalles del error del servidor:', error.response.data);
                throw new Error(error.response.data.message || JSON.stringify(error.response.data) || 'Error al crear el registro de mantenimiento');
            }
            throw error;
        }
    }

    // Actualizar un mantenimiento existente
    async updateMaintenance(id, maintenanceData) {
        console.log(`Llamando al servicio: updateMaintenance (${id})`, maintenanceData);
        try {
            const response = await api.patch(this.endpoints.UPDATE_PARTIAL(id), maintenanceData); // Usar PATCH
            console.log(`Respuesta del servidor (actualizar mantenimiento ${id}):`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar mantenimiento ${id}:`, error);
            if (error.response) {
                console.error('Detalles del error del servidor:', error.response.data);
                 throw new Error(error.response.data.message || JSON.stringify(error.response.data) || `Error al actualizar mantenimiento ${id}`);
            }
            throw error;
        }
    }

    // Eliminar un mantenimiento
    async deleteMaintenance(id) {
        console.log(`Intentando eliminar mantenimiento con ID: ${id}`);
        try {
            const response = await api.delete(this.endpoints.DELETE(id));
            console.log(`Mantenimiento ${id} eliminado con éxito. Estado:`, response.status);
             if (response.status === 204) {
                return; // Eliminado con éxito, no hay cuerpo de respuesta esperado
            } else if (response.data) {
                 return response.data;
             } else {
                  return; // Manejar otros posibles códigos de éxito sin cuerpo
             }
        } catch (error) {
            console.error(`Error al eliminar mantenimiento ${id}:`, error);
            if (error.response) {
                console.error('Detalles del error del servidor:', error.response.data);
                throw new Error(error.response.data.message || JSON.stringify(error.response.data) || `Error al eliminar el mantenimiento ${id}`);
            }
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

// Exportar la instancia por defecto
export default maintenanceService;

// Exportar funciones individuales
export const getMaintenanceRecords = () => maintenanceService.getMaintenanceRecords();
export const getMaintenanceById = (id) => maintenanceService.getMaintenanceById(id);
export const createMaintenance = (data) => maintenanceService.createMaintenance(data);
export const updateMaintenance = (id, data) => maintenanceService.updateMaintenance(id, data);
export const deleteMaintenance = (id) => maintenanceService.deleteMaintenance(id); 