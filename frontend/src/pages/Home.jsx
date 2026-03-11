import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { headphoneService, articleService } from '../services/api';
import HeadphoneCard from '../components/HeadphoneCard';
import ArticleCard from '../components/ArticleCard';

function Home() {
    const [novedades, setNovedades] = useState([]);
    const [guias, setGuias] = useState([]);
    const [analisis, setAnalisis] = useState([]);
    const [featuredBrands, setFeaturedBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [novedadesRes, guiasRes, analisisRes, brandsRes] = await Promise.all([
                    articleService.getByType('novedad'),
                    articleService.getByType('guia'),
                    articleService.getByType('analisis'),
                    articleService.getByType('marcas')
                ]);

                // Obtenemos los arrays de datos y tomamos los primeros 6 elementos para cada sección
                const extractData = (res) => res.data.results || res.data || [];

                setNovedades(extractData(novedadesRes).slice(0, 6));
                setGuias(extractData(guiasRes).slice(0, 6));
                setAnalisis(extractData(analisisRes).slice(0, 6));
                setFeaturedBrands(extractData(brandsRes));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <h1 className="hero-title">Descubre tu Blog especializado en sonido</h1>
                    <p className="hero-subtitle">
                        Análisis profesionales, reviews y las últimas novedades en auriculares.
                    </p>
                    <a href="#featured" className="btn btn-primary">
                        Explorar Auriculares
                    </a>
                </div>
            </section>

            {/* Section Novedades */}
            {novedades.length > 0 && (
                <section className="section" id="novedades">
                    <div className="container">
                        <h2 className="section-title">Novedades</h2>
                        <div className="grid grid-3">
                            {novedades.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Section Guía */}
            {guias.length > 0 && (
                <section className="section" id="guia" style={{ backgroundColor: 'var(--color-surface)' }}>
                    <div className="container">
                        <h2 className="section-title">Guía</h2>
                        <div className="grid grid-3">
                            {guias.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Section Análisis (Conditional) */}
            {analisis.length > 0 && (
                <section className="section" id="analisis">
                    <div className="container">
                        <h2 className="section-title">Análisis</h2>
                        <div className="grid grid-3">
                            {analisis.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Brands */}
            <section className="section">
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 className="section-title">Marcas Recomendadas</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4rem', marginTop: '3rem' }}>
                        {featuredBrands.slice(0, 6).map(brand => (
                            <Link key={brand.id} to={`/articulo/${brand.slug}`} className="home-brand-logo" style={{ textDecoration: 'none', color: '#0f172a' }}>
                                <div style={{ width: '110px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    {(brand.list_image || brand.featured_image) ? (
                                        <img src={brand.list_image || brand.featured_image} alt={brand.list_title || brand.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#CBD5E1' }}>{(brand.list_title || brand.title)[0]}</span>
                                    )}
                                </div>
                                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{brand.list_title || brand.title}</span>
                            </Link>
                        ))}
                    </div>
                    <div style={{ marginTop: '4rem' }}>
                        <Link to="/marcas" className="btn btn-outline" style={{ border: '2px solid var(--color-accent)', color: 'var(--color-accent)', padding: '0.8rem 2rem', borderRadius: '30px', fontWeight: 700, textDecoration: 'none' }}>
                            Ver todas las marcas
                        </Link>
                    </div>
                </div>
            </section>

            <style>
                {`
                .home-brand-logo {
                    transition: transform 0.3s ease;
                    opacity: 0.8;
                }
                .home-brand-logo:hover {
                    transform: translateY(-5px) scale(1.05);
                    opacity: 1;
                }
                .btn-outline:hover {
                    background-color: var(--color-accent);
                    color: white !important;
                }
                `}
            </style>
        </div>
    );
}

export default Home;
