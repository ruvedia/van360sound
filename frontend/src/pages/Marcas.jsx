import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../services/api';
import SEO from '../components/SEO';

function Marcas() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                // Obtenemos los artículos filtrados por el tipo 'marcas'
                const response = await articleService.getByType('marcas');
                setBrands(response.data.results || response.data);
            } catch (error) {
                console.error('Error fetching brands:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <div className="loading">Cargando marcas...</div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <SEO
                title="Marcas de Auriculares - Historia y Filosofía"
                description="Descubre la historia, el origen y la filosofía detrás de las mejores marcas de auriculares del mundo."
            />

            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    Marcas de Auriculares
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
                    Explora el legado y la innovación tecnológica de los fabricantes que han definido el sonido de alta fidelidad.
                </p>
            </header>

            <div className="brands-grid-minimal">
                {brands.map((article) => (
                    <Link
                        key={article.id}
                        to={`/articulo/${article.slug}`}
                        className="brand-card-minimal"
                    >
                        <div className="brand-logo-container-minimal">
                            {article.featured_image ? (
                                <img
                                    src={article.featured_image}
                                    alt={article.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            ) : (
                                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#CBD5E1' }}>{article.title[0]}</span>
                            )}
                        </div>
                        <h2 className="brand-title-minimal">{article.title}</h2>
                    </Link>
                ))}
            </div>

            <style>
                {`
                .brands-grid-minimal {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 2rem;
                    margin-bottom: 5rem;
                }

                .brand-card-minimal {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    text-decoration: none;
                    color: inherit;
                    background-color: white;
                    border-radius: 20px;
                    padding: 2.5rem 1.5rem;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
                    border: 1px solid #f8fafc;
                    transition: all 0.3s ease;
                    text-align: center;
                }

                .brand-card-minimal:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.08);
                    border-color: #e2e8f0;
                }

                .brand-logo-container-minimal {
                    width: 100%;
                    height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                    transition: transform 0.3s ease;
                }

                .brand-card-minimal:hover .brand-logo-container-minimal {
                    transform: scale(1.08);
                }

                .brand-title-minimal {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                    line-height: 1.3;
                }
                `}
            </style>
        </div>
    );
}

export default Marcas;
