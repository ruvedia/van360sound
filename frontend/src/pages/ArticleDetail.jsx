import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../services/api';
import SEO from '../components/SEO';
import CommentsSection from '../components/CommentsSection';
import RecommendedSection from '../components/RecommendedSection';

// Componente para el bloque de índice inicial
const TableOfContents = ({ items, onOpenDrawer }) => {
    if (items.length === 0) return null;

    return (
        <div className="toc-box" style={{
            backgroundColor: '#f1f5f9',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '3rem',
            border: '1px solid #e2e8f0'
        }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                En este artículo:
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {items.map((item, index) => (
                    <li key={item.id} style={{ marginBottom: '0.8rem' }}>
                        <a href={`#${item.id}`} style={{
                            color: '#475569',
                            textDecoration: 'none',
                            fontSize: '1.05rem',
                            display: 'flex',
                            gap: '0.5rem',
                            transition: 'color 0.2s'
                        }}
                            onMouseEnter={(e) => e.target.style.color = '#1e3a8a'}
                            onMouseLeave={(e) => e.target.style.color = '#475569'}
                        >
                            <span style={{ color: '#94a3b8' }}>{index + 1}.</span>
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Componente para el Drawer (Menú lateral)
const TocDrawer = ({ items, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 2000,
                    backdropFilter: 'blur(2px)'
                }}
            />
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '300px',
                height: '100vh',
                backgroundColor: 'white',
                zIndex: 2001,
                padding: '2rem',
                boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideIn 0.3s ease-out'
            }}>
                <style>
                    {`
                    @keyframes slideIn {
                        from { transform: translateX(-100%); }
                        to { transform: translateX(0); }
                    }
                    `}
                </style>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ margin: 0, color: '#1e3a8a' }}>Contenidos</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, overflowY: 'auto' }}>
                    {items.map((item, index) => (
                        <li key={item.id} style={{ marginBottom: '1.2rem' }}>
                            <a
                                href={`#${item.id}`}
                                onClick={onClose}
                                style={{
                                    color: '#334155',
                                    textDecoration: 'none',
                                    fontSize: '1.1rem',
                                    display: 'block',
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                                <span style={{ color: '#94a3b8', marginRight: '0.5rem' }}>{index + 1}.</span>
                                {item.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

function ArticleDetail() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toc, setToc] = useState([]);
    const [processedContent, setProcessedContent] = useState('');
    const [isTocOpen, setIsTocOpen] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await articleService.getBySlug(slug);
                const data = response.data;
                setArticle(data);

                // Procesar el contenido para extraer H2 y añadir IDs
                if (data.content) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data.content, 'text/html');
                    const h2s = doc.querySelectorAll('h2');
                    const tocItems = [];

                    h2s.forEach((h2, index) => {
                        const id = `section-${index}`;
                        h2.id = id;
                        tocItems.push({ id, text: h2.innerText });

                        // Inyectar el botón de menú
                        const menuIcon = '☰';
                        h2.innerHTML = `<span class="h2-menu-trigger" title="Ver índice">${menuIcon}</span>${h2.innerHTML}`;
                        h2.style.display = 'flex';
                        h2.style.alignItems = 'center';
                        h2.style.gap = '10px';
                        h2.style.scrollMarginTop = '100px'; // Para que el scroll no quede debajo del header
                    });

                    // Procesar TABLAS para aplicar diseño Dark Tech y Responsividad automáticamente
                    const tables = doc.querySelectorAll('table');
                    tables.forEach(table => {
                        // Añadir la clase de diseño
                        table.classList.add('table-dark-tech');

                        // Envolver en contenedor responsivo si no lo tiene
                        if (!table.parentElement.classList.contains('table-responsive')) {
                            const wrapper = doc.createElement('div');
                            wrapper.className = 'table-responsive';
                            table.parentNode.insertBefore(wrapper, table);
                            wrapper.appendChild(table);
                        }
                    });

                    setToc(tocItems);
                    setProcessedContent(doc.body.innerHTML);
                }
            } catch (error) {
                console.error('Error fetching article:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    // Delegación de eventos para los botones de menú dentro del HTML inyectado
    useEffect(() => {
        const handleContentClick = (e) => {
            if (e.target.classList.contains('h2-menu-trigger')) {
                setIsTocOpen(true);
            }
        };

        const currentContent = contentRef.current;
        if (currentContent) {
            currentContent.addEventListener('click', handleContentClick);
        }

        return () => {
            if (currentContent) {
                currentContent.removeEventListener('click', handleContentClick);
            }
        };
    }, [processedContent]);

    if (loading) {
        return <div className="loading">Cargando artículo...</div>;
    }

    if (!article) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <SEO title="Artículo no encontrado" />
                <h2>Artículo no encontrado</h2>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Volver al inicio</Link>
            </div>
        );
    }

    const featuredImage = article.featured_image || '/placeholder-article.jpg';
    const date = new Date(article.published_date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <article
            className={`container ${article.template === 'marcas' ? 'template-marcas' : ''}`}
            style={{ padding: '2rem 1rem', maxWidth: '800px' }}
        >
            <SEO
                title={article.title}
                description={article.excerpt}
                image={featuredImage}
                url={`/articulo/${article.slug}`}
                type="article"
            />
            <div style={{ marginBottom: '2rem' }}>
                <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>← Volver</Link>
            </div>

            <header style={{ marginBottom: '2rem', textAlign: 'left' }}>
                {article.template !== 'marcas' && <span className="category-tag">{article.article_type}</span>}
                <h1 className="article-detail-title" style={{ fontSize: article.template === 'marcas' ? 'clamp(1.8rem, 5vw, 2.8rem)' : '', marginBottom: article.template === 'marcas' ? '0.5rem' : '' }}>
                    {article.title}
                </h1>
                {article.template === 'marcas' && (
                    <p style={{ fontSize: '1.2rem', color: '#64748b', marginTop: 0, fontWeight: 500 }}>Perfil de Marca</p>
                )}

                {article.template !== 'marcas' && (
                    <div style={{
                        color: '#666',
                        fontSize: '0.9rem',
                        display: 'flex',
                        gap: '1.5rem',
                        justifyContent: 'flex-start'
                    }}>
                        <span>Por {article.author}</span>
                        <span>{date}</span>
                    </div>
                )}
            </header>

            <img
                src={featuredImage}
                alt={article.title}
                className="card-image"
                style={{
                    width: '100%',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    height: 'auto',
                    maxHeight: '600px',
                    objectFit: 'contain',
                    backgroundColor: 'transparent',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}
            />

            {/* Índice de contenidos inicial */}
            <TableOfContents items={toc} onOpenDrawer={() => setIsTocOpen(true)} />

            <div
                ref={contentRef}
                className="article-content"
                style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#333' }}
                dangerouslySetInnerHTML={{ __html: processedContent || article.content }}
            />

            {/* Menú lateral (Drawer) */}
            <TocDrawer items={toc} isOpen={isTocOpen} onClose={() => setIsTocOpen(false)} />

            <style>
                {`
                .h2-menu-trigger {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    background-color: #f1f5f9;
                    color: #64748b;
                    border-radius: 6px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    user-select: none;
                }
                .h2-menu-trigger:hover {
                    background-color: #e2e8f0;
                    color: #1e3a8a;
                    transform: scale(1.1);
                }
                .article-content h2 {
                    margin-top: 2.5rem;
                }
                
                /* Estilos Plantilla Marcas (Premium Editorial) */
                .template-marcas .article-content {
                    text-align: left;
                    max-width: 750px;
                    margin: 0 auto;
                }
                .template-marcas .article-content p {
                    line-height: 1.8;
                    color: #334155;
                    font-size: 1.15rem;
                    margin-bottom: 1.5rem;
                }
                .template-marcas .article-content img {
                    display: block;
                    margin: 2.5rem auto;
                    max-width: 100%;
                    max-height: 450px;
                    object-fit: contain;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                    border: 1px solid #f1f5f9;
                }
                .template-marcas .article-content h2 {
                    justify-content: flex-start;
                    text-align: left;
                    font-size: 2rem;
                    color: #0f172a;
                    margin-top: 3.5rem;
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.8rem;
                    border-bottom: 2px solid #e2e8f0;
                    position: relative;
                }
                .template-marcas .article-content h2::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 60px;
                    height: 2px;
                    background-color: var(--color-accent);
                }
                `}
            </style>

            {article.headphone_name && (
                <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid #eee', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ margin: 0 }}>Auricular mencionado</h4>
                        <p style={{ margin: 0, color: '#666' }}>{article.headphone_name}</p>
                    </div>
                </div>
            )}

            {/* Sección de Comentarios para Artículos */}
            <CommentsSection type="article" slug={slug} />

            {/* Artículos Recomendados ("Quizás te interese...") */}
            <RecommendedSection currentArticleSlug={slug} />

        </article>
    );
}

export default ArticleDetail;
