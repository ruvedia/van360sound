import { useState, useEffect, useRef } from 'react';
import { articleService } from '../services/api';
import ArticleCard from './ArticleCard';

function RecommendedSection({ currentArticleSlug }) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragged, setDragged] = useState(false);
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
        setDragged(false); // Reiniciamos estado dragged
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

        // Si el usuario se ha movido más de 15 pixels, lo consideramos un drag y no un clic
        if (Math.abs(walk) > 15) {
            setDragged(true);
        }

        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    // Interceptar el clic nativo. Si venimos de un arrastre, anulamos el clic de los links.
    const handleClickCapture = (e) => {
        if (dragged) {
            e.preventDefault();
            e.stopPropagation();
            setDragged(false);
        }
    };

    if (loading || articles.length === 0) {
        return null; // Si no hay recomendaciones o está cargando, no mostramos nada para no entorpecer visualmente
    }

    return (
        <section style={{
            marginTop: '5rem',
            padding: '3rem 2rem', // Padding interno
            backgroundColor: '#f8f9fa', // Fondo suave para hacer efecto caja
            borderRadius: '24px', // Bordes redondeados
            border: '1px solid #eaeaea',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            width: '100%',
            maxWidth: '1200px',
            marginLeft: 'auto',
            marginRight: 'auto',
            overflow: 'hidden'
        }}>
            <h2 style={{
                fontSize: '2rem',
                marginBottom: '2rem',
                textAlign: 'left',
                color: '#1e3a8a',
                fontFamily: 'var(--font-heading)',
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
                onClickCapture={handleClickCapture}
                style={{
                    display: 'flex',
                    gap: '1.5rem',
                    overflowX: 'auto',
                    paddingBottom: '1.5rem', // Espacio para el scrollbar
                    scrollSnapType: isDragging ? 'none' : 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'auto', // Firefox: auto para que sea visible
                    scrollbarColor: '#94a3b8 #e2e8f0', // Firefox colors
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}>
                <style>
                    {`
                    /* Scrollbar grande y cómoda para navegadores Webkit (Chrome, Safari, Edge) */
                    .recommended-carousel::-webkit-scrollbar {
                        height: 12px; /* Más gruesa */
                    }
                    .recommended-carousel::-webkit-scrollbar-track {
                        background: #e2e8f0;
                        border-radius: 10px;
                    }
                    .recommended-carousel::-webkit-scrollbar-thumb {
                        background: #94a3b8;
                        border-radius: 10px;
                        border: 2px solid #e2e8f0; /* Espaciado interno visual */
                    }
                    .recommended-carousel::-webkit-scrollbar-thumb:hover {
                        background: #64748b;
                    }

                    .recommended-carousel {
                        user-select: none;
                    }
                    .recommended-carousel > * {
                        scroll-snap-align: start;
                        flex: 0 0 calc(85vw - 4rem); /* Ancho en móvil compensando el padding */
                    }
                    @media (min-width: 640px) {
                        .recommended-carousel > * {
                            flex: 0 0 calc(45vw - 4rem);
                        }
                    }
                    @media (min-width: 1024px) {
                        .recommended-carousel > * {
                            flex: 0 0 320px; /* Tamaño fijo en desktop para mantener homogeneidad */
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
