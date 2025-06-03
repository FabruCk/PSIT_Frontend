// Configuración de roles y rutas
const ROLES = {
    ADMIN: 'admin',
    EMPLEADO: 'empleado',
    SUPERVISOR: 'supervisor',
    TECNICO: 'tecnico'
};

// Rutas por defecto para cada rol
const DEFAULT_ROUTES = {
    [ROLES.ADMIN]: '/admin/dashboard',
    [ROLES.EMPLEADO]: '/empleado/dashboard',
    [ROLES.SUPERVISOR]: '/supervisor/dashboard',
    [ROLES.TECNICO]: '/tecnico/dashboard'
};

// Función para determinar el rol del usuario
const getUserRole = (user) => {
    if (!user) return null;
    
    // Si es staff (que actua como superusuario en este caso), asignar rol de admin
    if (user.is_staff) {
        return ROLES.ADMIN;
    }
    
    // Si tiene un rol específico, usarlo
    if (user.role) {
        return user.role;
    }
    
    // Por defecto, asignar rol de empleado
    return ROLES.EMPLEADO;
};

// Función para verificar si un usuario tiene un rol específico
const hasRole = (user, role) => {
    const userRole = getUserRole(user);
    return userRole === role;
};

// Función para verificar si un usuario tiene acceso a una ruta
const hasAccessToRoute = (user, route) => {
    const userRole = getUserRole(user);
    
    // Rutas públicas
    if (route === '/' || route === '/login') return true;
    
    // Rutas específicas por rol
    switch (userRole) {
        case ROLES.ADMIN:
            return true; // Los administradores tienen acceso a todo
        case ROLES.SUPERVISOR:
            return route.startsWith('/supervisor/') || route.startsWith('/empleado/');
        case ROLES.TECNICO:
            return route.startsWith('/tecnico/');
        case ROLES.EMPLEADO:
            return route.startsWith('/empleado/');
        default:
            return false;
    }
};

export {
    ROLES,
    DEFAULT_ROUTES,
    getUserRole,
    hasRole,
    hasAccessToRoute
}; 