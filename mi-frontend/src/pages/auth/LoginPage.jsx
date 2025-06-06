// pages/auth/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserRole, DEFAULT_ROUTES } from '../../config/roles';
import Login from '../../components/auth/Login';
import '../../styles/pages/auth/auth.css';


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
            console.log('LoginPage useEffect - is_first_login:', user.is_first_login);
            
            // Verificar si es el primer inicio de sesión y necesita cambiar la contraseña
            if (user.is_first_login === true) {
                console.log('LoginPage useEffect - Primer login detectado, redirigiendo a cambio de contraseña');
                navigate('/change-password', { replace: true });
                return; // Importante: salir del useEffect aquí
            }

            // Si no es primer login, continuar con la redirección normal
            const userRole = getUserRole(user);
            const defaultRoute = DEFAULT_ROUTES[userRole];
            console.log('LoginPage useEffect - No es primer login, redirigiendo a dashboard:', defaultRoute);
            navigate(defaultRoute, { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const handleLogin = async (credentials) => {
        setError('');
        setLoading(true);
        console.log('LoginPage handleLogin - Intentando login con', credentials.username);
        try {
            const response = await login(credentials);
            console.log('LoginPage handleLogin - Respuesta del login:', response);
            console.log('LoginPage handleLogin - is_first_login en respuesta:', response.user?.is_first_login);
            
            if (response && response.access) {
                console.log('LoginPage handleLogin - Login exitoso. Redirección manejada por useEffect.');
            } else {
                console.error('LoginPage handleLogin - Login no exitoso. No se recibió token de acceso.');
                setError(response?.detail || 'Error desconocido en la respuesta del servidor');
            }
        } catch (error) {
            console.error('LoginPage handleLogin - Error en el login:', error);
            const errorMessage = error.response?.data?.detail || error.message || 'Error al iniciar sesión. Inténtalo de nuevo.';
            setError(errorMessage);
            console.log('LoginPage handleLogin - Error mostrado al usuario:', errorMessage);
        } finally {
            setLoading(false);
            console.log('LoginPage handleLogin - Proceso de login finalizado.');
        }
    };

    const handleUserUpdate = (event) => {
        console.log('AuthContext - Evento de actualización de usuario recibido:', event.detail);
        setUser(event.detail);
        
    };
    window.removeEventListener('userUpdated', handleUserUpdate);

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