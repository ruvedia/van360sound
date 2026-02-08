import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../services/api';

function ArticleDetail() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await articleService.getBySlug(slug);
                setArticle(response.data);
            } catch (error) {
                console.error('Error fetching article:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    if (loading) {
        return <div className="loading">Cargando artículo...</div>;
    }

    if (!article) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
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
        <article className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>← Volver</Link>
            </div>

            <header style={{ marginBottom: '2rem' }}>
                <span className="category-tag">{article.article_type}</span>
                <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>{article.title}</h1>
                <div style={{ color: '#666', fontSize: '0.9rem', display: 'flex', gap: '1.5rem' }}>
                    <span>Por {article.author}</span>
                    <span>{date}</span>
                    {article.views > 0 && <span>👁 {article.views} lecturas</span>}
                </div>
            </header>

            <img
                src={featuredImage}
                alt={article.title}
                className="card-image"
                style={{ width: '100%', borderRadius: '12px', marginBottom: '2rem', height: 'auto', maxHeight: '600px', objectFit: 'contain', backgroundColor: 'transparent' }}
            />

            <div
                className="article-content"
                style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#333' }}
                dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {article.headphone_name && (
                <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid #eee', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ margin: 0 }}>Auricular mencionado</h4>
                        <p style={{ margin: 0, color: '#666' }}>{article.headphone_name}</p>
                    </div>
                </div>
            )}
        </article>
    );
}

export default ArticleDetail;
