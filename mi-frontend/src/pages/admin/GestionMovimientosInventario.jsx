import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/gestionMovimientosInventario.css';
import { getInventoryMovements, createInventoryMovement, updateInventoryMovement, deleteInventoryMovement } from '../../services/inventoryMovementService';
import { getProducts } from '../../services/productService'; // Importar servicio de productos
import { getAllUsers } from '../../services/userService'; // Importar servicio de usuarios

const GestionMovimientosInventario = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [productos, setProductos] = useState([]); // Estado para productos
    const [usuarios, setUsuarios] = useState([]); // Estado para usuarios
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMovimiento, setSelectedMovimiento] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Estado para edición
    const navigate = useNavigate();

    // Estados para el formulario de creación/edición
    const [formData, setFormData] = useState({
        product: '',
        type: '',
        quantity: '',
        user: '',
        reference_number: '',
        status: '',
        note: '',
        date: '',
    });

    // Función para obtener el nombre del producto por ID
    const getProductName = (productId) => {
        if (!productId) return '--';
        const product = productos.find(p => p.id === productId);
        return product ? product.name : '--';
    };

    // Función para obtener el nombre de usuario por ID
    const getUserName = (userId) => {
        if (!userId) return '--';
        const user = usuarios.find(u => u.id === userId);
         // Usar first_name y last_name directamente si existen, o username
        return user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || '--' : '--';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null); // Limpiar errores anteriores
                console.log('Iniciando carga de datos para movimientos...');
                
                // Cargar movimientos, productos y usuarios en paralelo
                const [movimientosData, productosData, usuariosData] = await Promise.all([
                    getInventoryMovements(),
                    getProducts(), // Obtener productos
                    getAllUsers() // Obtener usuarios
                ]);
                
                console.log('Movimientos recibidos:', movimientosData);
                console.log('Productos recibidos:', productosData);
                console.log('Usuarios recibidos:', usuariosData);

                // Procesar respuestas (manejo de paginación si aplica)
                const movimientosArray = Array.isArray(movimientosData) ? movimientosData : 
                                       movimientosData.results ? movimientosData.results : [];
                                       
                const productosArray = Array.isArray(productosData) ? productosData : 
                                       productosData.results ? productosData.results : [];
                                       
                const usuariosArray = Array.isArray(usuariosData) ? usuariosData : 
                                       usuariosData.results ? usuariosData.results : [];

                console.log('Movimientos procesados:', movimientosArray);
                console.log('Productos procesados:', productosArray);
                console.log('Usuarios procesados (antes del filtro):', usuariosArray); // Log antes del filtro

                // Filtrar usuarios por rol 'empleado'
                const empleadosArray = usuariosArray.filter(usuario => {
                    console.log('Filtrando usuario:', usuario);
                    console.log('Usuario role:', usuario.role); // Log directo del role
                     // Condición corregida: verificar que usuario.role exista y sea 'empleado'
                    return usuario.role && usuario.role === 'empleado';
                });

                console.log('Usuarios procesados (después del filtro - empleados):', empleadosArray); // Log después del filtro

                setMovimientos(movimientosArray);
                setProductos(productosArray); // Guardar productos en estado
                setUsuarios(empleadosArray); // Guardar SOLO empleados en estado

                setLoading(false);
            } catch (err) {
                console.error('Error al cargar datos:', err);
                setError(err.message || 'Error al cargar datos de movimientos');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateMovimiento = () => {
        setIsCreating(true);
        setIsEditing(false); // Asegurarse de no estar en modo edición
        setSelectedMovimiento(null);
        setFormData({ 
            product: '',
            type: '',
            quantity: '',
            user: '',
            reference_number: '',
            status: '',
            note: '',
            date: '',
        });
    };

     const handleEditMovimiento = (movimiento) => {
        setIsEditing(true);
        setIsCreating(false);
        setSelectedMovimiento(movimiento);
        // Formatear la fecha al formato YYYY-MM-DD para el input type='date'
        const formattedDate = movimiento.date ? new Date(movimiento.date).toISOString().split('T')[0] : '';
        setFormData({
            product: movimiento.product || '',
            type: movimiento.type || '',
            quantity: movimiento.quantity || '',
            user: movimiento.user || '',
            reference_number: movimiento.reference_number || '',
            status: movimiento.status || '',
            note: movimiento.note || '',
            date: formattedDate,
        });
    };

    const handleDeleteMovimiento = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este movimiento?')) {
            try {
                setError(null); // Limpiar errores anteriores
                console.log(`Eliminando movimiento con ID: ${id}`);
                await deleteInventoryMovement(id);
                console.log(`Movimiento ${id} eliminado con éxito.`);
                
                // Recargar la lista de movimientos después de eliminar
                const movimientosActualizados = await getInventoryMovements();
                 const movimientosArray = Array.isArray(movimientosActualizados) ? movimientosActualizados : 
                                          movimientosActualizados.results ? movimientosActualizados.results : [];
                setMovimientos(movimientosArray);
                
                // Limpiar selección si el movimiento eliminado era el seleccionado
                if (selectedMovimiento && selectedMovimiento.id === id) {
                    setSelectedMovimiento(null);
                }

            } catch (error) {
                console.error('Error al eliminar movimiento:', error);
                setError(error.message || 'Error al eliminar el movimiento');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

     const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null); // Limpiar errores anteriores
             // Validar campos requeridos si es necesario
             if (!formData.product || !formData.type || !formData.quantity || !formData.user || !formData.status || !formData.date) {
                 setError('Por favor, complete todos los campos obligatorios (Producto, Tipo, Cantidad, Usuario, Estado, Fecha).');
                 return;
             }

            console.log('Datos del formulario a guardar:', formData);
            
            if (isEditing && selectedMovimiento) { // Modo edición
                await updateInventoryMovement(selectedMovimiento.id, formData);
            } else { // Modo creación
                await createInventoryMovement(formData);
            }

            // Recargar la lista de movimientos después de guardar
            const movimientosActualizados = await getInventoryMovements();
            const movimientosArray = Array.isArray(movimientosActualizados) ? movimientosActualizados : 
                                     movimientosActualizados.results ? movimientosActualizados.results : [];
            setMovimientos(movimientosArray);

            // Limpiar formulario y estados
            setIsCreating(false);
            setIsEditing(false);
            setSelectedMovimiento(null); 
            setFormData({
                product: '',
                type: '',
                quantity: '',
                user: '',
                reference_number: '',
                status: '',
                note: '',
                date: '',
            });
        } catch (error) {
            console.error('Error al guardar movimiento:', error);
            setError(error.message || 'Error al guardar el movimiento');
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setIsEditing(false);
        setSelectedMovimiento(null); // Clear selected movement
        setFormData({
            product: '',
            type: '',
            quantity: '',
            user: '',
            reference_number: '',
            status: '',
            note: '',
            date: '',
        });
    };

    if (loading) {
        return <div className="loading">Cargando movimientos...</div>;
    }

    return (
        <div className="gestion-movimientos-container">
            <button onClick={() => navigate('/admin/dashboard')} className="back-button">
                Volver al Dashboard
            </button>

            {error && <div className="error-message">{error}</div>}

            {!isCreating && !isEditing && (
                <>
                    <h1>Gestión de Movimientos de Inventario</h1>

                    <button onClick={handleCreateMovimiento} className="create-button">
                        Crear Nuevo Movimiento
                    </button>

                    <div className="movimientos-list">
                        <h2>Lista de Movimientos</h2>
                        {/* TODO: Implement loading and error handling for the list */}
                        {Array.isArray(movimientos) && movimientos.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Tipo</th>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Usuario</th>
                                        <th>Número de Referencia</th>
                                        <th>Estado</th>
                                        <th>Fecha de Creación</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movimientos.map(movimiento => (
                                        <tr key={movimiento.id}>
                                            <td>{movimiento.date}</td>
                                            <td>{movimiento.type}</td>
                                            {/* TODO: Display product name instead of ID */}
                                            <td>{getProductName(movimiento.product)}</td>
                                            <td>{movimiento.quantity}</td>
                                            {/* TODO: Display username instead of ID */}
                                            <td>{getUserName(movimiento.user)}</td>
                                            <td>{movimiento.reference_number || '--'}</td>
                                            <td>{movimiento.status}</td>
                                            <td>{movimiento.created_at}</td>
                                            <td>
                                                <button 
                                                    onClick={() => setSelectedMovimiento(movimiento)}
                                                    className="action-button"
                                                >
                                                    Ver Detalles
                                                </button>
                                                {/* TODO: Implement Edit and Delete buttons */}
                                                <button 
                                                    onClick={() => handleEditMovimiento(movimiento)}
                                                    className="action-button edit"
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteMovimiento(movimiento.id)}
                                                    className="action-button delete"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No hay movimientos registrados.</p>
                        )}
                    </div>
                </>
            )}

            {(isCreating || isEditing) && (
                <div className="movimiento-form">
                    <h2>{isEditing ? 'Editar Movimiento' : 'Crear Nuevo Movimiento'}</h2>
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
                            <label>Tipo de Movimiento:</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un tipo</option>
                                <option value="entrada">Entrada</option>
                                <option value="salida">Salida</option>
                                <option value="ajuste">Ajuste</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Cantidad:</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Usuario:</label>
                            <select
                                name="user"
                                value={formData.user}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un usuario</option>
                                {Array.isArray(usuarios) && usuarios.map(usuario => (
                                     <option key={usuario.id} value={usuario.id}>
                                        {`${usuario.first_name || ''} ${usuario.last_name || ''}`.trim() || usuario.username}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Número de Referencia:</label>
                            <input
                                type="text"
                                name="reference_number"
                                value={formData.reference_number}
                                onChange={handleInputChange}
                            />
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
                                <option value="completed">Completado</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Notas:</label>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                             <label>Fecha:</label>
                             <input
                                 type="date"
                                 name="date"
                                 value={formData.date}
                                 onChange={handleInputChange}
                                 required
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

            {selectedMovimiento && !isCreating && !isEditing && (
                <div className="movimiento-details proveedor-details"> {/* Usar la misma clase de estilo */}
                    <h2>Detalles del Movimiento</h2>
                    <div className="details-content">
                        <p><strong>ID:</strong> {selectedMovimiento.id}</p>
                        <p><strong>Fecha:</strong> {selectedMovimiento.date}</p>
                        <p><strong>Tipo:</strong> {selectedMovimiento.type}</p>
                        <p><strong>Producto:</strong> {getProductName(selectedMovimiento.product)}</p>
                        <p><strong>Cantidad:</strong> {selectedMovimiento.quantity}</p>
                        <p><strong>Usuario:</strong> {getUserName(selectedMovimiento.user)}</p>
                        <p><strong>Número de Referencia:</strong> {selectedMovimiento.reference_number || '--'}</p>
                        <p><strong>Estado:</strong> {selectedMovimiento.status}</p>
                        <p><strong>Notas:</strong> {selectedMovimiento.note || '--'}</p>
                        <p><strong>Fecha de Creación:</strong> {selectedMovimiento.created_at}</p>
                        <p><strong>Fecha de Actualización:</strong> {selectedMovimiento.updated_at}</p>
                    </div>
                    <button onClick={() => setSelectedMovimiento(null)} className="close-button">
                        Cerrar
                    </button>
                </div>
            )}
        </div>
    );
};

export default GestionMovimientosInventario; 