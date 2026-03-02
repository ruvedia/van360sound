import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { brandService } from '../services/api';
import SEO from '../components/SEO';

function BrandDetail() {
    const { slug } = useParams();
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const response = await brandService.getBySlug(slug);
                setBrand(response.data);
            } catch (error) {
                console.error('Error fetching brand:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrand();
    }, [slug]);

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <div className="loading">Cargando historia de la marca...</div>
            </div>
        );
    }

    if (!brand) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h2>Marca no encontrada</h2>
                <Link to="/marcas" className="btn btn-primary" style={{ marginTop: '1rem' }}>Volver al listado</Link>
            </div>
        );
    }

    return (
        <article className="container" style={{ padding: '4rem 1rem', maxWidth: '900px' }}>
            <SEO
                title={`${brand.name} - Historia y Legado - Van360Sound`}
                description={brand.meta_description || brand.description}
                image={brand.logo}
            />

            <div style={{ marginBottom: '2rem' }}>
                <Link to="/marcas" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>← Volver a Marcas</Link>
            </div>

            <header style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginBottom: '4rem',
                backgroundColor: 'white',
                padding: '3rem',
                borderRadius: '24px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                border: '1px solid #f0f0f0'
            }}>
                <div style={{
                    width: '180px',
                    height: '180px',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    borderRadius: '24px',
                    padding: '1.5rem',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02)'
                }}>
                    <img
                        src={brand.logo}
                        alt={brand.name}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                </div>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    Historia de {brand.name}
                </h1>
                {brand.website && (
                    <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: 'var(--color-accent)',
                            textDecoration: 'none',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        Visitar sitio oficial ↗
                    </a>
                )}
            </header>

            <div
                className="article-content"
                style={{
                    fontSize: '1.2rem',
                    lineHeight: '1.9',
                    color: '#333'
                }}
                dangerouslySetInnerHTML={{ __html: brand.history }}
            />

            <footer style={{
                marginTop: '5rem',
                padding: '3rem',
                backgroundColor: 'var(--color-surface)',
                borderRadius: '24px',
                textAlign: 'center'
            }}>
                <h3 style={{ marginBottom: '1rem' }}>¿Te ha gustado conocer a {brand.name}?</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                    Sigue explorando otras marcas o descubre nuestras guías de compra.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/marcas" className="btn btn-primary">Todas las Marcas</Link>
                    <Link to="/guia" className="btn btn-secondary">Guías de Compra</Link>
                </div>
            </footer>
        </article>
    );
}

export default BrandDetail;
