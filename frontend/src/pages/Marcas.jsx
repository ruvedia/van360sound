import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brandService } from '../services/api';
import SEO from '../components/SEO';

function Marcas() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await brandService.getAll();
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

            <div className="brands-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2.5rem',
                marginBottom: '4rem'
            }}>
                {brands.map((brand) => (
                    <Link
                        key={brand.id}
                        to={`/marcas/${brand.slug}`}
                        className="brand-card"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            padding: '2.5rem',
                            textAlign: 'center',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s ease',
                            border: '1px solid #f0f0f0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <div className="brand-logo-container" style={{
                            width: '120px',
                            height: '120px',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f8fafc',
                            borderRadius: '50%',
                            padding: '1rem'
                        }}>
                            {brand.logo ? (
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                />
                            ) : (
                                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#CBD5E1' }}>{brand.name[0]}</span>
                            )}
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.8rem' }}>{brand.name}</h2>
                        <p style={{
                            fontSize: '0.95rem',
                            color: 'var(--color-text-secondary)',
                            lineHeight: '1.5',
                            display: '-webkit-box',
                            WebkitLineClamp: '3',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                            {brand.description || `Conoce la historia de innovación de ${brand.name}.`}
                        </p>
                        <span className="btn-small" style={{
                            marginTop: '1.5rem',
                            padding: '0.6rem 1.2rem',
                            backgroundColor: 'var(--color-accent)',
                            color: 'white',
                            borderRadius: '30px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            transition: 'transform 0.2s'
                        }}>
                            Ver Historia
                        </span>
                    </Link>
                ))}
            </div>

            <style>
                {`
                .brand-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    border-color: var(--color-accent);
                }
                .brand-card:hover .btn-small {
                    transform: scale(1.05);
                }
                .brand-card:hover .brand-logo-container {
                    background-color: #fff;
                }
                `}
            </style>
        </div>
    );
}

export default Marcas;
