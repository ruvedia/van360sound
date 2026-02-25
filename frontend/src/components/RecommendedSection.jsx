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
                const response = await articleService.getAll();
                let allArticles = response.data.results || response.data || [];

                if (currentArticleSlug) {
                    allArticles = allArticles.filter(article => article.slug !== currentArticleSlug);
                }

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
        setDragged(false);
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
        const walk = (x - startX) * 2;

        if (Math.abs(walk) > 15) {
            setDragged(true);
        }

        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleClickCapture = (e) => {
        if (dragged) {
            e.preventDefault();
            e.stopPropagation();
            setDragged(false);
        }
    };

    if (loading || articles.length === 0) {
        return null;
    }

    return (
        <section style={{
            marginTop: '5rem',
            padding: '3rem 2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '24px',
            border: '1px solid #eaeaea',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            width: '95vw',
            maxWidth: '1600px',
            marginLeft: 'calc(-47.5vw + 50%)',
            overflow: 'hidden'
        }}>
            <div style={{ marginBottom: '2rem', textAlign: 'left', paddingLeft: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 className="recommended-title" style={{
                    fontSize: '2rem',
                    color: '#1e3a8a',
                    fontFamily: 'var(--font-heading)',
                    margin: '0',
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

            <style>
                {`

                /* Scrollbar personalizada */
                .recommended-carousel::-webkit-scrollbar {
                    height: 12px;
                }
                .recommended-carousel::-webkit-scrollbar-track {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .recommended-carousel::-webkit-scrollbar-thumb {
                    background: #94a3b8;
                    border-radius: 10px;
                    border: 2px solid #e2e8f0;
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
                    flex: 0 0 calc(90vw - 3rem);
                    min-width: 260px;
                    display: flex;
                }

                /* Forzar altura igualada y pie de autor al fondo */
                .recommended-carousel .article-card-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background-color: #ffffff;
                    border-radius: 20px;
                    padding: 1.2rem;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.04);
                    border: 1px solid #f0f0f0;
                    min-height: 100%;
                }

                .recommended-carousel .article-card {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    border: none;
                    box-shadow: none;
                    background: transparent;
                }

                .recommended-carousel .card-content {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }

                .recommended-carousel .card-meta {
                    margin-top: auto; /* Alínea el autor al fondo */
                }

                @media (max-width: 600px) {
                    .recommended-title {
                        font-size: 1.5rem !important;
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
                        flex: 0 0 calc((100% - 3rem) / 3); /* 100% - (2 gaps de 1.5rem) dividido entre 3 */
                    }
                }
                `}
            </style>

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
                    paddingBottom: '1.5rem',
                    scrollSnapType: isDragging ? 'none' : 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'auto',
                    scrollbarColor: '#94a3b8 #e2e8f0',
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}>
                {articles.map(article => (
                    <div key={article.id} className="article-card-wrapper">
                        <ArticleCard article={article} showExcerpt={false} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default RecommendedSection;
