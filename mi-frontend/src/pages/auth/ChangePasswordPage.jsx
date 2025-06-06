import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { changeFirstLoginPassword } from '../../services/authService';
import { getUserRole, DEFAULT_ROUTES } from '../../config/roles';
import '../../styles/pages/auth/auth.css';

const ChangePasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        console.log('ChangePasswordPage - Estado actual:', { user, isAuthenticated });
        
        // Redirigir si el usuario no está autenticado
        if (!isAuthenticated || !user) {
            console.log('ChangePasswordPage - Usuario no autenticado, redirigiendo a login');
            navigate('/login', { replace: true });
            return;
        }

        // Redirigir si el usuario ya cambió su contraseña
        if (!user.is_first_login) {
            console.log('ChangePasswordPage - Usuario ya cambió su contraseña, redirigiendo a dashboard');
            const userRole = getUserRole(user);
            navigate(DEFAULT_ROUTES[userRole] || '/', { replace: true });
        }
    }, [user, isAuthenticated, navigate]);

    const validatePassword = (password) => {
        // Mínimo 8 caracteres, al menos una letra mayúscula, una minúscula y un número
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (newPassword !== confirmNewPassword) {
            setError('La nueva contraseña y la confirmación no coinciden.');
            return;
        }

        if (!validatePassword(newPassword)) {
            setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.');
            return;
        }

        setLoading(true);
        try {
            const response = await changeFirstLoginPassword(currentPassword, newPassword);
            console.log('ChangePasswordPage - Respuesta del cambio de contraseña:', response);
            
            if (response.status === 'success') {
                // Actualizar el estado del usuario en el contexto
                const updatedUser = { 
                    ...user, 
                    is_first_login: false 
                };
                
                console.log('ChangePasswordPage - Usuario actualizado:', updatedUser);
                
                // Disparar evento de actualización
                const event = new CustomEvent('userUpdated', { 
                    detail: updatedUser 
                });
                window.dispatchEvent(event);
                
                // Limpiar el localStorage y volver a guardar los datos actualizados
                localStorage.removeItem('user');
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                alert('Contraseña cambiada con éxito.');
                const userRole = getUserRole(updatedUser);
                navigate(DEFAULT_ROUTES[userRole] || '/', { replace: true });
            } else {
                setError(response.message || 'Error al cambiar la contraseña');
            }
        } catch (error) {
            console.error('ChangePasswordPage - Error al cambiar la contraseña:', error);
            if (error.errors) {
                // Si hay errores específicos de validación
                const errorMessages = Object.values(error.errors).flat();
                setError(errorMessages.join(', '));
            } else {
                setError(error.message || 'Error al cambiar la contraseña.');
            }
        } finally {
            setLoading(false);
        }
    };

    // No renderizar nada si el usuario no está autenticado o ya cambió su contraseña
    if (!isAuthenticated || !user || !user.is_first_login) {
        return null;
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>Cambio de Contraseña Obligatorio</h1>
                    <p>Por favor, cambia tu contraseña para continuar.</p>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="currentPassword">Contraseña Actual:</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            placeholder="Ingrese su contraseña actual"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">Nueva Contraseña:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Ingrese su nueva contraseña"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña:</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                            placeholder="Confirme su nueva contraseña"
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage; 