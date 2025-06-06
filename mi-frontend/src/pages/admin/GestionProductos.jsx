import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/gestionProductos.css';
import { getCategories } from '../../services/categoryService';
import { getSuppliers } from '../../services/supplierService';
import { getProducts, createProduct } from '../../services/productService';

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

    // Función para obtener el nombre de la categoría por ID
    const getCategoryName = (categoryId) => {
        if (!categoryId) return '--';
        const category = categorias.find(cat => cat.id === categoryId);
        return category ? category.name : '--'; // Asumiendo que category object has 'name'
    };

    // Función para obtener el nombre del proveedor por ID
    const getSupplierName = (supplierId) => {
        if (!supplierId) return '--';
        const supplier = proveedores.find(prov => prov.id === supplierId);
        return supplier ? supplier.name : '--'; // Asumiendo que supplier object has 'name'
    };

    // Función para obtener el texto de las especificaciones desde el JSON string o object
    const getSpecificationsText = (specificationsData) => {
        if (!specificationsData) return '--';
        
        // Si ya es un objeto, asumir que es el JSON parseado
        if (typeof specificationsData === 'object') {
            // Asumiendo que el texto está en la clave 'texto'
            return specificationsData.texto || '--';
        }

        // Si es una cadena, intentar parsear como JSON
        if (typeof specificationsData === 'string') {
            try {
                const specObject = JSON.parse(specificationsData);
                 // Asumiendo que el texto está en la clave 'texto'
                return specObject.texto || '--';
            } catch (e) {
                console.error('Error parsing specifications JSON string:', specificationsData, e);
                 // Si falla el parseo de la cadena, devolver la cadena original (para depurar)
                return specificationsData;
            }
        }

        // Si no es string ni object, devolver valor por defecto
        return '--';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null); // Limpiar errores anteriores
                console.log('Iniciando carga de datos para productos (productos, categorias y proveedores)...');
                
                // Cargar productos, categorías y proveedores en paralelo
                const [productosData, categoriasData, proveedoresData] = await Promise.all([
                    getProducts(), // Obtener productos
                    getCategories(),
                    getSuppliers()
                ]);
                
                console.log('Productos recibidos en GestionProductos:', productosData);
                console.log('Categorías recibidas en GestionProductos:', categoriasData);
                console.log('Proveedores recibidos en GestionProductos:', proveedoresData);

                // Procesar respuestas (manejo de paginación si aplica)
                const productosArray = Array.isArray(productosData) ? productosData : 
                                      productosData.results ? productosData.results : [];
                                       
                const categoriasArray = Array.isArray(categoriasData) ? categoriasData : 
                                        categoriasData.results ? categoriasData.results : [];
                                       
                const proveedoresArray = Array.isArray(proveedoresData) ? proveedoresData : 
                                        proveedoresData.results ? proveedoresData.results : [];

                console.log('Productos procesados en GestionProductos:', productosArray);
                console.log('Categorías procesadas en GestionProductos:', categoriasArray);
                console.log('Proveedores procesados en GestionProductos:', proveedoresArray);

                setProductos(productosArray); // Guardar productos en estado
                setCategorias(categoriasArray);
                setProveedores(proveedoresArray);

                setLoading(false);
            } catch (err) {
                console.error('Error al cargar datos en GestionProductos:', err);
                setError(err.message || 'Error al cargar datos de productos');
                setLoading(false);
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
        const { name, value, type, checked } = e.target;

        if (name === 'category' && value === 'agregar-categoria') {
            navigate('/admin/categorias');
            return;
        }

        if (name === 'supplier' && value === 'agregar-proveedor') {
            navigate('/admin/proveedores');
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null); // Limpiar errores anteriores
            console.log('Datos del formulario antes de enviar:', formData);
            
            // Preparar datos para enviar
            const datosParaEnviar = { ...formData };
            
            // Convertir el texto plano de specifications a una cadena JSON con una estructura simple
            let specificationsJsonString = '';
            if (datosParaEnviar.specifications) {
                const specificationsObject = { "texto": datosParaEnviar.specifications };
                specificationsJsonString = JSON.stringify(specificationsObject);
            } else {
                 // Si el campo está vacío, enviar un objeto JSON vacío como string
                 specificationsJsonString = JSON.stringify({});
            }
            
            datosParaEnviar.specifications = specificationsJsonString;

            console.log('Datos del formulario listos para enviar:', datosParaEnviar);

            // Lógica para crear o actualizar producto
            if (selectedProducto) { // Modo edición
                // TODO: Implement updateProduct API call
                console.log('Funcionalidad de edición de producto no implementada aún');
                 setError('La funcionalidad de edición no está implementada.');
            } else { // Modo creación
                // Llamada a la API para crear producto
                await createProduct(datosParaEnviar);
                 // Recargar la lista después de crear
                const productosActualizados = await getProducts();
                const productosArray = Array.isArray(productosActualizados) ? productosActualizados : 
                                        productosActualizados.results ? productosActualizados.results : [];
                setProductos(productosArray);
            }

             // Limpiar formulario y estados después de creación exitosa o intento de edición
            setIsCreating(false);
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

        } catch (error) {
            console.error('Error al guardar el producto:', error);
            setError(error.message || 'Error al guardar el producto');
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setSelectedProducto(null); // Limpiar producto seleccionado
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

     const handleEditProducto = (producto) => {
         // TODO: Implementar carga de datos del producto para edición
         console.log('Editar producto', producto);
         setError('La funcionalidad de edición no está implementada.');
         // Si implementas la edición, actualiza el formData aquí:
         // setFormData({ ...producto });
         // setIsCreating(true); // O un nuevo estado isEditing
         // setSelectedProducto(producto);
     };

     const handleDeleteProducto = async (id) => {
         if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
             try {
                 setError(null);
                 // TODO: Implement deleteProduct API call
                 console.log('Eliminar producto con ID:', id);
                 setError('La funcionalidad de eliminación no está implementada.');
                 // Si implementas la eliminación, usa deleteProduct(id);
                 // y recarga la lista de productos.
             } catch (error) {
                 console.error('Error al eliminar producto:', error);
                 setError(error.message || 'Error al eliminar el producto');
             }
         }
     };

    if (loading) {
        return <div className="loading">Cargando productos...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>; 
    }

    console.log('Renderizando GestionProductos. Estado de productos:', productos);
    console.log('Tipo de productos:', typeof productos, 'Es array:', Array.isArray(productos));

    return (
        <div className="gestion-productos-container">
            <button onClick={() => navigate(-1)} className="back-button">
                Volver
            </button>

            <h1>Gestión de Productos</h1>

            {!isCreating && !selectedProducto && (
                <button onClick={handleCreateProducto} className="create-button">
                    Crear Nuevo Producto
                </button>
            )}

            {/* Mostrar formulario de creación si isCreating es true */}
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
                            />
                        </div>

                        <div className="form-group">
                            <label>Modelo:</label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>SKU:</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
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
                                {Array.isArray(categorias) && categorias.map(categoria => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.name}
                                    </option>
                                ))}
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
                                {Array.isArray(proveedores) && proveedores.length > 0 && proveedores.map(proveedor => (
                                    <option key={proveedor.id} value={proveedor.id}>
                                        {proveedor.name}
                                    </option>
                                ))}
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
                            <label>Precio:</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label>Precio de Costo:</label>
                            <input
                                type="number"
                                name="cost_price"
                                value={formData.cost_price}
                                onChange={handleInputChange}
                                step="0.01"
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
                                <option value="new">Nuevo</option>
                                <option value="refurbished">Reacondicionado</option>
                                <option value="used">Usado</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Garantía:</label>
                            <select
                                name="warranty"
                                value={formData.warranty}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione una garantía</option>
                                <option value="none">Ninguna</option>
                                <option value="30d">30 Días</option>
                                <option value="90d">90 Días</option>
                                <option value="1y">1 Año</option>
                                <option value="2y">2 Años</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Especificaciones:</label>
                            <textarea
                                name="specifications"
                                value={formData.specifications}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Escriba cada característica separada por un salto de línea."
                            />
                        </div>

                        <div className="form-group">
                            <label>Número de Serie:</label>
                            <input
                                type="text"
                                name="serial_number"
                                value={formData.serial_number}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Código de Barras:</label>
                            <input
                                type="text"
                                name="barcode"
                                value={formData.barcode}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Ubicación:</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Mínimo:</label>
                            <input
                                type="number"
                                name="min_stock"
                                value={formData.min_stock}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Activo:</label>
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
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

            {/* Mostrar lista de productos si no estamos creando ni viendo detalles */}
            {!isCreating && !selectedProducto && (
                <div className="productos-list">
                    <h2>Lista de Productos</h2>
                    {Array.isArray(productos) && productos.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                    <th>Categoría</th>
                                    <th>Proveedor</th>
                                    <th>Stock</th>
                                    <th>Precio</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map(producto => (
                                    <tr key={producto.id}>
                                        <td>{producto.sku || '--'}</td>
                                        <td>{producto.name || '--'}</td>
                                        <td>{producto.brand || '--'}</td>
                                        <td>{producto.model || '--'}</td>
                                        {/* Usar helper para mostrar nombre de categoría */}
                                        <td>{getCategoryName(producto.category)}</td>
                                        {/* Usar helper para mostrar nombre de proveedor */}
                                        <td>{getSupplierName(producto.supplier)}</td>
                                        <td>{producto.stock !== undefined ? producto.stock : '--'}</td>
                                        <td>{producto.price !== undefined ? producto.price : '--'}</td>
                                        <td>{producto.is_active ? 'Sí' : 'No'}</td>
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

            {/* Mostrar detalles del producto si selectedProducto no es null y no estamos creando */}
            {selectedProducto && !isCreating && (
                 <div className="modal-overlay">
                    <div className="producto-details">
                        <h2>Detalles del Producto: {selectedProducto.name}</h2>
                        <div className="details-content">
                            <p><strong>ID:</strong> {selectedProducto.id || '--'}</p>
                            <p><strong>Código SKU:</strong> {selectedProducto.sku || '--'}</p>
                            <p><strong>Nombre:</strong> {selectedProducto.name || '--'}</p>
                            <p><strong>Marca:</strong> {selectedProducto.brand || '--'}</p>
                            <p><strong>Modelo:</strong> {selectedProducto.model || '--'}</p>
                            {/* Usar helper para mostrar nombre de categoría */}
                            <p><strong>Categoría:</strong> {getCategoryName(selectedProducto.category)}</p>
                            {/* Usar helper para mostrar nombre de proveedor */}
                            <p><strong>Proveedor:</strong> {getSupplierName(selectedProducto.supplier)}</p>
                            <p><strong>Stock:</strong> {selectedProducto.stock !== undefined ? selectedProducto.stock : '--'}</p>
                            <p><strong>Precio:</strong> {selectedProducto.price !== undefined ? selectedProducto.price : '--'}</p>
                             <p><strong>Precio de Costo:</strong> {selectedProducto.cost_price !== undefined ? selectedProducto.cost_price : '--'}</p>
                             <p><strong>Condición:</strong> {selectedProducto.condition || '--'}</p>
                             <p><strong>Garantía:</strong> {selectedProducto.warranty || '--'}</p>
                            {/* Mostrar especificaciones usando helper */}
                            <p><strong>Especificaciones:</strong> {getSpecificationsText(selectedProducto.specifications)}</p>
                             <p><strong>Número de Serie:</strong> {selectedProducto.serial_number || '--'}</p>
                             <p><strong>Código de Barras:</strong> {selectedProducto.barcode || '--'}</p>
                             <p><strong>Ubicación:</strong> {selectedProducto.location || '--'}</p>
                             <p><strong>Stock Mínimo:</strong> {selectedProducto.min_stock !== undefined ? selectedProducto.min_stock : '--'}</p>
                            <p><strong>Activo:</strong> {selectedProducto.is_active ? 'Sí' : 'No'}</p>
                            <p><strong>Fecha Creación:</strong> {selectedProducto.created_at || '--'}</p>
                            <p><strong>Fecha Actualización:</strong> {selectedProducto.updated_at || '--'}</p>
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