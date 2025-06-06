import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/gestionMovimientosInventario.css';
import { getInventoryMovements } from '../../services/inventoryMovementService'; // Assuming a service for movements
// TODO: Import services for Products and Users if needed for dropdowns

const GestionMovimientosInventario = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMovimiento, setSelectedMovimiento] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // TODO: Fetch inventory movements from backend
                // const movimientosData = await getInventoryMovements();
                // setMovimientos(Array.isArray(movimientosData) ? movimientosData : []);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar datos');
                setLoading(false);
                console.error('Error al cargar movimientos de inventario:', err);
            }
        };
        fetchData();
    }, []);

    const handleCreateMovimiento = () => {
        setIsCreating(true);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Aquí irá la lógica para guardar el movimiento con los nuevos campos
        console.log('Datos del formulario:', formData);
        // TODO: Add API call to create or update inventory movement
        setIsCreating(false);
        // TODO: Refresh movement list after saving
    };

    const handleCancel = () => {
        setIsCreating(false);
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

    // TODO: Implement handleEditMovimiento and handleDeleteMovimiento

    if (loading) {
        return <div>Cargando movimientos...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>; 
    }

    return (
        <div className="gestion-movimientos-container">
            <button onClick={() => navigate('/admin/dashboard')} className="back-button">
                Volver al Dashboard
            </button>

            {!isCreating && (
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
                                            <td>{movimiento.product}</td>
                                            <td>{movimiento.quantity}</td>
                                            {/* TODO: Display username instead of ID */}
                                            <td>{movimiento.user}</td>
                                            <td>{movimiento.reference_number}</td>
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

            {isCreating && (
                <div className="movimiento-form">
                    <h2>Crear Nuevo Movimiento</h2>
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
                            {/* TODO: Replace with a select/autocomplete for products */}
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
                            <input
                                type="text"
                                name="user"
                                value={formData.user}
                                onChange={handleInputChange}
                                required
                            />
                             {/* TODO: Replace with a select/autocomplete for users */}
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
                                Guardar
                            </button>
                            <button type="button" onClick={handleCancel} className="cancel-button">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {selectedMovimiento && (
                <div className="modal-overlay"> {/* Using modal overlay for details */}
                    <div className="movimiento-details">
                        <h2>Detalles del Movimiento</h2>
                        <div className="details-content">
                            <p><strong>Producto:</strong> {selectedMovimiento.product}</p>
                            <p><strong>Tipo:</strong> {selectedMovimiento.type}</p>
                            <p><strong>Cantidad:</strong> {selectedMovimiento.quantity}</p>
                            <p><strong>Usuario:</strong> {selectedMovimiento.user}</p>
                            <p><strong>Número de Referencia:</strong> {selectedMovimiento.reference_number}</p>
                            <p><strong>Estado:</strong> {selectedMovimiento.status}</p>
                            <p><strong>Notas:</strong> {selectedMovimiento.note}</p>
                            <p><strong>Fecha:</strong> {selectedMovimiento.date}</p>
                            <p><strong>Fecha de Creación:</strong> {selectedMovimiento.created_at}</p>
                            {/* TODO: Add updated_at if needed in details */}
                        </div>
                        <button onClick={() => setSelectedMovimiento(null)} className="close-button">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionMovimientosInventario; 