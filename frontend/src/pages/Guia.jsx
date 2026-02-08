import { useState, useEffect } from 'react';
import { articleService } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import SEO from '../components/SEO';

function Guia() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await articleService.getByType('guia');
                setArticles(response.data.results || response.data);
            } catch (error) {
                console.error('Error fetching guide articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <div className="loading">Cargando guías...</div>;
    }

    return (
        <div>
            <SEO
                title="Guías y Tutoriales"
                description="Aprende todo sobre el audio de alta fidelidad, cómo elegir auriculares y consejos para sacar el máximo partido a tu equipo."
                url="/guia"
            />
            <section className="hero">
                <div className="container">
                    <h1>Guías y Tutoriales</h1>
                    <p className="hero-subtitle">
                        Consejos expertos y tutoriales para entender el mundo del audio
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {articles.length > 0 ? (
                        <div className="grid grid-3">
                            {articles.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center">No hay guías disponibles todavía.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Guia;
