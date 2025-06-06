import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getAllUsers, updateUser, deleteUser, createUser } from '../../services/userService';
import '../../styles/admin/gestionUsuarios.css'; 

const roleDisplayNames = {
    admin: 'Administrador',
    supervisor: 'Supervisor',
    tecnico: 'Técnico',
    empleado: 'Empleado',
};

const getRoleDisplayName = (role) => {
    return roleDisplayNames[role] || role || 'No especificado';
};

const GestionUsuarios = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false); 
    const [editFormData, setEditFormData] = useState(null); 
    const [isCreating, setIsCreating] = useState(false); 
    const [createFormData, setCreateFormData] = useState({
        username: '',
        email: '',
        password: '',
        profile: { 
            first_name: '',
            last_name: '',
            role: '',
            department: '',
            phone: '', 
        },
    });

    // Definición de fetchUsers fuera del useEffect
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            if (data && Array.isArray(data.results)) {
                 setUsers(data.results); // <-- Modificación aquí
            } else {
                setError('Formato de datos inesperado de la API.');
                console.error('GestionUsuarios - Datos de API inesperados:', data);
                setUsers([]); 
            }
           
            console.log('GestionUsuarios - Usuarios cargados:', data);
        } catch (err) {
            setError('Error al cargar los usuarios.');
            console.error('GestionUsuarios - Error cargando usuarios:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []); 

    // Efecto para actualizar el título de la página
    useEffect(() => {
        if (selectedUser) {
            // Si hay un usuario seleccionado, mostrar su nombre en el título
            document.title = `Detalles de ${selectedUser.username} - Gestionar Usuarios`;
            console.log('useEffect GestionUsuarios - Título establecido:', document.title);
        } else {
            // Si no hay usuario seleccionado, mostrar el título general de la página
            document.title = 'Gestionar Usuarios - FluVent'; // Puedes ajustar el título base
            console.log('useEffect GestionUsuarios - Título establecido:', document.title);
        }
    }, [selectedUser]); // Ejecutar este efecto cuando selectedUser cambie

    // Manejador de click para seleccionar un usuario
    const handleSelectUser = (user) => {
        // Normalizar la estructura del usuario para asegurar consistencia en el profile
        const normalizedProfile = user.profile ? {
            first_name: user.profile.first_name || user.first_name || '',
            last_name: user.profile.last_name || user.last_name || '',
            role: user.profile.role || user.role || '',
            department: user.profile.department || user.department || '',
            phone: user.profile.phone || user.phone || '', // Incluir phone en la normalización
            // ... otros campos del perfil que espere el backend
        } : {
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            role: user.role || '',
            department: user.department || '',
            phone: user.phone || '', // Incluir phone en la normalización
        };
        const normalizedUser = { ...user, profile: normalizedProfile };
        
        setSelectedUser(normalizedUser);
        setIsEditing(false); // Salir de modo edición
        setEditFormData(null); // Limpiar datos de edición
        setIsCreating(false); // Salir de modo creación
        setCreateFormData({ // Limpiar y resetear datos de creación a la estructura anidada
             username: '',
             email: '',
             password: '',
             profile: { 
                first_name: '',
                last_name: '',
                role: '',
                department: '',
             }
        });
        console.log('Usuario seleccionado:', user);
    };

    // Manejador de click para iniciar la edición
    const handleEditUser = () => {
        setIsEditing(true); // Entramos en modo edición
        // Normalizar la estructura para el formulario de edición (similar a select)
        const normalizedProfile = selectedUser.profile ? {
            first_name: selectedUser.profile.first_name || selectedUser.first_name || '',
            last_name: selectedUser.profile.last_name || selectedUser.last_name || '',
            role: selectedUser.profile.role || selectedUser.role || '',
            department: selectedUser.profile.department || selectedUser.department || '',
            phone: selectedUser.profile.phone || selectedUser.phone || '', // Incluir phone en la normalización para edición
            ...selectedUser.profile
        } : {
             first_name: selectedUser.first_name || '',
             last_name: selectedUser.last_name || '',
             role: selectedUser.role || '',
             department: selectedUser.department || '',
             phone: selectedUser.phone || '', // Incluir phone en la normalización para edición
        };
         const editData = { ...selectedUser, profile: normalizedProfile };
        setEditFormData(editData); // Copiamos los datos del usuario seleccionado al formulario de edición (usando los datos normalizados)
        console.log('Preparando edición para usuario:', selectedUser);
    };

    // Manejador para cambios en los campos del formulario de edición
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    // Manejador para guardar los cambios
    const handleSaveEdit = async () => { // Cambiado a async
        console.log('Guardando cambios para usuario:', editFormData);
        try {
            // Asegurarse de que hay un usuario seleccionado y datos para guardar
            if (!selectedUser || !editFormData) {
                console.warn('GestionUsuarios - No hay usuario seleccionado o datos para guardar.');
                return;
            }

            // Llamar a la función de servicio para actualizar el usuario
            const updatedUser = await updateUser(selectedUser.id, editFormData);
            console.log('Usuario actualizado en backend:', updatedUser);

            // Actualizar la lista de usuarios en el frontend
            setUsers(users.map(user => 
                user.id === updatedUser.id ? updatedUser : user
            ));

            setSelectedUser(null); // Deseleccionar usuario
            setIsEditing(false); // Salimos del modo edición
            setEditFormData(null); // Limpiamos los datos del formulario de edición

            // Opcional: Mostrar un mensaje de éxito al usuario
            alert('Usuario actualizado con éxito!');

        } catch (err) {
            console.error('GestionUsuarios - Error al guardar cambios:', err);
            // Opcional: Mostrar un mensaje de error al usuario
            setError('Error al guardar cambios.');
        }
    };

    // Manejador para cancelar la edición
    const handleCancelEdit = () => {
        setIsEditing(false); // Salimos del modo edición
        setEditFormData(null); // Limpiamos los datos del formulario de edición
        console.log('Edición cancelada.');
    };

    // Manejador de click para iniciar la creación de usuario
    const handleCreateNewUser = () => {
        setSelectedUser(null); // Deseleccionar cualquier usuario
        setIsEditing(false); // Salir de modo edición
        setEditFormData(null); // Limpiar datos de edición
        setIsCreating(true); // Entrar en modo creación
         setCreateFormData({ // Limpiar y resetear datos del formulario de creación a la estructura anidada
            username: '',
            email: '',
            password: '',
             profile: { 
                first_name: '',
                last_name: '',
                role: '',
                department: '',
             }
         });
        console.log('Iniciando creación de nuevo usuario.');
    };

    // Manejador para cambios en los campos del formulario de creación (maneja anidación)
     const handleCreateInputChange = (e) => {
        const { name, value } = e.target;
        
        // Si el nombre del input está en los campos directos del usuario
        if (['username', 'email', 'password'].includes(name)) {
            setCreateFormData({ ...createFormData, [name]: value });
        } 
        // Si el nombre del input corresponde a un campo del perfil
        else if (['first_name', 'last_name', 'role', 'department'].includes(name)) {
            setCreateFormData({
                ...createFormData,
                profile: { // Actualizamos el objeto profile
                    ...createFormData.profile,
                    [name]: value, // Actualizamos el campo correcto dentro de profile
                },
            });
        }
         // Manejar otros campos si los añades
    };

    // Manejador para guardar el nuevo usuario
    const handleSaveNewUser = async () => {
        console.log('Guardando nuevo usuario:', createFormData);
        
        // **TODO: Validar createFormData antes de enviar (considerando la anidación)**

        // Construir el objeto de datos a enviar al backend con la estructura que funciona en Postman
        const dataToSend = {
            username: createFormData.username,
            email: createFormData.email,
            password: createFormData.password,
            first_name: createFormData.profile.first_name, // Mantener a nivel superior según Postman
            last_name: createFormData.profile.last_name,   // Mantener a nivel superior según Postman
            profile: { // Objeto profile anidado
                role: createFormData.profile.role,           // Dentro de profile
                department: createFormData.profile.department, // Dentro de profile
                phone: createFormData.profile.phone,
                // Si tienes el campo 'phone' en tu formulario/estado, inclúyelo aquí:
                // phone: createFormData.profile.phone,
                // Incluir otros campos de profile si los hay
            }
        };

        try {
             // Llamar a la función de servicio para crear el usuario con la estructura anidada
             const newUser = await createUser(dataToSend);
             console.log('Usuario creado en backend:', newUser);

             // Actualizar la lista de usuarios en el frontend
             fetchUsers(); // <-- Llama a fetchUsers para refrescar la lista

             setIsCreating(false); // Salir del modo creación
             setCreateFormData({ // Limpiar formulario a la estructura anidada
                username: '',
                email: '',
                password: '',
                 profile: { 
                    first_name: '',
                    last_name: '',
                    role: '',
                    department: '',
                 }
             });

             // Opcional: Mostrar un mensaje de éxito al usuario
             alert('Usuario creado con éxito!');

        } catch (err) {
            console.error('GestionUsuarios - Error al crear usuario:', err);
            // Opcional: Mostrar un mensaje de error al usuario (usar los mensajes de err.response.data si están disponibles)
             setError(`Error al crear el usuario: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
        }
    };

     // Manejador para cancelar la creación
     const handleCancelCreate = () => {
        setIsCreating(false); // Salir del modo creación
         setCreateFormData({ // Limpiar formulario a la estructura anidada
            username: '',
            email: '',
            password: '',
             profile: { 
                first_name: '',
                last_name: '',
                role: '',
                department: '',
             }
         });
        console.log('Creación cancelada.');
     };

    // Manejador para eliminar
    const handleDeleteUser = async () => {
        console.log('Eliminar usuario:', selectedUser);
        
        // Asegurarse de que hay un usuario seleccionado
        if (!selectedUser) {
            console.warn('GestionUsuarios - No hay usuario seleccionado para eliminar.');
            return;
        }

        // Mostrar confirmación al usuario
        const isConfirmed = window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${selectedUser.username}?`);

        if (isConfirmed) {
            try {
                // Llamar a la función de servicio para eliminar el usuario
                await deleteUser(selectedUser.id);
                console.log('Usuario eliminado en backend:', selectedUser.username);

                // Actualizar la lista de usuarios en el frontend
                setUsers(users.filter(user => user.id !== selectedUser.id));

                setSelectedUser(null); // Deseleccionar usuario
                setIsEditing(false); // Salimos del modo edición por si acaso
                setEditFormData(null); // Limpiamos datos de edición

                // Opcional: Mostrar un mensaje de éxito al usuario
                alert('Usuario eliminado con éxito!');

            } catch (err) {
                console.error('GestionUsuarios - Error al eliminar usuario:', err);
                // Opcional: Mostrar un mensaje de error al usuario
                 setError(`Error al eliminar al usuario ${selectedUser.username}.`);
            }
        }
    };

    if (loading) {
        return <div>Cargando usuarios...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className="gestion-usuarios-container">
            {/* Botón de Volver al Dashboard de Admin */}
            <button onClick={() => navigate('/admin/dashboard')} style={{ marginBottom: '20px' }}>
                Volver
            </button>

            <h1>Gestión de Usuarios</h1>
            {/* Botón para crear nuevo usuario */}
            <button onClick={handleCreateNewUser} style={{ marginBottom: '20px' }}>
                Crear Nuevo Usuario
            </button>

            {/* Mostrar lista de usuarios si no estamos creando o editando */}
            {!isCreating && !isEditing && users.length > 0 && (
                <div className="gestion-usuarios-card"> {/* Contenedor para la lista */}
                    <h2>Lista de Usuarios</h2> {/* Opcional: añadir un título para la lista */}
                    <ul>
                        {/* Filtramos los usuarios con is_staff: true antes de mapear */}
                        {users
                            .filter(user => !user.is_staff) // <-- Cambiado filtro a is_staff
                            .map(user => (
                            <li 
                                key={user.id} 
                                onClick={() => handleSelectUser(user)}
                                className={selectedUser?.id === user.id ? 'selected' : ''}
                                style={{ cursor: 'pointer' }}
                            >
                                {user.username} {user.email ? `(${user.email})` : ''} - Rol: {getRoleDisplayName(user.role)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Mensaje si no hay usuarios y no estamos creando */}
             {!isCreating && !isEditing && users.length === 0 && <p>No hay usuarios disponibles.</p>}

            {/* Mostrar formulario de creación si isCreating es true */}
            {isCreating && ( // <-- Nueva sección para formulario de creación
                <div className="gestion-usuarios-card">
                    <h2>Crear Nuevo Usuario</h2>
                     <div>
                        <label>Username:</label>
                        <input 
                            type="text" 
                            name="username" 
                            value={createFormData.username} 
                            onChange={handleCreateInputChange} 
                        />
                    </div>
                     <div>
                        <label>Email:</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={createFormData.email} 
                            onChange={handleCreateInputChange} 
                        />
                    </div>
                     <div>
                        <label>First Name:</label>
                        <input 
                            type="text" 
                            name="first_name" 
                            value={createFormData.profile.first_name} 
                            onChange={handleCreateInputChange} 
                        />
                    </div>
                      <div>
                        <label>Last Name:</label>
                        <input 
                            type="text" 
                            name="last_name" 
                            value={createFormData.profile.last_name} 
                            onChange={handleCreateInputChange} 
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={createFormData.password} 
                            onChange={handleCreateInputChange} 
                        />
                    </div>
                    <div>
                        <label>Rol:</label>
                         <select name="role" value={createFormData.profile.role} onChange={handleCreateInputChange}>
                                     <option value="">Seleccione un rol</option>
                                    {Object.keys(roleDisplayNames).map(roleKey => (
                                        <option key={roleKey} value={roleKey}>
                                            {roleDisplayNames[roleKey]}
                                        </option>
                                    ))}
                         </select>
                    </div>
                      <div>
                        <label>Department:</label>
                        <input 
                            type="text" 
                            name="department" 
                            value={createFormData.profile.department} 
                            onChange={handleCreateInputChange} 
                        />
                    </div>
                    <div>
                        <label>Phone:</label>
                        <input 
                            type="text" 
                            name="phone" 
                            value={createFormData.profile.phone} 
                            onChange={handleCreateInputChange} 
                        />
                    </div>
                     {/* Añade más campos necesarios para la creación */}

                     <div style={{ marginTop: '15px' }}>
                         <button onClick={handleSaveNewUser} style={{ marginRight: '10px' }}>
                             Crear
                         </button>
                         <button onClick={handleCancelCreate}> {/* Añadido manejador para cancelar */}
                             Cancelar
                         </button>
                     </div>
                </div>
            )}

            {/* Mostrar detalles/formulario de edición si un usuario está seleccionado y no estamos creando */}
            {!isCreating && selectedUser && (
                <div className="gestion-usuarios-card">
                    {isEditing ? (
                        // **Modo Edición: Mostrar formulario**
                        <div>
                            <h2>Editar Usuario</h2>
                            <div>
                                <label>Username:</label>
                                <input 
                                    type="text" 
                                    name="username" 
                                    value={editFormData.username || ''} 
                                    onChange={handleEditInputChange} 
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={editFormData.email || ''} 
                                    onChange={handleEditInputChange} 
                                />
                            </div>
                            <div>
                                <label>First Name:</label>
                                <input 
                                    type="text" 
                                    name="first_name" 
                                    value={editFormData.profile.first_name || ''} 
                                    onChange={handleEditInputChange} 
                                />
                            </div>
                             <div>
                                <label>Last Name:</label>
                                <input 
                                    type="text" 
                                    name="last_name" 
                                    value={editFormData.profile.last_name || ''} 
                                    onChange={handleEditInputChange} 
                                />
                            </div>
                            <div>
                                <label>Rol:</label>
                                <select name="role" value={editFormData.profile.role || ''} onChange={handleEditInputChange}>
                                     <option value="">Seleccione un rol</option>
                                    {Object.keys(roleDisplayNames).map(roleKey => (
                                        <option key={roleKey} value={roleKey}>
                                            {roleDisplayNames[roleKey]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label>Department:</label>
                                <input 
                                    type="text" 
                                    name="department" 
                                    value={editFormData.profile.department || ''} 
                                    onChange={handleEditInputChange} 
                                />
                            </div>
                            <div>
                                <label>Phone:</label>
                                <input 
                                    type="text" 
                                    name="phone" 
                                    value={editFormData.profile.phone || ''} 
                                    onChange={handleEditInputChange} 
                                />
                            </div>
                            <div style={{ marginTop: '15px' }}>
                                <button onClick={handleSaveEdit} style={{ marginRight: '10px' }}>
                                    Guardar
                                </button>
                                <button onClick={handleCancelEdit}> {/* Añadido manejador para cancelar */}
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        // **Modo Ver Detalles: Mostrar información del usuario**
                        <div>
                            <h2>Detalles de {selectedUser.username}</h2>
                            <p><strong>Email:</strong> {selectedUser.email || 'No especificado'}</p>
                            <p><strong>Rol:</strong> {getRoleDisplayName(selectedUser.role)}</p>
                            <p><strong>First Name:</strong> {selectedUser.profile?.first_name || 'No especificado'}</p>
                            <p><strong>Last Name:</strong> {selectedUser.profile?.last_name || 'No especificado'}</p>
                            <p><strong>Department:</strong> {selectedUser.profile?.department || 'No especificado'}</p>
                            <p><strong>Phone:</strong> {selectedUser.profile?.phone || 'No especificado'}</p>
                            {/* Añade más detalles aquí */}
                            <div style={{ marginTop: '15px' }}>
                                <button onClick={handleEditUser} style={{ marginRight: '10px' }}>
                                    Editar
                                </button>
                                <button onClick={handleDeleteUser} style={{ backgroundColor: '#e74c3c', color: 'white' }}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GestionUsuarios; 