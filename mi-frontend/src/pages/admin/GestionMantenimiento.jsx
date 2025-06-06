import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/gestionMantenimiento.css'; // Importar estilos
// TODO: Importar servicio de registros de mantenimiento y otros servicios (productos, usuarios)
import { getMaintenanceRecords } from '../../services/maintenanceService';
import { getProducts } from '../../services/productService';
import { getUsers } from '../../services/userService';

const GestionMantenimiento = () => {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRegistro, setSelectedRegistro] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
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

    // TODO: Estados para listas de selección (productos, usuarios)
    // const [productos, setProductos] = useState([]);
    // const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // TODO: Cargar registros de mantenimiento (y potencialmente productos/usuarios)
                // const registrosData = await getMaintenanceRecords();
                // setRegistros(Array.isArray(registrosData) ? registrosData : []);

                // TODO: Cargar productos y usuarios si se usarán en selectores
                // const productosData = await getProducts();
                // setProductos(Array.isArray(productosData) ? productosData : []);
                // const usuariosData = await getUsers();
                // setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);

                setLoading(false);
            } catch (err) {
                setError('Error al cargar datos');
                setLoading(false);
                console.error('Error al cargar registros de mantenimiento:', err);
            }
        };
        fetchData();
    }, []);

    const handleCreateRegistro = () => {
        setIsCreating(true);
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
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        // Manejar inputs numéricos para 'cost'
        const processedValue = type === 'number' ? parseFloat(value) : value;
        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Datos del formulario:', formData);
        // TODO: Llamada a la API para crear o actualizar registro
        setIsCreating(false);
        // TODO: Actualizar lista después de guardar
    };

    const handleCancel = () => {
        setIsCreating(false);
        setSelectedRegistro(null); // Limpiar registro seleccionado
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

    // TODO: Implementar handleEditRegistro y handleDeleteRegistro

    if (loading) {
        return <div>Cargando registros de mantenimiento...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>; 
    }

    return (
        <div className="gestion-mantenimiento-container">
            <button onClick={() => navigate('/admin/dashboard')} className="back-button">
                Volver al Dashboard
            </button>

            {!isCreating && (
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
                                            {/* TODO: Mostrar nombre de producto */}
                                            <td>{registro.product}</td>
                                            {/* TODO: Mostrar nombre de técnico */}
                                            <td>{registro.technician}</td>
                                            <td>{registro.status}</td>
                                            <td>{registro.start_date}</td>
                                            <td>{registro.completion_date}</td>
                                            <td>{registro.cost}</td>
                                            <td>
                                                <button 
                                                    onClick={() => setSelectedRegistro(registro)}
                                                    className="action-button"
                                                >
                                                    Ver Detalles
                                                </button>
                                                {/* TODO: Implementar botones de Editar y Eliminar */}
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

            {isCreating && (
                <div className="mantenimiento-form">
                    <h2>Crear Nuevo Registro de Mantenimiento</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Producto:</label>
                            <input
                                type="text"
                                name="product"
                                value={formData.product}
                                onChange={handleInputChange}
                                required
                            />
                            {/* TODO: Reemplazar con selector de productos */}
                        </div>

                        <div className="form-group">
                            <label>Técnico:</label>
                            <input
                                type="text"
                                name="technician"
                                value={formData.technician}
                                onChange={handleInputChange}
                                required
                            />
                             {/* TODO: Reemplazar con selector de usuarios (técnicos) */}
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

                        <div className="form-group">
                            <label>Fecha de Inicio:</label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Fecha de Finalización:</label>
                            <input
                                type="date"
                                name="completion_date"
                                value={formData.completion_date}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Costo:</label>
                            <input
                                type="number"
                                name="cost"
                                value={formData.cost}
                                onChange={handleInputChange}
                                step="0.01" // Para permitir decimales
                            />
                        </div>

                        <div className="form-group">
                            <label>Notas Adicionales:</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="save-button">
                                Guardar
                            </button>
                            <button type="button" onClick={handleCancel} className="cancel-button">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {selectedRegistro && (
                <div className="modal-overlay"> {/* Usando overlay para detalles */}
                    <div className="registro-details">
                        <h2>Detalles del Registro de Mantenimiento</h2>
                        <div className="details-content">
                            <p><strong>Producto:</strong> {selectedRegistro.product}</p>
                            <p><strong>Técnico:</strong> {selectedRegistro.technician}</p>
                            <p><strong>Estado:</strong> {selectedRegistro.status}</p>
                            <p><strong>Descripción:</strong> {selectedRegistro.description}</p>
                            <p><strong>Diagnóstico:</strong> {selectedRegistro.diagnosis}</p>
                            <p><strong>Solución:</strong> {selectedRegistro.solution}</p>
                            <p><strong>Fecha de Inicio:</strong> {selectedRegistro.start_date}</p>
                            <p><strong>Fecha de Finalización:</strong> {selectedRegistro.completion_date}</p>
                            <p><strong>Costo:</strong> {selectedRegistro.cost}</p>
                            <p><strong>Notas:</strong> {selectedRegistro.notes}</p>
                            {/* TODO: Add created_at and updated_at if needed in details */}
                        </div>
                        <button onClick={() => setSelectedRegistro(null)} className="close-button">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionMantenimiento; 