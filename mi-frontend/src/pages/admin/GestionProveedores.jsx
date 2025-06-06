import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/gestionProveedores.css';
import { getSuppliers, createSupplier, deleteSupplier } from '../../services/supplierService';

const GestionProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProveedor, setSelectedProveedor] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    // Estados para el formulario de creación/edición
    const [formData, setFormData] = useState({
        name: '',
        contact_email: '',
        phone: '',
        address: '',
        tax_id: '',
        website: '',
        is_active: true,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Iniciando carga de proveedores...');
                const proveedoresData = await getSuppliers();
                console.log('Proveedores recibidos en el componente:', proveedoresData);

                // Verificar si la respuesta es un array o un objeto con una propiedad results
                const proveedoresArray = Array.isArray(proveedoresData) ? proveedoresData : 
                                      proveedoresData.results ? proveedoresData.results : [];

                console.log('Proveedores procesados en el componente:', proveedoresArray);

                setProveedores(proveedoresArray);
                setLoading(false);
            } catch (err) {
                console.error('Error al cargar proveedores en el componente:', err);
                setError('Error al cargar datos de proveedores');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateProveedor = () => {
        setIsCreating(true);
        setSelectedProveedor(null);
        setFormData({ 
            name: '',
            contact_email: '',
            phone: '',
            address: '',
            tax_id: '',
            website: '',
            is_active: true,
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null); // Limpiar errores anteriores
            // Aquí irá la lógica para guardar el proveedor con los nuevos campos
            console.log('Datos del formulario:', formData);
            
            // TODO: Add API call to create or update supplier
            // Lógica para crear o actualizar proveedor
            if (selectedProveedor) { // Modo edición
                // await updateSupplier(selectedProveedor.id, formData);
                console.log('Funcionalidad de edición no implementada aún');
            } else { // Modo creación
                await createSupplier(formData);
            }

            // TODO: Refresh supplier list after saving
            // Recargar la lista de proveedores después de guardar
            const proveedoresActualizados = await getSuppliers();
            setProveedores(Array.isArray(proveedoresActualizados) ? proveedoresActualizados : []);

            setIsCreating(false);
            // TODO: Clear selected supplier
            setSelectedProveedor(null); // Clear selected supplier
            setFormData({
                name: '',
                contact_email: '',
                phone: '',
                address: '',
                tax_id: '',
                website: '',
                is_active: true,
            });
        } catch (error) {
            console.error('Error al guardar el proveedor:', error);
            setError(error.message || 'Error al guardar el proveedor');
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setSelectedProveedor(null); // Clear selected supplier
        setFormData({
            name: '',
            contact_email: '',
            phone: '',
            address: '',
            tax_id: '',
            website: '',
            is_active: true,
        });
    };

    const handleEditProveedor = (proveedor) => {
        // Lógica para cargar datos del proveedor en el formulario para edición
        setSelectedProveedor(proveedor);
        setIsCreating(false); // Asegurarse de que no estamos en modo creación
        // Aquí deberías copiar los datos del proveedor al formData para que aparezcan en el formulario
        setFormData({
            name: proveedor.name || '',
            contact_email: proveedor.contact_email || '',
            phone: proveedor.phone || '',
            address: proveedor.address || '',
            tax_id: proveedor.tax_id || '',
            website: proveedor.website || '',
            is_active: proveedor.is_active !== undefined ? proveedor.is_active : true,
        });
    };

    const handleDeleteProveedor = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este proveedor?')) {
            try {
                console.log(`Eliminando proveedor con ID: ${id}`);
                await deleteSupplier(id);
                console.log(`Proveedor ${id} eliminado con éxito.`);
                
                // Recargar la lista de proveedores después de eliminar
                const proveedoresActualizados = await getSuppliers();
                const proveedoresArray = Array.isArray(proveedoresActualizados) ? proveedoresActualizados : 
                                          proveedoresActualizados.results ? proveedoresActualizados.results : [];
                setProveedores(proveedoresArray);
                
                // Limpiar selección si el proveedor eliminado era el seleccionado
                if (selectedProveedor && selectedProveedor.id === id) {
                    setSelectedProveedor(null);
                }

            } catch (error) {
                console.error('Error al eliminar proveedor:', error);
                setError(error.message || 'Error al eliminar el proveedor');
            }
        }
    };

    if (loading) {
        return <div>Cargando proveedores...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>; 
    }

    return (
        <div className="gestion-proveedores-container">
            <button onClick={() => navigate('/admin/dashboard')} className="back-button">
                Volver al Dashboard
            </button>

            {!isCreating && (
                <>
                    <h1>Gestión de Proveedores</h1>
                    <button onClick={handleCreateProveedor} className="create-button">
                        Crear Nuevo Proveedor
                    </button>
                    <div className="proveedores-list">
                        <h2>Lista de Proveedores</h2>
                        {Array.isArray(proveedores) && proveedores.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>NIT/Tax ID</th>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th>Activo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proveedores.map(proveedor => (
                                        <tr key={proveedor.id}>
                                            <td>{proveedor.tax_id}</td>
                                            <td>{proveedor.name}</td>
                                            <td>{proveedor.contact_email}</td>
                                            <td>{proveedor.phone}</td>
                                            <td>{proveedor.is_active ? 'Sí' : 'No'}</td>
                                            <td>
                                                <button 
                                                    onClick={() => setSelectedProveedor(proveedor)}
                                                    className="action-button"
                                                >
                                                    Ver Detalles
                                                </button>
                                                <button 
                                                    onClick={() => handleEditProveedor(proveedor)}
                                                    className="action-button edit"
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteProveedor(proveedor.id)}
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
                            <p>No hay proveedores registrados.</p>
                        )}
                    </div>
                </>
            )}

            {isCreating && (
                <div className="proveedor-form">
                    <h2>Crear Nuevo Proveedor</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email de Contacto:</label>
                            <input
                                type="email"
                                name="contact_email"
                                value={formData.contact_email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Teléfono:</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Dirección:</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>NIT/Tax ID:</label>
                            <input
                                type="text"
                                name="tax_id"
                                value={formData.tax_id}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Sitio Web:</label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Activo:</label>
                            <select
                                name="is_active"
                                value={formData.is_active}
                                onChange={handleInputChange}
                                required
                            >
                                <option value={true}>Sí</option>
                                <option value={false}>No</option>
                            </select>
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

            {selectedProveedor && (
                <div className="modal-overlay"> {/* Using modal overlay for details */}
                    <div className="proveedor-details">
                        <h2>Detalles del Proveedor</h2>
                        <div className="details-content">
                            <p><strong>Nombre:</strong> {selectedProveedor.name}</p>
                            <p><strong>Email de Contacto:</strong> {selectedProveedor.contact_email}</p>
                            <p><strong>Teléfono:</strong> {selectedProveedor.phone}</p>
                            <p><strong>Dirección:</strong> {selectedProveedor.address}</p>
                            <p><strong>NIT/Tax ID:</strong> {selectedProveedor.tax_id}</p>
                            <p><strong>Sitio Web:</strong> {selectedProveedor.website}</p>
                            <p><strong>Activo:</strong> {selectedProveedor.is_active ? 'Sí' : 'No'}</p>
                            {/* TODO: Add created_at and updated_at if needed in details */}
                        </div>
                        <button onClick={() => setSelectedProveedor(null)} className="close-button">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionProveedores; 