import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (!user) {
                    console.log('Dashboard - No hay usuario, redirigiendo a login');
                    navigate('/login');
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Dashboard - Error al verificar autenticación:', error);
                navigate('/login');
            }
        };

        checkAuth();
    }, [user, navigate]);

    const handleLogout = async () => {
        try {
            console.log('Dashboard - Intentando cerrar sesión');
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Dashboard - Error al cerrar sesión:', error);
        }
    };

    if (isLoading) {
        return <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1 className="title-panel">Cargando...</h1>
            </div>
        </div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1 className="title-panel">Panel de Administración</h1>
                <div className="user-info">
                    <p className="span-info">Usuario: </p>
                    <span className="span-user-info">{user?.username}</span>
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
                        <button className="card-button" onClick={() => navigate('/admin/usuarios')}>
                            Gestionar Usuarios
                        </button>
                    </div>
                    <div className="card">
                        <h3>Gestión de Productos</h3>
                        <p>Administrar productos del sistema</p>
                        <button className="card-button" onClick={() => navigate('/admin/productos')}>
                            Gestionar Productos
                        </button>
                    </div>
                    <div className="card">
                        <h3>Gestión de Categorías</h3>
                        <p>Administrar categorias del sistema</p>
                        <button className="card-button" onClick={() => navigate('/admin/categorias')}>
                            Gestionar Categorías
                        </button>
                    </div>
                    <div className="card">
                        <h3>Gestión de Proveedores</h3>
                        <p>Administrar proveedores del sistema</p>
                        <button className="card-button" onClick={() => navigate('/admin/proveedores')}>
                            Gestionar Proveedores
                        </button>
                    </div>
                    <div className="card">
                        <h3>Movimientos de Inventario</h3>
                        <p>Gestionar entradas, salidas y ajustes de inventario</p>
                        <button className="card-button" onClick={() => navigate('/admin/movimientos-inventario')}>
                            Gestionar Movimientos
                        </button>
                    </div>
                    <div className="card">
                        <h3>Gestion de Mantenimientos</h3>
                        <p>Gestionar los mantenimientos, su estado, etc.</p>
                        <button className="card-button" onClick={() => navigate('/admin/mantenimientos')}>
                            Gestionar Mantenimientos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 