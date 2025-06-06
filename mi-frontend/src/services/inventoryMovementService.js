import { INVENTORY_MOVEMENT_ENDPOINTS } from './config/endpoints';

/**
 * Obtiene todos los movimientos de inventario.
 * @returns {Promise<Array<Object>>} Una promesa que resuelve con la lista de movimientos.
 */
export const getInventoryMovements = async () => {
    console.log('Llamando al servicio: getInventoryMovements');
    try {
        const response = await fetch(INVENTORY_MOVEMENT_ENDPOINTS.BASE);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // TODO: Procesar la respuesta de la API si es necesario (ej. data.results)
        return data; // O data.results si la API devuelve un objeto con resultados
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
        const response = await fetch(INVENTORY_MOVEMENT_ENDPOINTS.CREATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // TODO: Añadir cabeceras de autenticación si son necesarias
            },
            body: JSON.stringify(movementData),
        });
        if (!response.ok) {
            // TODO: Manejar errores específicos de la API (ej. validación)
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
        }
        const data = await response.json();
        // TODO: Procesar la respuesta de la API si es necesario
        return data;
    } catch (error) {
        console.error('Error creating inventory movement:', error);
        throw error; // Re-lanzar el error
    }
};

/**
 * Actualiza un movimiento de inventario existente (actualización completa PUT).
 * @param {string|number} movementId El ID del movimiento a actualizar.
 * @param {Object} movementData Los datos actualizados completos del movimiento.
 * @returns {Promise<Object>} Una promesa que resuelve con el movimiento actualizado.
 */
export const updateInventoryMovement = async (movementId, movementData) => {
    console.log('Llamando al servicio: updateInventoryMovement (PUT)', movementId, movementData);
    try {
        const response = await fetch(INVENTORY_MOVEMENT_ENDPOINTS.UPDATE_FULL(movementId), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                 // TODO: Añadir cabeceras de autenticación si son necesarias
            },
            body: JSON.stringify(movementData),
        });
        if (!response.ok) {
            // TODO: Manejar errores específicos de la API
             const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
        }
        const data = await response.json();
         // TODO: Procesar la respuesta de la API
        return data;
    } catch (error) {
        console.error('Error updating inventory movement (PUT):', error);
        throw error; // Re-lanzar el error
    }
};

/**
 * Elimina un movimiento de inventario.
 * @param {string|number} movementId El ID del movimiento a eliminar.
 * @returns {Promise<void>} Una promesa que resuelve cuando el movimiento es eliminado.
 */
export const deleteInventoryMovement = async (movementId) => {
    console.log('Llamando al servicio: deleteInventoryMovement', movementId);
    try {
        const response = await fetch(INVENTORY_MOVEMENT_ENDPOINTS.DELETE(movementId), {
            method: 'DELETE',
             headers: {
                 // TODO: Añadir cabeceras de autenticación si son necesarias
            }
        });
        if (!response.ok) {
             // TODO: Manejar errores específicos de la API
             // Las respuestas DELETE exitosas (204 No Content) no suelen tener cuerpo JSON
             // Asegúrate de no intentar parsear JSON si la respuesta es 204
             if (response.status !== 204) {
                 const errorData = await response.json();
                 throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
             } else {
                  throw new Error(`HTTP error! status: ${response.status}`);
             }
        }
        // No retorna nada en caso de éxito (generalmente 204 No Content)
        return; 
    } catch (error) {
        console.error('Error deleting inventory movement:', error);
        throw error; // Re-lanzar el error
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
 * Actualiza parcialmente un movimiento de inventario existente (PATCH).
 * @param {string|number} movementId El ID del movimiento a actualizar.
 * @param {Object} movementData Los datos parciales a actualizar.
 * @returns {Promise<Object>} Una promesa que resuelve con el movimiento actualizado.
 */
export const updatePartialInventoryMovement = async (movementId, movementData) => {
    console.log('Llamando al servicio: updatePartialInventoryMovement (PATCH)', movementId, movementData);
    try {
        const response = await fetch(INVENTORY_MOVEMENT_ENDPOINTS.UPDATE_PARTIAL(movementId), {
            method: 'PATCH', // Usar PATCH para actualización parcial
            headers: {
                'Content-Type': 'application/json',
                 // TODO: Añadir cabeceras de autenticación si son necesarias
            },
            body: JSON.stringify(movementData),
        });
        if (!response.ok) {
            // TODO: Manejar errores específicos de la API
             const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
        }
        const data = await response.json();
         // TODO: Procesar la respuesta de la API
        return data;
    } catch (error) {
        console.error('Error updating inventory movement (PATCH):', error);
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
