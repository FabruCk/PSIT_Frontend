import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getUserRole, DEFAULT_ROUTES, hasAccessToRoute } from './config/roles';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/Dashboard';
import EmpleadoDashboard from './pages/empleado/Dashboard';
import SupervisorDashboard from './pages/supervisor/Dashboard';
import TecnicoDashboard from './pages/tecnico/Dashboard';
import GestionUsuarios from './pages/admin/GestionUsuarios';
import GestionMovimientosInventario from './pages/admin/GestionMovimientosInventario';
import GestionProductos from './pages/admin/GestionProductos';
import GestionCategorias from './pages/admin/GestionCategorias';
import GestionProveedores from './pages/admin/GestionProveedores';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';
import GestionMantenimiento from './pages/admin/GestionMantenimiento';
import './styles/App.css';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    console.log('ProtectedRoute - Estado de autenticación (loading, isAuthenticated, user):', { loading, isAuthenticated, user });

    if (loading) {
        console.log('ProtectedRoute - Cargando...');
        return <div>Cargando...</div>; // O un spinner de carga
    }

    if (!isAuthenticated || !user) {
        console.log('ProtectedRoute - No autenticado o usuario nulo, redirigiendo a login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // En este punto, sabemos que el usuario está autenticado y el objeto user no es nulo.
    console.log('ProtectedRoute - Usuario autenticado. Detalles del usuario:', { 
        id: user.id,
        username: user.username,
        role: user.role, 
        is_staff: user.is_staff,
        is_first_login: user.is_first_login,
        pathname: location.pathname
    });

    // Verificar si el usuario necesita cambiar la contraseña primero
    if (user.is_first_login && location.pathname !== '/change-password') {
        console.log('ProtectedRoute - Usuario necesita cambiar contraseña, redirigiendo a /change-password');
         return <Navigate to="/change-password" state={{ from: location }} replace />;
    }
    
     // Si está en la página de cambio de contraseña y ya no es primer login, redirigir a su dashboard por defecto
     if (!user.is_first_login && location.pathname === '/change-password') {
        const userRole = getUserRole(user);
        const defaultRoute = DEFAULT_ROUTES[userRole];
        console.log('ProtectedRoute - Usuario ya cambió contraseña, redirigiendo a su dashboard por defecto:', defaultRoute);
         return <Navigate to={defaultRoute} replace />;
     }

    // Verificar si el usuario tiene acceso a la ruta actual
    if (!hasAccessToRoute(user, location.pathname)) {
        console.log('ProtectedRoute - Usuario no tiene acceso a esta ruta.');
        const userRole = getUserRole(user);
        const defaultRoute = DEFAULT_ROUTES[userRole];
        console.log('ProtectedRoute - Redirigiendo al dashboard por defecto del rol (' + userRole + '):', defaultRoute);
        return <Navigate to={defaultRoute} replace />;
    }

    console.log('ProtectedRoute - Usuario autenticado y con acceso a '+ location.pathname + ', permitiendo acceso.');
    return children;
};

// Componente para rutas públicas
const PublicRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (isAuthenticated && user) {
        // Si el usuario necesita cambiar su contraseña, permitir el acceso a la página de login
        if (user.is_first_login === true) {
            console.log('PublicRoute - Usuario necesita cambiar contraseña, permitiendo acceso');
            return children;
        }

        const userRole = getUserRole(user);
        const defaultRoute = DEFAULT_ROUTES[userRole];
        console.log('PublicRoute - Usuario autenticado, redirigiendo a:', defaultRoute);
        return <Navigate to={defaultRoute} replace />;
    }

    return children;
};
// Componente de rutas
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
                path="/login" 
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                } 
            />
            {/* Rutas para Administrador */}
            <Route 
                path="/admin/*" 
                element={
                    <ProtectedRoute>
                        {/* Nested Routes para /admin */}
                        <Routes> {/* Usamos Routes anidadas aquí */}
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="usuarios" element={<GestionUsuarios />} />
                            <Route path="movimientos-inventario" element={<GestionMovimientosInventario />} />
                            <Route path="productos" element={<GestionProductos />} />
                            <Route path="categorias" element={<GestionCategorias />} />
                            <Route path="proveedores" element={<GestionProveedores />} />
                            <Route path="mantenimientos" element={<GestionMantenimiento/>}/>                            <Route path="*" element={<Navigate to="dashboard" replace />} /> 
                        </Routes>
                    </ProtectedRoute>
                } 
            />
            {/* Ruta para cambio de contraseña obligatorio (nivel superior)*/}
            <Route 
                path="/change-password"
                element={
                    <ProtectedRoute>
                        <ChangePasswordPage />
                    </ProtectedRoute>
                }
            />
            {/* Rutas para Supervisor */}
            <Route 
                path="/supervisor/*" 
                element={
                    <ProtectedRoute>
                        <SupervisorDashboard />
                    </ProtectedRoute>
                } 
            />
            {/* Rutas para Técnico */}
            <Route 
                path="/tecnico/*" 
                element={
                    <ProtectedRoute>
                        <TecnicoDashboard />
                    </ProtectedRoute>
                } 
            />
            {/* Rutas para Empleado */}
            <Route 
                path="/empleado/*" 
                element={
                    <ProtectedRoute>
                        <Routes>
                            <Route path="dashboard" element={<EmpleadoDashboard />} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </ProtectedRoute>
                } 
            />
             {/* Ruta comodín para manejar rutas no encontradas */}
             <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Routes>
    );
};

// Componente principal
const App = () => {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
};

export default App;