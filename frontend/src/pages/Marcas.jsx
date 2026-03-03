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

            <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    Marcas de Auriculares
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
                    Explora el legado y la innovación tecnológica de los fabricantes que han definido el sonido de alta fidelidad.
                </p>
            </header>

            <div className="brands-list-premium">
                {brands.map((article) => (
                    <Link
                        key={article.id}
                        to={`/articulo/${article.slug}`}
                        className="brand-card-premium"
                    >
                        <div className="brand-logo-container-premium">
                            {article.featured_image ? (
                                <img
                                    src={article.featured_image}
                                    alt={article.title}
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                />
                            ) : (
                                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#CBD5E1' }}>{article.title[0]}</span>
                            )}
                        </div>
                        <div className="brand-content-premium">
                            <h2 className="brand-title-premium">{article.title}</h2>
                            <p className="brand-excerpt-premium">
                                {article.excerpt || `Descubre el legado, la filosofía de sonido y la historia de innovación tecnológica detrás de ${article.title}.`}
                            </p>
                            <span className="btn-discover">
                                Descubrir Legado <span style={{ fontFamily: 'sans-serif' }}>→</span>
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            <style>
                {`
                .brands-list-premium {
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                    margin-bottom: 5rem;
                }

                .brand-card-premium {
                    display: flex;
                    flex-direction: column;
                    text-decoration: none;
                    color: inherit;
                    background-color: white;
                    border-radius: 24px;
                    padding: 2.5rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                    border: 1px solid #f8fafc;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    position: relative;
                    overflow: hidden;
                }

                @media (min-width: 768px) {
                    .brand-card-premium {
                        flex-direction: row;
                        align-items: center;
                        gap: 3.5rem;
                        padding: 3.5rem;
                    }
                }

                .brand-card-premium:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
                    border-color: #e2e8f0;
                }

                .brand-logo-container-premium {
                    width: 140px;
                    height: 140px;
                    min-width: 140px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f8fafc;
                    border-radius: 50%;
                    padding: 1.5rem;
                    margin: 0 auto 2rem;
                    transition: transform 0.4s ease, background-color 0.4s ease;
                }

                @media (min-width: 768px) {
                    .brand-logo-container-premium {
                        margin: 0;
                        width: 160px;
                        height: 160px;
                        min-width: 160px;
                    }
                }

                .brand-card-premium:hover .brand-logo-container-premium {
                    background-color: #fff;
                    transform: scale(1.05);
                }

                .brand-content-premium {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                @media (min-width: 768px) {
                    .brand-content-premium {
                        align-items: flex-start;
                        text-align: left;
                    }
                }

                .brand-title-premium {
                    font-size: 1.8rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    color: #0f172a;
                }

                @media (min-width: 768px) {
                    .brand-title-premium {
                        font-size: 2.2rem;
                    }
                }

                .brand-excerpt-premium {
                    font-size: 1.05rem;
                    color: #475569;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                    max-width: 650px;
                }

                .btn-discover {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.8rem 1.8rem;
                    background-color: transparent;
                    color: var(--color-accent);
                    border: 2px solid var(--color-accent);
                    border-radius: 30px;
                    font-size: 0.95rem;
                    font-weight: 700;
                    transition: all 0.3s ease;
                }

                .brand-card-premium:hover .btn-discover {
                    background-color: var(--color-accent);
                    color: white;
                }
                `}
            </style>
        </div>
    );
}

export default Marcas;
