import api from './config/api';
import { USER_ENDPOINTS } from './config/endpoints';

export const getAllUsers = async () => {
    console.log('userService getAllUsers - Intentando obtener todos los usuarios');
    try {
        const response = await api.get(USER_ENDPOINTS.GET_ALL);
        console.log('userService getAllUsers - Respuesta de la API:', response.data);
        return response.data;
    } catch (error) {
        console.error('userService getAllUsers - Error al obtener usuarios:', error);
        console.error('userService getAllUsers - Detalles del error:', {
            message: error.message,
            response_data: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

// Alias para getAllUsers para mantener compatibilidad
export const getUsers = getAllUsers;

// Función para actualizar un usuario
export const updateUser = async (userId, userData) => {
    console.log('userService updateUser - Intentando actualizar usuario con ID:', userId);
    console.log('userService updateUser - Datos a enviar:', userData);
    try {
        // Usamos PATCH para actualización parcial
        const response = await api.patch(USER_ENDPOINTS.UPDATE(userId), userData);
        console.log('userService updateUser - Respuesta de la API:', response.data);
        return response.data;
    } catch (error) {
        console.error('userService updateUser - Error al actualizar usuario:', error);
        console.error('userService updateUser - Detalles del error:', {
            message: error.message,
            response_data: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

// Función para eliminar un usuario
export const deleteUser = async (userId) => {
    console.log('userService deleteUser - Intentando eliminar usuario con ID:', userId);
    try {
        // Usamos DELETE para eliminar un usuario
        const response = await api.delete(USER_ENDPOINTS.DELETE(userId));
        console.log('userService deleteUser - Respuesta de la API (eliminación):', response.data);
        return response.data; // La respuesta puede ser vacía o con un mensaje de éxito
    } catch (error) {
        console.error('userService deleteUser - Error al eliminar usuario:', error);
        console.error('userService deleteUser - Detalles del error:', {
            message: error.message,
            response_data: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

// Función para crear un nuevo usuario
export const createUser = async (userData) => {
    console.log('userService createUser - Intentando crear nuevo usuario:', userData.username);
    try {
        // Usamos POST para crear un nuevo usuario
        const response = await api.post(USER_ENDPOINTS.CREATE, userData);
        console.log('userService createUser - Respuesta de la API (creación):', response.data);
        return response.data; // El backend debería devolver el objeto del usuario creado
    } catch (error) {
        console.error('userService createUser - Error al crear usuario:', error);
        console.error('userService createUser - Detalles del error:', {
            message: error.message,
            response_data: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
}; 