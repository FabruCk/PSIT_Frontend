// pages/auth/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserRole, DEFAULT_ROUTES } from '../../config/roles';
import Login from '../../components/auth/Login';

const LoginPage = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, user } = useAuth();

    useEffect(() => {
        console.log('LoginPage useEffect - Estado:', { isAuthenticated, user });
        if (isAuthenticated && user) {
            console.log('LoginPage useEffect - Datos completos del usuario:', user);
            const userRole = getUserRole(user);
            const defaultRoute = DEFAULT_ROUTES[userRole];
            console.log('LoginPage useEffect - Rol determinado por getUserRole:', userRole);
            console.log('LoginPage useEffect - Ruta por defecto para el rol:', defaultRoute);
            console.log('LoginPage useEffect - Redirigiendo a:', defaultRoute);
            navigate(defaultRoute);
        }
    }, [isAuthenticated, user, navigate]);

    const handleLogin = async (credentials) => {
        setError('');
        setLoading(true);
        console.log('LoginPage handleLogin - Intentando login con', credentials.username);
        try {
            const response = await login(credentials);
            console.log('LoginPage handleLogin - Respuesta del login (éxito esperado):', response);
            
            if (response && response.access) {
                console.log('LoginPage handleLogin - Login exitoso. Redirección manejada por useEffect.');
                // La redirección se manejará en el useEffect basado en el rol y datos de usuario en AuthContext
            } else {
                 console.error('LoginPage handleLogin - Login no exitoso. No se recibió token de acceso.');
                 setError(response?.detail || 'Error desconocido en la respuesta del servidor');
            }
        } catch (error) {
            console.error('LoginPage handleLogin - Error en el login:', error);
            // Asegurarse de que el error se muestre al usuario
            const errorMessage = error.response?.data?.detail || error.message || 'Error al iniciar sesión. Inténtalo de nuevo.';
            setError(errorMessage);
            console.log('LoginPage handleLogin - Error mostrado al usuario:', errorMessage);
        } finally {
            setLoading(false);
            console.log('LoginPage handleLogin - Proceso de login finalizado.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>FluVent</h1>
                    <p>Iniciar Sesión</p>
                </div>
                <Login onLogin={handleLogin} error={error} />
                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner">Verificando...</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;