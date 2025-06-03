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
                console.log('AuthContext - Token presente:', token ? 'Sí' : 'No');
                
                if (token) {
                    // Intentar obtener los datos del usuario del localStorage
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        console.log('AuthContext - Usuario encontrado en localStorage:', JSON.parse(storedUser));
                        setUser(JSON.parse(storedUser));
                        setIsAuthenticated(true);
                    } else {
                        console.log('AuthContext - No hay datos de usuario almacenados');
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                } else {
                    console.log('AuthContext - No hay token, usuario no autenticado');
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
                    role: response.user.role || 'empleado' // Aseguramos que siempre haya un rol
                };
                
                console.log('AuthContext - Datos del usuario a guardar:', userData);
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
        logout
    };

    console.log('AuthContext - Estado actual:', { user, isAuthenticated, loading });

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;