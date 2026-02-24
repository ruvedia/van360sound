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

                // Usaremos un método simple: tomar hasta 6 al azar garantizando variedad visual
                const shuffled = [...allArticles].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 6);

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
            marginRight: 'auto',
            overflow: 'hidden' // Evitar scrolleo falso por fuera
        }}>
            <h2 style={{
                fontSize: '2rem',
                marginBottom: '2rem',
                textAlign: 'left', // Mejor alineado a la izquierda para un carrusel
                color: '#1e3a8a',
                fontFamily: 'var(--font-heading)',
                paddingLeft: '1rem'
            }}>
                🎵 Quizás también te interese...
            </h2>

            {/* Carrusel con scroll horizontal */}
            <div className="recommended-carousel" style={{
                display: 'flex',
                gap: '1.5rem',
                overflowX: 'auto',
                padding: '1rem',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch', // Scroll suave en iOS
                scrollbarWidth: 'thin', // Firefox
                scrollbarColor: '#ccc transparent',
            }}>
                {/* Scrollbar styles para Webkit insertados globalmente vía class o directamente aquí si lo soporta (preferible usar archivo externo o etiqueta style por compatibilidad) */}
                <style>
                    {`
                    .recommended-carousel::-webkit-scrollbar {
                        height: 8px;
                    }
                    .recommended-carousel::-webkit-scrollbar-track {
                        background: transparent;
                        border-radius: 10px;
                    }
                    .recommended-carousel::-webkit-scrollbar-thumb {
                        background: #ccc;
                        border-radius: 10px;
                    }
                    .recommended-carousel::-webkit-scrollbar-thumb:hover {
                        background: #a8a8a8;
                    }
                    .recommended-carousel > * {
                        scroll-snap-align: start;
                        flex: 0 0 calc(85vw - 2rem); /* Muy ancho en móvil */
                    }
                    @media (min-width: 640px) {
                        .recommended-carousel > * {
                            flex: 0 0 calc(45vw - 2rem); /* 2 items en tablet */
                        }
                    }
                    @media (min-width: 1024px) {
                        .recommended-carousel > * {
                            flex: 0 0 calc(30vw - 2rem); /* ~3 items en desktop */
                            max-width: 350px;
                        }
                    }
                    `}
                </style>
                {articles.map(article => (
                    <div key={article.id} style={{ height: '100%' }}>
                        <ArticleCard article={article} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default RecommendedSection;
