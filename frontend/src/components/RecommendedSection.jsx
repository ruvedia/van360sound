import { useState, useEffect } from 'react';
import { articleService } from '../services/api';
import ArticleCard from './ArticleCard';

function RecommendedSection({ currentArticleSlug }) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                // Pedir una lista general de artículos (idealmente una mezcla, aquí agarramos los más recientes)
                const response = await articleService.getAll();
                let allArticles = response.data.results || response.data || [];

                // Excluir el artículo que se está leyendo actualmente
                if (currentArticleSlug) {
                    allArticles = allArticles.filter(article => article.slug !== currentArticleSlug);
                }

                // Randomizar un poco o coger los 3 primeros (aquí cogeremos los primeros 3 después de ordenar/barajar si quisiéramos)
                // Usaremos un método simple: tomar 3 al azar garantizando variedad visual
                const shuffled = [...allArticles].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 3);

                setArticles(selected);
            } catch (error) {
                console.error('Error fetching recommended articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommended();
    }, [currentArticleSlug]);

    if (loading || articles.length === 0) {
        return null; // Si no hay recomendaciones o está cargando, no mostramos nada para no entorpecer visualmente
    }

    return (
        <section style={{
            marginTop: '5rem',
            paddingTop: '3rem',
            borderTop: '2px dashed #eaeaea',
            maxWidth: '1200px',
            marginLeft: 'auto',
            marginRight: 'auto'
        }}>
            <h2 style={{
                fontSize: '2rem',
                marginBottom: '2rem',
                textAlign: 'center',
                color: '#1e3a8a',
                fontFamily: 'var(--font-heading)'
            }}>
                🎵 Quizás también te interese...
            </h2>

            {/* Reusamos la grilla de 3 columnas del blog para mantener consistencia */}
            <div className="grid grid-3">
                {articles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </section>
    );
}

export default RecommendedSection;
