import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/gestionCategorias.css';
import { getCategories } from '../../services/categoryService';

const GestionCategorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    // Estados para el formulario de creación
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parent: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriasData = await getCategories();
                setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar datos');
                setLoading(false);
                console.error('Error al cargar categorías:', err);
            }
        };
        fetchData();
    }, []);

    const handleCreateCategoria = () => {
        setIsCreating(true);
        setSelectedCategoria(null);
        setFormData({ 
            name: '',
            description: '',
            parent: ''
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
        // Aquí irá la lógica para guardar la categoría con los nuevos campos
        console.log('Datos del formulario:', formData);
        // TODO: Add API call to create category
        setIsCreating(false);
    };

    const handleCancel = () => {
        setIsCreating(false);
        setFormData({
            name: '',
            description: '',
            parent: ''
        });
    };

    if (loading) {
        return <div>Cargando categorías...</div>;
    }

    return (
        <div className="gestion-categorias-container">
            <button onClick={() => navigate('/admin/dashboard')} className="back-button">
                Volver al Dashboard
            </button>

            {!isCreating && (
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
                                            <td>{categoria.nombre}</td>
                                            <td>{categoria.descripcion}</td>
                                            <td>{categoria.parent ? categoria.parent : '--'}</td>
                                            <td>
                                                <button 
                                                    onClick={() => setSelectedCategoria(categoria)}
                                                    className="action-button"
                                                >
                                                    Ver Detalles
                                                </button>
                                                <button 
                                                    className="action-button edit"
                                                    disabled
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    className="action-button delete"
                                                    disabled
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

            {isCreating && (
                <div className="categoria-form">
                    <h2>Crear Nueva Categoría</h2>
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
                            <label>Descripción:</label>
                            <textarea
                                name="description"
                                value={formData.description}
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
                                {Array.isArray(categorias) && categorias.length > 0 && categorias.map(categoria => (
                                    // Excluir la categoría actual si estamos editando (no aplica en crear)
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.nombre}
                                    </option>
                                ))}
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

            {selectedCategoria && (
                <div className="categoria-details">
                    <h2>Detalles de la Categoría</h2>
                    <div className="details-content">
                        <p><strong>Nombre:</strong> {selectedCategoria.nombre}</p>
                        <p><strong>Descripción:</strong> {selectedCategoria.descripcion}</p>
                        <p><strong>Categoría Padre:</strong> {selectedCategoria.parent ? selectedCategoria.parent : '--'}</p>
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