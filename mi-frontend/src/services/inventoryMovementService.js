import api from './config/api';
import { INVENTORY_MOVEMENT_ENDPOINTS } from './config/endpoints';

/**
 * Obtiene todos los movimientos de inventario.
 * @returns {Promise<Array<Object>>} Una promesa que resuelve con la lista de movimientos.
 */
export const getInventoryMovements = async () => {
    console.log('Llamando al servicio: getInventoryMovements');
    try {
        const response = await api.get(INVENTORY_MOVEMENT_ENDPOINTS.BASE);
        console.log('Respuesta de getInventoryMovements:', response.data);
        // Asumiendo que la API puede devolver un objeto con una propiedad 'results' si es paginada
        return Array.isArray(response.data) ? response.data : response.data.results || [];
    } catch (error) {
        console.error('Error fetching inventory movements:', error);
        throw error; // Re-lanzar el error para que el componente lo maneje
    }
};

/**
 * Crea un nuevo movimiento de inventario.
 * @param {Object} movementData Los datos del movimiento a crear.
 * @returns {Promise<Object>} Una promesa que resuelve con el movimiento creado.
 */
export const createInventoryMovement = async (movementData) => {
    console.log('Llamando al servicio: createInventoryMovement', movementData);
    try {
        const response = await api.post(INVENTORY_MOVEMENT_ENDPOINTS.CREATE, movementData);
        console.log('Respuesta del servidor (crear movimiento):', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al crear movimiento de inventario:', error);
        if (error.response) {
            console.error('Detalles del error de la API:', error.response.data);
            throw new Error(error.response.data.message || 'Error al crear el movimiento de inventario');
        }
        throw error;
    }
};

/**
 * Actualiza un movimiento de inventario existente (actualización parcial PATCH).
 * Usamos PATCH por ser más común para actualizaciones desde formularios.
 * @param {string|number} movementId El ID del movimiento a actualizar.
 * @param {Object} movementData Los datos a actualizar.
 * @returns {Promise<Object>} Una promesa que resuelve con el movimiento actualizado.
 */
export const updateInventoryMovement = async (movementId, movementData) => {
    console.log('Llamando al servicio: updateInventoryMovement (PATCH)', movementId, movementData);
    try {
        const response = await api.patch(INVENTORY_MOVEMENT_ENDPOINTS.UPDATE_PARTIAL(movementId), movementData);
        console.log(`Respuesta del servidor (actualizar movimiento ${movementId}):`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar movimiento ${movementId}:`, error);
        if (error.response) {
            console.error('Detalles del error de la API:', error.response.data);
            throw new Error(error.response.data.message || `Error al actualizar el movimiento ${movementId}`);
        }
        throw error;
    }
};

/**
 * Elimina un movimiento de inventario.
 * @param {string|number} movementId El ID del movimiento a eliminar.
 * @returns {Promise<void>} Una promesa que resuelve cuando el movimiento es eliminado.
 */
export const deleteInventoryMovement = async (movementId) => {
    console.log(`Intentando eliminar movimiento con ID: ${movementId}`);
    try {
        const response = await api.delete(INVENTORY_MOVEMENT_ENDPOINTS.DELETE(movementId));
        console.log(`Movimiento ${movementId} eliminado con éxito. Estado:`, response.status);
         // DELETE requests often return 204 No Content on success
        if (response.status === 204) {
            return; // Eliminado con éxito, no hay cuerpo de respuesta esperado
        } else if (response.data) {
             // Puede haber un cuerpo en la respuesta incluso para DELETE exitoso
             return response.data;
         } else {
              return; // Manejar otros posibles códigos de éxito sin cuerpo
         }
    } catch (error) {
        console.error(`Error al eliminar movimiento ${movementId}:`, error);
        if (error.response) {
            console.error('Detalles del error de la API:', error.response.data);
            throw new Error(error.response.data.message || `Error al eliminar el movimiento ${movementId}`);
        }
        throw error;
    }
};

// --- Funciones añadidas para endpoints faltantes ---

/**
 * Obtiene los movimientos de inventario recientes.
 * @returns {Promise<Array<Object>>} Una promesa que resuelve con la lista de movimientos recientes.
 */
export const getRecentInventoryMovements = async () => {
    console.log('Llamando al servicio: getRecentInventoryMovements');
    try {
        const response = await fetch(INVENTORY_MOVEMENT_ENDPOINTS.RECENT);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // TODO: Procesar la respuesta de la API
        return data;
    } catch (error) {
        console.error('Error fetching recent inventory movements:', error);
        throw error; // Re-lanzar el error
    }
};

/**
 * Obtiene los detalles de un movimiento de inventario específico.
 * @param {string|number} movementId El ID del movimiento.
 * @returns {Promise<Object>} Una promesa que resuelve con los detalles del movimiento.
 */
export const getInventoryMovementDetail = async (movementId) => {
    console.log('Llamando al servicio: getInventoryMovementDetail', movementId);
    try {
        const response = await fetch(INVENTORY_MOVEMENT_ENDPOINTS.DETAIL(movementId));
        if (!response.ok) {
             const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
        }
        const data = await response.json();
        // TODO: Procesar la respuesta de la API
        return data;
    } catch (error) {
        console.error('Error fetching inventory movement detail:', error);
        throw error; // Re-lanzar el error
    }
};

/**
 * Obtiene un resumen de los movimientos de inventario.
 * @returns {Promise<Object>} Una promesa que resuelve con el resumen.
 */
export const getInventoryMovementSummary = async () => {
     console.log('Llamando al servicio: getInventoryMovementSummary');
    try {
        const response = await fetch(INVENTORY_MOVEMENT_ENDPOINTS.SUMMARY);
        if (!response.ok) {
             const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
        }
        const data = await response.json();
        // TODO: Procesar la respuesta de la API
        return data;
    } catch (error) {
        console.error('Error fetching inventory movement summary:', error);
        throw error; // Re-lanzar el error
    }
};

/**
 * Filtra y/u ordena los movimientos de inventario.
 * @param {string} value El valor a buscar/filtrar (puede ser vacío).
 * @param {string} order El campo y orden para ordenar (ej. 'date', '-date', puede ser vacío).
 * @returns {Promise<Array<Object>>} Una promesa que resuelve con la lista de movimientos filtrados/ordenados.
 */
export const filterAndOrderInventoryMovements = async (value = '', order = '') => {
     console.log('Llamando al servicio: filterAndOrderInventoryMovements', { value, order });
     let url = INVENTORY_MOVEMENT_ENDPOINTS.BASE; // Empezar con el endpoint base

    // Construir URL con parámetros si existen
    const params = new URLSearchParams();
    if (value) {
        params.append('search', value);
    }
    if (order) {
        // Asumiendo que el backend espera 'ordering' con el campo prefijado por '-' para descendente
        params.append('ordering', order);
    }

    const queryString = params.toString();
    if (queryString) {
        // Usar el endpoint FILTER_AND_ORDER si está definido y es preferible,
        // o construir la URL manualmente como aquí.
        // Nota: El endpoint FILTER_AND_ORDER en endpoints.js parece ya incluir los parámetros.
        // Vamos a usarlo directamente si existe, si no, construimos con BASE.
         if (INVENTORY_MOVEMENT_ENDPOINTS.FILTER_AND_ORDER) {
             url = INVENTORY_MOVEMENT_ENDPOINTS.FILTER_AND_ORDER(value, order); // Usar la URL predefinida si existe
         } else if (queryString) {
             url = `${INVENTORY_MOVEMENT_ENDPOINTS.BASE}?${queryString}`;
         }

    }

    try {
         const response = await fetch(url, {
              headers: {
                 // TODO: Añadir cabeceras de autenticación si son necesarias
            }
         });
        if (!response.ok) {
             const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
        }
        const data = await response.json();
         // TODO: Procesar la respuesta de la API
        return data; // O data.results
    } catch (error) {
        console.error('Error filtering/ordering inventory movements:', error);
        throw error; // Re-lanzar el error
    }
};
