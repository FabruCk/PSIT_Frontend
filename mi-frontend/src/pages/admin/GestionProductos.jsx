import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/gestionProductos.css';
// Eliminar importaciones de servicios de categoría y proveedor
import { getCategories } from '../../services/categoryService'; 
import { getSuppliers } from '../../services/supplierService'; 

const GestionProductos = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        model: '',
        sku: '',
        category: '',
        supplier: '',
        stock: '',
        price: '',
        cost_price: '',
        condition: '',
        warranty: '',
        specifications: '',
        serial_number: '',
        barcode: '',
        location: '',
        min_stock: '',
        is_active: true
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriasData, proveedoresData] = await Promise.all([
                    getCategories(),
                    getSuppliers()
                ]);
                setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
                setProveedores(Array.isArray(proveedoresData) ? proveedoresData : []);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar datos');
                setLoading(false);
                console.error('Error al cargar datos:', err);
            }
        };
        fetchData();
    }, []); 

    const handleCreateProducto = () => {
        setIsCreating(true);
        setSelectedProducto(null);
        setFormData({ 
            name: '',
            brand: '',
            model: '',
            sku: '',
            category: '',
            supplier: '',
            stock: '',
            price: '',
            cost_price: '',
            condition: '',
            warranty: '',
            specifications: '',
            serial_number: '',
            barcode: '',
            location: '',
            min_stock: '',
            is_active: true
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'categoria' && value === 'agregar-categoria') {
            navigate('/admin/categorias');
            return;
        }

        if (name === 'supplier' && value === 'agregar-proveedor') {
            navigate('/admin/proveedores');
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Aquí irá la lógica para guardar el producto
            console.log('Datos del formulario:', formData);
            setIsCreating(false);
        } catch (error) {
            console.error('Error al guardar el producto:', error);
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setFormData({
            name: '',
            brand: '',
            model: '',
            sku: '',
            category: '',
            supplier: '',
            stock: '',
            price: '',
            cost_price: '',
            condition: '',
            warranty: '',
            specifications: '',
            serial_number: '',
            barcode: '',
            location: '',
            min_stock: '',
            is_active: true
        });
    };

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>; 
    }

    return (
        <div className="gestion-productos-container">
            <button onClick={() => navigate(-1)} className="back-button">
                Volver
            </button>

            <h1>Gestión de Productos</h1>

            {!isCreating && (
                <button onClick={handleCreateProducto} className="create-button">
                    Crear Nuevo Producto
                </button>
            )}

            {isCreating && (
                <div className="producto-form">
                    <h2>Crear Nuevo Producto</h2>
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
                            <label>Marca:</label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Modelo:</label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>SKU:</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Categoría:</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione una categoría</option>
                                {Array.isArray(categorias) && categorias.length > 0 ? (
                                    categorias.map(categoria => (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.nombre}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No hay categorías disponibles</option>
                                )}
                                <option value="agregar-categoria">+ Agregar Nueva Categoría</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Proveedor:</label>
                            <select
                                name="supplier"
                                value={formData.supplier}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un proveedor</option>
                                {Array.isArray(proveedores) && proveedores.length > 0 ? (
                                    proveedores.map(proveedor => (
                                        <option key={proveedor.id} value={proveedor.id}>
                                            {proveedor.nombre}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No hay proveedores disponibles</option>
                                )}
                                <option value="agregar-proveedor">+ Agregar Nuevo Proveedor</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Stock:</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Precio de Venta:</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Precio de Costo:</label>
                            <input
                                type="number"
                                name="cost_price"
                                value={formData.cost_price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Condición:</label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione una condición</option>
                                <option value="nuevo">Nuevo</option>
                                <option value="usado">Usado</option>
                                <option value="reacondicionado">Reacondicionado</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Garantía (meses):</label>
                            <input
                                type="number"
                                name="warranty"
                                value={formData.warranty}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Especificaciones:</label>
                            <textarea
                                name="specifications"
                                value={formData.specifications}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Número de Serie:</label>
                            <input
                                type="text"
                                name="serial_number"
                                value={formData.serial_number}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Código de Barras:</label>
                            <input
                                type="text"
                                name="barcode"
                                value={formData.barcode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Ubicación:</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Mínimo:</label>
                            <input
                                type="number"
                                name="min_stock"
                                value={formData.min_stock}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Estado:</label>
                            <select
                                name="is_active"
                                value={formData.is_active}
                                onChange={handleInputChange}
                                required
                            >
                                <option value={true}>Activo</option>
                                <option value={false}>Inactivo</option>
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

            {!isCreating && (
                <div className="productos-list">
                    <h2>Lista de Productos</h2>
                    {productos.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Categoría</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map(producto => (
                                    <tr key={producto.id}>
                                        <td>{producto.codigo}</td>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.precio}</td>
                                        <td>{producto.stock}</td>
                                         {/* Mostrar el valor directo o buscar si hay una lista de categorias disponible */}
                                        <td>{producto.categoria}</td>
                                        <td>
                                            <button 
                                                onClick={() => setSelectedProducto(producto)}
                                                className="action-button"
                                            >
                                                Ver Detalles
                                            </button>
                                            <button 
                                                onClick={() => handleEditProducto(producto)}
                                                className="action-button edit"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteProducto(producto.id)}
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
                        <p>No hay productos registrados.</p>
                    )}
                </div>
            )}

            {selectedProducto && (
                 <div className="modal-overlay"> {/* Usar overlay */}
                    <div className="producto-details">
                        <h2>Detalles del Producto</h2>
                        <div className="details-content">
                            <p><strong>Código:</strong> {selectedProducto.codigo}</p>
                            <p><strong>Nombre:</strong> {selectedProducto.nombre}</p>
                            <p><strong>Descripción:</strong> {selectedProducto.descripcion}</p>
                            <p><strong>Precio:</strong> {selectedProducto.precio}</p>
                            <p><strong>Stock:</strong> {selectedProducto.stock}</p>
                             {/* Mostrar el valor directo o buscar si hay listas disponibles */}
                            <p><strong>Categoría:</strong> {selectedProducto.categoria}</p>
                            <p><strong>Proveedor:</strong> {selectedProducto.proveedor}</p>
                        </div>
                        <button onClick={() => setSelectedProducto(null)} className="close-button">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionProductos;