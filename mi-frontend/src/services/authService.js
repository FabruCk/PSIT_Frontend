import api from './config/api';
import { AUTH_ENDPOINTS } from './config/endpoints';

//login del api
export const login = async (credentials) => {
    console.log('authService login - Credenciales recibidas:', credentials.username);
    try {
        const loginData = {
            username: credentials.username,
            password: credentials.password,
        };
        console.log('authService login - Datos formateados para enviar:', loginData);

        const response = await api.post(AUTH_ENDPOINTS.LOGIN, loginData);
        console.log('authService login - Respuesta completa de la API:', response);
        console.log('authService login - Datos de la respuesta de la API:', response.data);
        console.log('authService login - is_first_login en respuesta:', response.data.user?.is_first_login);

        // Verificar si tenemos tokens en la respuesta
        if (response.data && response.data.tokens && response.data.tokens.access) {
            console.log('authService login - Token de acceso recibido, guardando en localStorage');
            localStorage.setItem('token', response.data.tokens.access);
            
            if (response.data.tokens.refresh) {
                console.log('authService login - Refresh token recibido, guardando en localStorage');
                localStorage.setItem('refreshToken', response.data.tokens.refresh);
            }
            
            console.log('authService login - Configurando header de autorización');
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.tokens.access}`;
            
            // Asegurarnos de que los datos del usuario estén en el formato correcto
            const userData = {
                id: response.data.user.id,
                username: response.data.user.username,
                email: response.data.user.email,
                is_superuser: response.data.user.is_superuser !== undefined ? response.data.user.is_superuser : false,
                is_staff: response.data.user.is_staff !== undefined ? response.data.user.is_staff : false,
                role: response.data.user.role || null,
                is_first_login: response.data.user.is_first_login === true // Forzar a booleano
            };
            
            console.log('authService login - Datos del usuario formateados para retorno:', userData);
            console.log('authService login - is_first_login en userData:', userData.is_first_login);
            
            // Guardar los datos del usuario en localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            
            return {
                access: response.data.tokens.access,
                refresh: response.data.tokens.refresh,
                user: userData
            };
        } else {
            console.error('authService login - La respuesta de la API no contiene el token de acceso esperado.');
            console.error('authService login - Estructura de la respuesta:', JSON.stringify(response.data, null, 2));
            throw new Error('No se recibió el token de acceso de la API');
        }
    } catch (error) {
        console.error('authService login - Error en la llamada a la API de login:', error);
        console.error('authService login - Detalles del error:', {
            message: error.message,
            response_data: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

//logout del api
export const logout = async () => {
    console.log('authService logout - Iniciando cierre de sesión');
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            console.log('authService logout - Enviando refresh token para invalidar sesión');
            await api.post(AUTH_ENDPOINTS.LOGOUT, { refresh: refreshToken });
            console.log('authService logout - Llamada a la API de logout completada.');
        } else {
            console.log('authService logout - No hay refresh token para enviar al backend.');
        }
    } catch (error) {
        console.error('authService logout - Error al llamar a la API de logout:', error);
        console.error('authService logout - Detalles del error:', {
            message: error.message,
            response_data: error.response?.data,
            status: error.response?.status
        });
        // Continuar con la limpieza del frontend aunque el backend falle el logout
    } finally {
        console.log('authService logout - Limpiando tokens y header de autorización en frontend.');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
        delete api.defaults.headers.common['Authorization'];
        console.log('authService logout - Limpieza de frontend completada.');
    }
};

//Register del api
export const register = async (userData) => {
    try {
        // Asegurarnos de que los datos estén en el formato correcto
        const registerData = {
            first_name: userData.firstName,
            last_name: userData.lastName,
            username: userData.username,
            email: userData.email,
            password: userData.password
        };

        console.log('URL de registro:', AUTH_ENDPOINTS.REGISTER);
        console.log('Datos de registro:', registerData);

        // Intentar la petición con la URL completa
        const response = await api.post('auth/register/', registerData);
        
        console.log('Respuesta del servidor:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error completo:', error);
        console.error('Error response:', error.response);
        console.error('Error request:', error.request);
        throw error;
    }
};

export const getCurrentUser = async () => {
    console.log('authService getCurrentUser - Intentando obtener usuario actual');
    try {
        const token = localStorage.getItem('token');
        console.log('authService getCurrentUser - Token presente:', token ? 'Sí' : 'No');
        
        if (!token) {
            console.log('authService getCurrentUser - No hay token, no se puede obtener usuario.');
            return null;
        }

        const response = await api.get(AUTH_ENDPOINTS.CURRENT_USER);
        console.log('authService getCurrentUser - Respuesta de la API:', response.data);
        
        // Asegurarnos de que los datos del usuario estén en el formato correcto
        const userData = {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            is_superuser: response.data.is_superuser !== undefined ? response.data.is_superuser : false,
            is_staff: response.data.is_staff !== undefined ? response.data.is_staff : false,
            role: response.data.role || 'empleado', // Aseguramos que el rol esté incluido
            is_first_login: response.data.is_first_login === true // Forzar a booleano
        };

        console.log('authService getCurrentUser - Datos del usuario formateados para retorno:', userData);
        console.log('authService getCurrentUser - Rol del usuario:', userData.role);
        console.log('authService getCurrentUser - is_first_login:', userData.is_first_login);

        return userData;
    } catch (error) {
        console.error('authService getCurrentUser - Error al obtener usuario actual:', error);
        console.error('authService getCurrentUser - Detalles del error:', {
            message: error.message,
            response_data: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

export const refreshToken = async () => {
    console.log('authService refreshToken - Intentando refrescar token');
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('authService refreshToken - Refresh token presente:', refreshToken ? 'Sí' : 'No');
        
        if (!refreshToken) {
            console.log('authService refreshToken - No hay refresh token para refrescar.');
            throw new Error('No refresh token available');
        }

        const response = await api.post(AUTH_ENDPOINTS.REFRESH, { refresh: refreshToken });
        console.log('authService refreshToken - Respuesta del refresh token:', response.data);
        const newAccessToken = response.data.access;
        
        if (newAccessToken) {
            localStorage.setItem('token', newAccessToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
             console.log('authService refreshToken - Token de acceso refrescado y guardado.');
            return newAccessToken;
        } else {
             console.error('authService refreshToken - La respuesta no contiene un nuevo token de acceso.');
            throw new Error('No new access token received');
        }
    } catch (error) {
        console.error('authService refreshToken - Error al refrescar token:', error);
         console.error('authService refreshToken - Detalles del error:', {
            message: error.message,
            response_data: error.response?.data,
            status: error.response?.status
        });
        // En caso de error al refrescar, probablemente el refresh token ha expirado o es inválido
        // Esto podría significar que el usuario necesita loggearse de nuevo
        // No hacemos la limpieza aquí, eso lo maneja el interceptor o el componente de logout si es necesario
        throw error; // Relanzar el error para que el interceptor o quien llame lo maneje
    }
};

export const changeFirstLoginPassword = async (currentPassword, newPassword) => {
    try {
        // Asegurarnos de que el token esté presente
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        // Formatear los datos exactamente como los espera el backend
        const requestData = {
            old_password: currentPassword,
            new_password: newPassword,
            confirm_password: newPassword
        };

        console.log('authService changeFirstLoginPassword - Enviando datos:', requestData);

        const response = await api.post(AUTH_ENDPOINTS.CHANGE_PASS_FIRST_LOGIN, requestData);
        console.log('authService changeFirstLoginPassword - Respuesta:', response.data);

        if (response.data && response.data.status === 'success') {
            // Obtener los datos actualizados del usuario
            const userData = await getCurrentUser();
            console.log('authService changeFirstLoginPassword - Datos actualizados del usuario:', userData);
            
            if (userData) {
                // Forzar is_first_login a false ya que acabamos de cambiar la contraseña
                userData.is_first_login = false;
                
                // Actualizar el estado del usuario en localStorage
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Actualizar el estado en el contexto de autenticación
                const event = new CustomEvent('userUpdated', { 
                    detail: userData
                });
                window.dispatchEvent(event);

                // Actualizar el header de autorización
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }

            return {
                ...response.data,
                user: userData
            };
        } else {
            throw new Error(response.data?.message || 'Error al cambiar la contraseña');
        }
    } catch (error) {
        console.error('authService changeFirstLoginPassword - Error:', error);
        if (error.response?.data) {
            console.error('authService changeFirstLoginPassword - Detalles del error:', error.response.data);
            throw error.response.data;
        }
        throw error;
    }
}; 