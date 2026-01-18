import { useState, useEffect } from 'react';
import { headphoneService, articleService } from '../services/api';
import HeadphoneCard from '../components/HeadphoneCard';
import ArticleCard from '../components/ArticleCard';

function Home() {
    const [featuredHeadphones, setFeaturedHeadphones] = useState([]);
    const [latestArticles, setLatestArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [headphonesRes, articlesRes] = await Promise.all([
                    headphoneService.getFeatured(),
                    articleService.getAll({ page_size: 6 })
                ]);

                setFeaturedHeadphones(headphonesRes.data.results || headphonesRes.data);
                setLatestArticles(articlesRes.data.results || articlesRes.data);
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
                        {latestArticles.slice(0, 3).map(article => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
