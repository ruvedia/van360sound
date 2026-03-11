import { Link } from 'react-router-dom';

function ArticleCard({ article, showExcerpt = true }) {
    const imageUrl = article.featured_image || '/placeholder-article.jpg';
    const date = new Date(article.published_date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Link to={`/articulo/${article.slug}`} className="card article-card">
            <div style={{ padding: 'var(--spacing-sm)', backgroundColor: 'white' }}>
                <img
                    src={imageUrl}
                    alt={article.title}
                    className="card-image"
                    style={{
                        objectFit: article.image_fit || 'contain',
                        borderRadius: '12px',
                        width: '100%',
                        height: '260px',
                        padding: 0 // Remove extra padding to avoid unrounded borders
                    }}
                />
            </div>
            <div className="card-content">
                <span className="category-tag">{article.article_type}</span>
                <h3 className="card-title">{article.title}</h3>
                {showExcerpt && <p className="card-text">{article.excerpt}</p>}
                <div className="card-meta">
                    <span>{date}</span>
                    <span>Por {article.author}</span>
                </div>
            </div>
        </Link>
    );
}

export default ArticleCard;
