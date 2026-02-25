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

                // Usaremos un método simple: tomar hasta 9 al azar garantizando variedad visual
                const shuffled = [...allArticles].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 9);

                setArticles(selected);
            } catch (error) {
                console.error('Error fetching recommended articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommended();
    }, [currentArticleSlug]);

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging]);

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

    const handleDragStart = (e) => {
        e.preventDefault();
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
            width: '95vw', // Ocupa casi todo el ancho de la pantalla
            maxWidth: '1600px', // Ocupa mucho más ancho sin llegar a tocar los bordes del monitor
            marginLeft: 'calc(-47.5vw + 50%)', // TRUCO CSS: Romper el contenedor pequeño del padre (el artículo tiene 800px de máximo) para expandirse al 95% de la pantalla
            overflow: 'hidden'
        }}>
            <div style={{ marginBottom: '2rem', textAlign: 'left', paddingLeft: '5px' }}>
                <h2 className="recommended-title" style={{
                    fontSize: '2rem',
                    color: '#1e3a8a',
                    fontFamily: 'var(--font-heading)',
                    margin: '0 0 0.5rem 0',
                    lineHeight: '1.2'
                }}>
                    Quizás te interese...
                </h2>
                <div className="scroll-hint" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#64748b',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    backgroundColor: '#e2e8f0',
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                }}>
                    <span className="scroll-arrows">← →</span>
                    <span>Desliza para ver más</span>
                </div>
            </div>

            {/* Carrusel con scroll horizontal */}
            <div
                ref={scrollRef}
                className={`recommended-carousel ${isDragging ? 'dragging' : ''}`}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onDragStart={handleDragStart}
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

                    @keyframes pulseArrows {
                        0%, 100% { transform: translateX(0); }
                        50% { transform: translateX(3px); }
                    }
                    .scroll-arrows {
                        display: inline-block;
                        animation: pulseArrows 1.5s infinite ease-in-out;
                        letter-spacing: -2px;
                    }

                    .recommended-carousel {
                        user-select: none;
                    }
                    .recommended-carousel > * {
                        scroll-snap-align: start;
                        flex: 0 0 calc(90vw - 3rem); /* Móvil: casi todo el ancho */
                        min-width: 260px;
                        display: flex;
                    }

                    @media (max-width: 600px) {
                        .recommended-title {
                            font-size: 1.5rem !important; /* Reducir para que quepa en una línea */
                            white-space: nowrap;
                        }
                    }

                    @media (min-width: 640px) {
                        .recommended-carousel > * {
                            flex: 0 0 calc(45vw - 4rem);
                        }
                    }
                    @media (min-width: 1024px) {
                        .recommended-carousel > * {
                            flex: 0 0 calc((100% / 4) - 1.5rem); /* 4 artículos por pantalla para que se vean más pequeños */
                        }
                    }
                    `}
                </style>
                {articles.map(article => (
                    <div key={article.id} style={{
                        height: 'auto',
                        minHeight: '100%',
                        backgroundColor: '#ffffff', // Fondo blanco para cada tarjeta
                        borderRadius: '20px',
                        padding: '1.2rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                        border: '1px solid #f0f0f0',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <ArticleCard article={article} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default RecommendedSection;
