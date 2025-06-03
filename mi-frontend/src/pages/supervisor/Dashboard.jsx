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
                <h1>Panel de Supervisor</h1>
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
                        <h3>Gestión de Empleados</h3>
                        <p>Supervisar y gestionar el personal</p>
                        <button className="card-button">Ver Empleados</button>
                    </div>
                    <div className="card">
                        <h3>Reportes de Inventario</h3>
                        <p>Ver y analizar reportes de inventario</p>
                        <button className="card-button">Ver Reportes</button>
                    </div>
                    <div className="card">
                        <h3>Asignaciones</h3>
                        <p>Gestionar asignaciones de trabajo</p>
                        <button className="card-button">Ver Asignaciones</button>
                    </div>
                    <div className="card">
                        <h3>Métricas</h3>
                        <p>Ver métricas de rendimiento</p>
                        <button className="card-button">Ver Métricas</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 