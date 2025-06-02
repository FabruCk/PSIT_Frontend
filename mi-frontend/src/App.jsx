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
import './styles/App.css';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    console.log('ProtectedRoute - Estado:', { isAuthenticated, user, loading });

    if (loading) {
        console.log('ProtectedRoute - Cargando...');
        return <div>Cargando...</div>;
    }

    if (!isAuthenticated || !user) {
        console.log('ProtectedRoute - No autenticado, redirigiendo a login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Verificar si el usuario tiene acceso a la ruta actual
    if (!hasAccessToRoute(user, location.pathname)) {
        console.log('ProtectedRoute - Usuario no tiene acceso a esta ruta');
        const userRole = getUserRole(user);
        return <Navigate to={DEFAULT_ROUTES[userRole]} replace />;
    }

    console.log('ProtectedRoute - Usuario autenticado y con acceso, permitiendo acceso');
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
                        <AdminDashboard />
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
                        <EmpleadoDashboard />
                    </ProtectedRoute>
                } 
            />
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