import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';


const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Dashboard - Componente montado');
        console.log('Dashboard - Usuario:', user);
    }, [user]);

    const handleLogout = async () => {
        try {
            console.log('Dashboard - Intentando cerrar sesión');
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Dashboard - Error al cerrar sesión:', error);
        }
    };

    console.log('Dashboard - Renderizando componente');

    if (!user) {
        console.log('Dashboard - No hay usuario, redirigiendo a login');
        return <div>Cargando...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Panel de Administración</h1>
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
                        <h3>Gestión de Usuarios</h3>
                        <p>Administrar usuarios del sistema</p>
                        <button className="card-button">Gestionar Usuarios</button>
                    </div>
                    <div className="card">
                        <h3>Gestión de Productos</h3>
                        <p>Administrar productos del sistema</p>
                        <button className="card-button">Gestionar Productos</button>
                    </div>
                    <div className="card">
                        <h3>Gestión de Categorías</h3>
                        <p>Administrar categorías del sistema</p>
                        <button className="card-button">Gestionar Categorías</button>
                    </div>
                    <div className="card">
                        <h3>Gestión de Proveedores</h3>
                        <p>Administrar proveedores del sistema</p>
                        <button className="card-button">Gestionar Proveedores</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 