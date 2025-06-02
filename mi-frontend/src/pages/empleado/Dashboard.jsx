import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';
import '../../styles/pages/roles/empleado.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Panel de Empleado</h1>
                <div className="user-info">
                    <span>Bienvenido, {user?.username}</span>
                    <button onClick={handleLogout} className="logout-button">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
            <div className="dashboard-content">
                <div className="dashboard-cards">
                    <div className="card">
                        <h3>Inventario</h3>
                        <p>Gestionar el inventario de productos</p>
                        <button className="card-button">Ver Inventario</button>
                    </div>
                    <div className="card">
                        <h3>Reportes</h3>
                        <p>Ver reportes de actividades</p>
                        <button className="card-button">Ver Reportes</button>
                    </div>
                    <div className="card">
                        <h3>Perfil</h3>
                        <p>Gestionar información personal</p>
                        <button className="card-button">Editar Perfil</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 