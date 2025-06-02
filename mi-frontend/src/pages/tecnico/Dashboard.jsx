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
                <h1>Panel de Técnico</h1>
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
                        <h3>Servicios</h3>
                        <p>Gestionar servicios técnicos</p>
                        <button className="card-button">Ver Servicios</button>
                    </div>
                    <div className="card">
                        <h3>Mantenimientos</h3>
                        <p>Programar y gestionar mantenimientos</p>
                        <button className="card-button">Ver Mantenimientos</button>
                    </div>
                    <div className="card">
                        <h3>Reportes Técnicos</h3>
                        <p>Ver y crear reportes técnicos</p>
                        <button className="card-button">Ver Reportes</button>
                    </div>
                    <div className="card">
                        <h3>Herramientas</h3>
                        <p>Gestionar herramientas y equipos</p>
                        <button className="card-button">Ver Herramientas</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 