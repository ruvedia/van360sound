import { useState, useEffect, useRef } from 'react';
import { articleService } from '../services/api';
import ArticleCard from './ArticleCard';

function RecommendedSection({ currentArticleSlug }) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

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

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Multiplicador para la velocidad de scroll
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    if (loading || articles.length === 0) {
        return null; // Si no hay recomendaciones o está cargando, no mostramos nada para no entorpecer visualmente
    }

    return (
        <section style={{
            marginTop: '5rem',
            paddingTop: '3rem',
            borderTop: '2px dashed #eaeaea',
            width: '100%',
            maxWidth: '100%', // Ocupa todo el ancho posible
            overflow: 'hidden' // Evitar scrolleo falso por fuera
        }}>
            <h2 style={{
                fontSize: '2rem',
                marginBottom: '2rem',
                textAlign: 'left', // Mejor alineado a la izquierda para un carrusel
                color: '#1e3a8a',
                fontFamily: 'var(--font-heading)',
                paddingLeft: '5%', // Margen fluido para que no pegue a los bordes
                maxWidth: '1200px',
                margin: '0 auto 2rem auto'
            }}>
                Quizás te interese...
            </h2>

            {/* Carrusel con scroll horizontal */}
            <div
                ref={scrollRef}
                className={`recommended-carousel ${isDragging ? 'dragging' : ''}`}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{
                    display: 'flex',
                    gap: '1.5rem',
                    overflowX: 'auto',
                    padding: '1rem 5%', // Padding fluido para asomar los lados
                    scrollSnapType: isDragging ? 'none' : 'x mandatory', // Desactivar snap si arrastramos
                    WebkitOverflowScrolling: 'touch', // Scroll suave en iOS
                    scrollbarWidth: 'none', // Ocultar scrollbar estándar (usamos CSS abajo para Webkit)
                    cursor: isDragging ? 'grabbing' : 'grab', // Cursor de mano
                    msOverflowStyle: 'none' // IE and Edge
                }}>
                <style>
                    {`
                    .recommended-carousel::-webkit-scrollbar {
                        display: none; // Ocultar scrollbar completamente para feeling táctil
                    }
                    .recommended-carousel {
                        user-select: none; /* Prevenir selección de texto al arrastrar */
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
                            flex: 0 0 calc(25vw - 2rem); /* 4 items en desktop para forzar scroll */
                            max-width: 320px;
                        }
                    }
                    /* Desactivar click en links internos si estábamos arrastrando */
                    .dragging a {
                        pointer-events: none;
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
