import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

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
                        <h3>Gestión de Inventario</h3>
                        <p>Control y gestión del inventario de productos y materiales</p>
                        <button className="card-button">Ver Inventario</button>
                    </div>
                    <div className="card">
                        <h3>Reportes de Actividades</h3>
                        <p>Ver y generar reportes de operaciones diarias</p>
                        <button className="card-button">Ver Reportes</button>
                    </div>
                    <div className="card">
                        <h3>Solicitudes de Mantenimiento</h3>
                        <p>Gestionar y dar seguimiento a solicitudes de mantenimiento</p>
                        <button className="card-button">Ver Solicitudes</button>
                    </div>
                    <div className="card">
                        <h3>Equipos Asignados</h3>
                        <p>Ver y gestionar equipos bajo tu responsabilidad</p>
                        <button className="card-button">Ver Equipos</button>
                    </div>
                    <div className="card">
                        <h3>Calendario de Mantenimientos</h3>
                        <p>Consultar agenda de mantenimientos programados</p>
                        <button className="card-button">Ver Calendario</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 