import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/gestionCategorias.css';
import { 
    getCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    getPrincipalCategories,
    getChildCategories
} from '../../services/categoryService';

const GestionCategorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [categoriasPrincipales, setCategoriasPrincipales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    // Estados para el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        parent: ''
    });

    // Cargar categorías al iniciar
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Iniciando carga de datos...');
                const [todasCategorias, principales] = await Promise.all([
                    getCategories(),
                    getPrincipalCategories()
                ]);
                
                console.log('Categorías recibidas:', todasCategorias);
                console.log('Categorías principales recibidas:', principales);

                // Verificar si la respuesta es un array o un objeto con una propiedad results
                const categoriasArray = Array.isArray(todasCategorias) ? todasCategorias : 
                                     todasCategorias.results ? todasCategorias.results : [];
                
                const principalesArray = Array.isArray(principales) ? principales : 
                                       principales.results ? principales.results : [];

                console.log('Categorías procesadas:', categoriasArray);
                console.log('Categorías principales procesadas:', principalesArray);

                setCategorias(categoriasArray);
                setCategoriasPrincipales(principalesArray);
                setLoading(false);
            } catch (err) {
                console.error('Error al cargar datos:', err);
                setError('Error al cargar datos');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateCategoria = () => {
        setIsCreating(true);
        setIsEditing(false);
        setSelectedCategoria(null);
        setFormData({ 
            nombre: '',
            descripcion: '',
            parent: ''
        });
    };

    const handleEditCategoria = (categoria) => {
        setIsEditing(true);
        setIsCreating(false);
        setSelectedCategoria(categoria);
        setFormData({
            nombre: categoria.name,
            descripcion: categoria.description || '',
            parent: categoria.parent_id || ''
        });
    };

    const handleDeleteCategoria = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta categoría?')) {
            try {
                await deleteCategory(id);
                // Recargar categorías después de eliminar
                const [todasCategorias, principales] = await Promise.all([
                    getCategories(),
                    getPrincipalCategories()
                ]);
                setCategorias(Array.isArray(todasCategorias) ? todasCategorias : []);
                setCategoriasPrincipales(Array.isArray(principales) ? principales : []);
            } catch (error) {
                console.error('Error al eliminar categoría:', error);
                setError('Error al eliminar la categoría');
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
            
            // Validar datos antes de enviar
            if (!formData.nombre.trim()) {
                setError('El nombre de la categoría es requerido');
                return;
            }

            if (isEditing && selectedCategoria) {
                await updateCategory(selectedCategoria.id, formData);
            } else {
                await createCategory(formData);
            }
            
            // Recargar todas las categorías
            const [todasCategorias, principales] = await Promise.all([
                getCategories(),
                getPrincipalCategories()
            ]);
            setCategorias(Array.isArray(todasCategorias) ? todasCategorias : []);
            setCategoriasPrincipales(Array.isArray(principales) ? principales : []);
            
            // Limpiar formulario y estados
            setIsCreating(false);
            setIsEditing(false);
            setSelectedCategoria(null);
            setFormData({
                nombre: '',
                descripcion: '',
                parent: ''
            });
        } catch (error) {
            console.error('Error al guardar categoría:', error);
            setError(error.message || 'Error al guardar la categoría');
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setIsEditing(false);
        setSelectedCategoria(null);
        setFormData({
            nombre: '',
            descripcion: '',
            parent: ''
        });
    };

    // Función para obtener el nombre de la categoría padre
    const getParentName = (parentId) => {
        if (!parentId) return '--';
        const parentCategory = categorias.find(cat => cat.id === parentId);
        return parentCategory ? parentCategory.name : '--';
    };

    if (loading) {
        return <div className="loading">Cargando categorías...</div>;
    }

    return (
        <div className="gestion-categorias-container">
            <button onClick={() => navigate('/admin/dashboard')} className="back-button">
                Volver al Dashboard
            </button>

            {error && <div className="error-message">{error}</div>}

            {!isCreating && !isEditing && (
                <>
                    <h1>Gestión de Categorías</h1>

                    <button onClick={handleCreateCategoria} className="create-button">
                        Crear Nueva Categoría
                    </button>

                    <div className="categorias-list">
                        <h2>Lista de Categorías</h2>
                        {Array.isArray(categorias) && categorias.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Categoría Padre</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categorias.map(categoria => (
                                        <tr key={categoria.id}>
                                            <td>{categoria.name}</td>
                                            <td>{categoria.description || '--'}</td>
                                            <td>{getParentName(categoria.parent_id)}</td>
                                            <td>
                                                <button 
                                                    onClick={() => setSelectedCategoria(categoria)}
                                                    className="action-button"
                                                >
                                                    Ver Detalles
                                                </button>
                                                <button 
                                                    onClick={() => handleEditCategoria(categoria)}
                                                    className="action-button edit"
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteCategoria(categoria.id)}
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
                            <p>No hay categorías registradas.</p>
                        )}
                    </div>
                </>
            )}

            {(isCreating || isEditing) && (
                <div className="categoria-form">
                    <h2>{isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Descripción:</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Categoría Padre:</label>
                            <select
                                name="parent"
                                value={formData.parent}
                                onChange={handleInputChange}
                            >
                                <option value="">Ninguna (Categoría Principal)</option>
                                {Array.isArray(categoriasPrincipales) && categoriasPrincipales.map(categoria => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.name}
                                    </option>
                                ))}
                            </select>
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

            {selectedCategoria && !isEditing && (
                <div className="categoria-details">
                    <h2>Detalles de la Categoría</h2>
                    <div className="details-content">
                        <p><strong>Nombre:</strong> {selectedCategoria.name}</p>
                        <p><strong>Descripción:</strong> {selectedCategoria.description || '--'}</p>
                        <p><strong>Categoría Padre:</strong> {getParentName(selectedCategoria.parent_id)}</p>
                    </div>
                    <button onClick={() => setSelectedCategoria(null)} className="close-button">
                        Cerrar
                    </button>
                </div>
            )}
        </div>
    );
};

export default GestionCategorias; 