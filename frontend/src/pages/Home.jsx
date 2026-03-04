import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { headphoneService, articleService } from '../services/api';
import HeadphoneCard from '../components/HeadphoneCard';
import ArticleCard from '../components/ArticleCard';

function Home() {
    const [featuredHeadphones, setFeaturedHeadphones] = useState([]);
    const [latestArticles, setLatestArticles] = useState([]);
    const [featuredBrands, setFeaturedBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [headphonesRes, articlesRes, brandsRes] = await Promise.all([
                    headphoneService.getFeatured(),
                    articleService.getAll({ page_size: 15 }), // Extraer más para compensar el filtro
                    articleService.getByType('marcas')
                ]);

                setFeaturedHeadphones(headphonesRes.data.results || headphonesRes.data);

                // Filtrar para excluir cualquier artículo que sea marca
                const allArticles = articlesRes.data.results || articlesRes.data;
                const filteredArticles = allArticles.filter(a => a.template !== 'marcas' && a.article_type !== 'marcas');
                setLatestArticles(filteredArticles.slice(0, 6));

                setFeaturedBrands(brandsRes.data.results || brandsRes.data);
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

            {/* Featured Headphones */}
            <section className="section" id="featured">
                <div className="container">
                    <h2 className="section-title">Auriculares Destacados</h2>
                    <div className="grid grid-3">
                        {featuredHeadphones.map(headphone => (
                            <HeadphoneCard key={headphone.id} headphone={headphone} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Articles */}
            <section className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
                <div className="container">
                    <h2 className="section-title">Últimos Artículos</h2>
                    <div className="grid grid-3">
                        {latestArticles.map(article => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                </div>
            </section>

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
