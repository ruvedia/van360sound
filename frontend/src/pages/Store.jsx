import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

function Store() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/products/`);
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
                    console.error('API response is not an array:', response.data);
                    setError('Error en el formato de datos recibidos.');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('No se pudieron cargar los productos. Por favor, inténtalo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="store-page">
            <Helmet>
                <title>Tienda | Van360Sound</title>
                <meta name="description" content="Explora nuestra tienda de auriculares y accesorios de audio de alta fidelidad." />
            </Helmet>

            <header className="page-header">
                <div className="container">
                    <h1>Tienda Van360Sound</h1>
                    <p>Selección premium de equipos de audio para los más exigentes.</p>
                </div>
            </header>

            <section className="store-content container section-padding">
                {loading ? (
                    <div className="loading">Cargando productos...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : products.length === 0 ? (
                    <div className="no-products">
                        <p>Aún no hay productos disponibles. ¡Vuelve pronto!</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map(product => (
                            <div key={product.id} className="product-card">
                                <div className="product-image">
                                    <img src={product.main_image} alt={product.name} />
                                    {product.stock <= 0 && <span className="badge out-of-stock">Agotado</span>}
                                </div>
                                <div className="product-info">
                                    <span className="product-category">{product.category_name}</span>
                                    <h3>{product.name}</h3>
                                    <p className="product-price">{product.price}€</p>
                                    <button 
                                        className="btn btn-primary btn-block"
                                        disabled={product.stock <= 0}
                                    >
                                        {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <style>
                {`
                .store-page .page-header {
                    background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
                    color: white;
                    padding: 80px 0;
                    text-align: center;
                }
                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 30px;
                }
                .product-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    transition: transform 0.3s ease;
                    border: 1px solid var(--color-border);
                }
                .product-card:hover {
                    transform: translateY(-5px);
                }
                .product-image {
                    position: relative;
                    height: 250px;
                    background: #f9f9f9;
                }
                .product-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    padding: 20px;
                }
                .product-info {
                    padding: 20px;
                }
                .product-category {
                    color: var(--color-primary);
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                }
                .product-info h3 {
                    margin: 10px 0;
                    font-size: 1.2rem;
                }
                .product-price {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: var(--color-text);
                    margin-bottom: 20px;
                }
                .badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }
                .out-of-stock {
                    background: #ff4444;
                    color: white;
                }
                .loading, .error-message, .no-products {
                    text-align: center;
                    padding: 100px 0;
                    font-size: 1.2rem;
                }
                `}
            </style>
        </div>
    );
}

export default Store;
