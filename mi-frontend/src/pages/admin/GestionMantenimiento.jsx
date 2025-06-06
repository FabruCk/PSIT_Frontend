import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/gestionMantenimiento.css'; // Importar estilos
// TODO: Importar servicio de registros de mantenimiento y otros servicios (productos, usuarios)
// Importar el servicio de mantenimiento por defecto y la funcion nombrada
import { 
    getMaintenanceRecords, 
    createMaintenance, 
    updateMaintenance, 
    deleteMaintenance 
} from '../../services/maintenanceService';
import { getProducts } from '../../services/productService'; // Importar servicio de productos
import { getAllUsers } from '../../services/userService'; // Importar servicio de usuarios

const GestionMantenimiento = () => {
    const [registros, setRegistros] = useState([]);
    const [productos, setProductos] = useState([]); // Estado para productos
    const [usuarios, setUsuarios] = useState([]); // Estado para usuarios
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRegistro, setSelectedRegistro] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Estado para edición
    const navigate = useNavigate();

    // Estados para el formulario de creación/edición
    const [formData, setFormData] = useState({
        product: '',
        technician: '',
        status: '',
        description: '',
        diagnosis: '',
        solution: '',
        start_date: '',
        completion_date: '',
        cost: '',
        notes: '',
    });

    // Función para obtener el nombre del producto por ID
    const getProductName = (productId) => {
        if (!productId) return '--';
        const product = productos.find(p => p.id === productId);
        return product ? product.name : '--'; // Asumiendo que product object has 'name'
    };

    // Función para obtener el nombre de usuario por ID (técnico)
    const getUserName = (userId) => {
        if (!userId) return '--';
        const user = usuarios.find(u => u.id === userId);
         // Usando direct properties based on previous user object structure logs
        return user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || '--' : '--';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Iniciando carga de datos para mantenimiento...');

                // Cargar registros de mantenimiento, productos y usuarios en paralelo
                const [registrosData, productosData, usuariosData] = await Promise.all([
                    getMaintenanceRecords(),
                    getProducts(),
                    getAllUsers()
                ]);
                
                console.log('Registros de mantenimiento recibidos:', registrosData);
                console.log('Productos recibidos (para selector): ', productosData);
                console.log('Usuarios recibidos (para selector): ', usuariosData);

                // Procesar respuestas (manejo de paginación si aplica)
                const registrosArray = Array.isArray(registrosData) ? registrosData : 
                                       registrosData.results ? registrosData.results : [];
                                       
                const productosArray = Array.isArray(productosData) ? productosData : 
                                       productosData.results ? productosData.results : [];
                                       
                const usuariosArray = Array.isArray(usuariosData) ? usuariosData : 
                                       usuariosData.results ? usuariosData.results : [];

                // Filtrar usuarios para mostrar solo técnicos
                const tecnicosArray = usuariosArray.filter(usuario => usuario.role === 'tecnico');
                console.log('Técnicos filtrados:', tecnicosArray);

                setRegistros(registrosArray);
                setProductos(productosArray);
                setUsuarios(tecnicosArray); // Guardar solo los técnicos en el estado

                setLoading(false);
            } catch (err) {
                console.error('Error al cargar datos para mantenimiento:', err);
                setError(err.message || 'Error al cargar datos de mantenimiento');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateRegistro = () => {
        setIsCreating(true);
        setIsEditing(false);
        setSelectedRegistro(null);
        // Establecer la fecha de inicio como la fecha actual
        const today = new Date().toISOString().split('T')[0];
        setFormData({ 
            product: '',
            technician: '',
            status: 'pending', // Estado inicial pendiente
            description: '',
            diagnosis: '',
            solution: '',
            start_date: today, // Fecha de inicio automática
            completion_date: '', // Fecha de fin vacía inicialmente
            cost: '',
            notes: '',
        });
    };

    const handleEditRegistro = (registro) => {
        setIsEditing(true);
        setIsCreating(false);
        setSelectedRegistro(registro);
        // Formatear fechas al formato YYYY-MM-DD para inputs type='date'
        const formattedStartDate = registro.start_date ? new Date(registro.start_date).toISOString().split('T')[0] : '';
        const formattedCompletionDate = registro.completion_date ? new Date(registro.completion_date).toISOString().split('T')[0] : '';

        setFormData({
            product: registro.product || '',
            technician: registro.technician || '',
            status: registro.status || '',
            description: registro.description || '',
            diagnosis: registro.diagnosis || '',
            solution: registro.solution || '',
            start_date: formattedStartDate,
            completion_date: formattedCompletionDate,
            cost: registro.cost !== undefined ? registro.cost : '',
            notes: registro.notes || '',
        });
    };

    const handleDeleteRegistro = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este registro de mantenimiento?')) {
            try {
                setError(null);
                console.log(`Eliminando registro de mantenimiento con ID: ${id}`);
                await deleteMaintenance(id);
                console.log(`Registro de mantenimiento ${id} eliminado con éxito.`);
                
                // Recargar la lista después de eliminar
                const registrosActualizados = await getMaintenanceRecords();
                const registrosArray = Array.isArray(registrosActualizados) ? registrosActualizados : 
                                         registrosActualizados.results ? registrosActualizados.results : [];
                setRegistros(registrosArray);
                
                // Limpiar selección si el registro eliminado era el seleccionado
                if (selectedRegistro && selectedRegistro.id === id) {
                    setSelectedRegistro(null);
                }
            } catch (error) {
                console.error('Error al eliminar registro de mantenimiento:', error);
                setError(error.message || 'Error al eliminar el registro de mantenimiento');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        // Manejar inputs numéricos para 'cost' y otros que pudieran serlo
        const processedValue = type === 'number' ? parseFloat(value) : value;
        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            if (!formData.product || !formData.technician || !formData.status || !formData.start_date) {
                setError('Por favor, complete los campos obligatorios (Producto, Técnico, Estado, Fecha Inicio).');
                return;
            }

            console.log('Datos del formulario a guardar:', formData);
            
            if (isEditing && selectedRegistro) {
                await updateMaintenance(selectedRegistro.id, formData);
            } else {
                await createMaintenance(formData);
            }

            // Recargar la lista después de guardar
            const registrosActualizados = await getMaintenanceRecords();
            const registrosArray = Array.isArray(registrosActualizados) ? registrosActualizados : 
                                     registrosActualizados.results ? registrosActualizados.results : [];
            setRegistros(registrosArray);

            // Limpiar formulario y estados
            setIsCreating(false);
            setIsEditing(false);
            setSelectedRegistro(null);
            setFormData({ 
                product: '',
                technician: '',
                status: '',
                description: '',
                diagnosis: '',
                solution: '',
                start_date: '',
                completion_date: '',
                cost: '',
                notes: '',
            });
        } catch (error) {
            console.error('Error al guardar registro de mantenimiento:', error);
            setError(error.message || 'Error al guardar el registro de mantenimiento');
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setIsEditing(false);
        setSelectedRegistro(null); // Clear selected movement
        setFormData({ 
            product: '',
            technician: '',
            status: '',
            description: '',
            diagnosis: '',
            solution: '',
            start_date: '',
            completion_date: '',
            cost: '',
            notes: '',
        });
    };

    const handleCompleteMaintenance = async (id) => {
        if (window.confirm('¿Está seguro de que desea marcar este mantenimiento como completado?')) {
            try {
                setError(null);
                console.log(`Completando mantenimiento con ID: ${id}`);
                
                // Obtener la fecha actual en formato YYYY-MM-DD
                const today = new Date().toISOString().split('T')[0];
                
                // Actualizar el estado del mantenimiento a 'completed' y establecer la fecha de fin
                await updateMaintenance(id, { 
                    status: 'completed',
                    completion_date: today
                });
                console.log(`Mantenimiento ${id} completado con éxito.`);
                
                // Recargar la lista después de completar
                const registrosActualizados = await getMaintenanceRecords();
                const registrosArray = Array.isArray(registrosActualizados) ? registrosActualizados : 
                                     registrosActualizados.results ? registrosActualizados.results : [];
                setRegistros(registrosArray);
                
                // Limpiar selección si el registro completado era el seleccionado
                if (selectedRegistro && selectedRegistro.id === id) {
                    setSelectedRegistro(null);
                }
            } catch (error) {
                console.error('Error al completar mantenimiento:', error);
                setError(error.message || 'Error al completar el mantenimiento');
            }
        }
    };

    if (loading) {
        return <div className="loading">Cargando registros de mantenimiento...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>; 
    }

    return (
        <div className="gestion-mantenimiento-container">
            <button onClick={() => navigate('/admin/dashboard')} className="back-button">
                Volver al Dashboard
            </button>

            {error && <div className="error-message">{error}</div>}

            {!isCreating && !isEditing && (
                <>
                    <h1>Gestión de Registros de Mantenimiento</h1>

                    <button onClick={handleCreateRegistro} className="create-button">
                        Crear Nuevo Registro
                    </button>

                    <div className="registros-list">
                        <h2>Lista de Registros de Mantenimiento</h2>
                        {/* TODO: Implementar manejo de carga y error para la lista */}
                        {Array.isArray(registros) && registros.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Técnico</th>
                                        <th>Estado</th>
                                        <th>Fecha Inicio</th>
                                        <th>Fecha Fin</th>
                                        <th>Costo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registros.map(registro => (
                                        <tr key={registro.id}>
                                            {/* Mostrar nombre de producto usando helper */}
                                            <td>{getProductName(registro.product)}</td>
                                            {/* Mostrar nombre de técnico usando helper */}
                                            <td>{getUserName(registro.technician)}</td>
                                            <td>{registro.status || '--'}</td>
                                            <td>{registro.start_date || '--'}</td>
                                            <td>{registro.completion_date || '--'}</td>
                                            <td>{(registro.cost !== undefined && registro.cost !== null) ? registro.cost : '--'}</td>
                                            <td>
                                                <button 
                                                    onClick={() => setSelectedRegistro(registro)}
                                                    className="action-button"
                                                >
                                                    Ver Detalles
                                                </button>
                                                {/* Implementar botones de Editar y Eliminar */}
                                                <button 
                                                    onClick={() => handleEditRegistro(registro)}
                                                    className="action-button edit"
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteRegistro(registro.id)}
                                                    className="action-button delete"
                                                >
                                                    Eliminar
                                                </button>
                                                {registro.status !== 'completed' && (
                                                    <button 
                                                        onClick={() => handleCompleteMaintenance(registro.id)}
                                                        className="action-button complete"
                                                    >
                                                        Completar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No hay registros de mantenimiento registrados.</p>
                        )}
                    </div>
                </>
            )}

            {(isCreating || isEditing) && (
                <div className="mantenimiento-form">
                    <h2>{isEditing ? 'Editar Registro de Mantenimiento' : 'Crear Nuevo Registro de Mantenimiento'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Producto:</label>
                            <select
                                name="product"
                                value={formData.product}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un producto</option>
                                {Array.isArray(productos) && productos.map(producto => (
                                    <option key={producto.id} value={producto.id}>
                                        {producto.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Técnico:</label>
                            <select
                                name="technician"
                                value={formData.technician}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un técnico</option>
                                {Array.isArray(usuarios) && usuarios.map(usuario => (
                                    <option key={usuario.id} value={usuario.id}>
                                        {`${usuario.first_name || ''} ${usuario.last_name || ''}`.trim() || usuario.username}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Estado:</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un estado</option>
                                <option value="pending">Pendiente</option>
                                <option value="in_progress">En Progreso</option>
                                <option value="completed">Completado</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Descripción:</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Diagnóstico:</label>
                            <textarea
                                name="diagnosis"
                                value={formData.diagnosis}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Solución:</label>
                            <textarea
                                name="solution"
                                value={formData.solution}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Solo mostrar campos de fecha en modo edición */}
                        {isEditing && (
                            <>
                                <div className="form-group">
                                    <label>Fecha Inicio:</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fecha Fin:</label>
                                    <input
                                        type="date"
                                        name="completion_date"
                                        value={formData.completion_date}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label>Costo:</label>
                            <input
                                type="number"
                                name="cost"
                                value={formData.cost}
                                onChange={handleInputChange}
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label>Notas:</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="save-button">
                                {isEditing ? 'Actualizar' : 'Guardar'}
                            </button>
                            <button type="button" onClick={handleCancel} className="cancel-button">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {selectedRegistro && !isCreating && !isEditing && (
                <div className="mantenimiento-details proveedor-details"> {/* Reutilizar estilos */}
                    <h2>Detalles del Registro de Mantenimiento</h2>
                    <div className="details-content">
                         <p><strong>ID:</strong> {selectedRegistro.id}</p>
                         <p><strong>Producto:</strong> {getProductName(selectedRegistro.product)}</p>
                         <p><strong>Técnico:</strong> {getUserName(selectedRegistro.technician)}</p>
                         <p><strong>Estado:</strong> {selectedRegistro.status || '--'}</p>
                         <p><strong>Descripción:</strong> {selectedRegistro.description || '--'}</p>
                         <p><strong>Diagnóstico:</strong> {selectedRegistro.diagnosis || '--'}</p>
                         <p><strong>Solución:</strong> {selectedRegistro.solution || '--'}</p>
                         <p><strong>Fecha Inicio:</strong> {selectedRegistro.start_date || '--'}</p>
                         <p><strong>Fecha Fin:</strong> {selectedRegistro.completion_date || '--'}</p>
                         <p><strong>Costo:</strong> {(selectedRegistro.cost !== undefined && selectedRegistro.cost !== null) ? selectedRegistro.cost : '--'}</p>
                         <p><strong>Notas:</strong> {selectedRegistro.notes || '--'}</p>
                         <p><strong>Fecha Creación:</strong> {selectedRegistro.created_at || '--'}</p>
                         <p><strong>Fecha Actualización:</strong> {selectedRegistro.updated_at || '--'}</p>
                    </div>
                    <button onClick={() => setSelectedRegistro(null)} className="close-button">
                        Cerrar
                    </button>
                </div>
            )}
        </div>
    );
};

export default GestionMantenimiento; 