import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as authLogin, logout as authLogout, getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log('AuthContext - Verificando autenticación');
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');
                console.log('AuthContext - Token presente:', token ? 'Sí' : 'No');
                console.log('AuthContext - Usuario almacenado:', storedUser ? 'Sí' : 'No');
                
                if (token && storedUser) {
                    try {
                        // Intentar obtener los datos actualizados del usuario
                        const userData = await getCurrentUser();
                        console.log('AuthContext - Datos del usuario obtenidos:', userData);
                        
                        if (userData) {
                            // Mantener el rol del usuario almacenado si existe
                            const storedUserData = JSON.parse(storedUser);
                            const formattedUserData = {
                                id: userData.id,
                                username: userData.username,
                                email: userData.email,
                                is_superuser: userData.is_superuser,
                                is_staff: userData.is_staff,
                                role: storedUserData.role || userData.role || 'empleado',
                                is_first_login: userData.is_first_login === true
                            };
                            
                            console.log('AuthContext - Datos del usuario formateados:', formattedUserData);
                            console.log('AuthContext - Rol del usuario:', formattedUserData.role);
                            
                            // Guardar en localStorage
                            localStorage.setItem('user', JSON.stringify(formattedUserData));
                            setUser(formattedUserData);
                            setIsAuthenticated(true);
                        } else {
                            throw new Error('No se pudieron obtener los datos del usuario');
                        }
                    } catch (error) {
                        console.error('AuthContext - Error al obtener datos del usuario:', error);
                        // Si hay error al obtener los datos del usuario, limpiar todo
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                } else {
                    console.log('AuthContext - No hay token o usuario almacenado, usuario no autenticado');
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('AuthContext - Error al verificar autenticación:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            console.log('AuthContext - Intentando login con:', credentials);
            const response = await authLogin(credentials);
            console.log('AuthContext - Respuesta del login:', response);
            
            if (response.access) {
                // Guardar los datos del usuario en localStorage
                const userData = {
                    id: response.user.id,
                    username: response.user.username,
                    email: response.user.email,
                    is_superuser: response.user.is_superuser,
                    is_staff: response.user.is_staff,
                    role: response.user.role || 'empleado',
                    is_first_login: response.user.is_first_login === true
                };
                
                console.log('AuthContext - Datos del usuario a guardar:', userData);
                console.log('AuthContext - Rol del usuario:', userData.role);
                
                // Guardar en localStorage
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setIsAuthenticated(true);
                return response;
            } else {
                throw new Error('No se recibió el token de acceso');
            }
        } catch (error) {
            console.error('AuthContext - Error en login:', error);
            setUser(null);
            setIsAuthenticated(false);
            throw error;
        }
    };

    const updateUserState = (updatedUserData) => {
        console.log('AuthContext - Actualizando estado del usuario:', updatedUserData);
        
        // Mantener el rol actual si no se proporciona uno nuevo
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userData = {
            ...updatedUserData,
            role: updatedUserData.role || currentUser.role || 'empleado',
            is_first_login: updatedUserData.is_first_login === true
        };
        
        console.log('AuthContext - Rol del usuario actualizado:', userData.role);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    useEffect(() => {
        const handleUserUpdate = (event) => {
            console.log('AuthContext - Evento de actualización de usuario recibido:', event.detail);
            updateUserState(event.detail);
        };

        window.addEventListener('userUpdated', handleUserUpdate);
        return () => window.removeEventListener('userUpdated', handleUserUpdate);
    }, []);

    const logout = async () => {
        try {
            console.log('AuthContext - Iniciando logout');
            await authLogout();
        } catch (error) {
            console.error('AuthContext - Error al cerrar sesión:', error);
        } finally {
            console.log('AuthContext - Limpiando estado de autenticación');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUserState
    };

    console.log('AuthContext - Estado actual:', { user, isAuthenticated, loading });

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;