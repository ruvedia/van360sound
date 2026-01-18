import { useState, useEffect } from 'react';
import { articleService } from '../services/api';
import ArticleCard from '../components/ArticleCard';

function Novedades() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await articleService.getByType('novedad');
                setArticles(response.data.results || response.data);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <div className="loading">Cargando novedades...</div>;
    }

    return (
        <div>
            <section className="hero">
                <div className="container">
                    <h1>Novedades</h1>
                    <p className="hero-subtitle">
                        Las últimas noticias y lanzamientos del mundo de los auriculares
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
                        <p className="text-center">No hay novedades disponibles todavía.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Novedades;
