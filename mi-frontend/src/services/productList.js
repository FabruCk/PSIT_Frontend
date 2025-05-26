import { useState, useEffect } from 'react';
import { getProducts } from './productService';

const productList = () => {
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        getProducts()
        .then((data) => setProducts(data))
        .catch((error) => console.error('Error al obtener productos:', error));
    }, []);

    return (
        <div>
            <h1>Productos</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>{product.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default productList;