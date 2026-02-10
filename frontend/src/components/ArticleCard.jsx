import { Link } from 'react-router-dom';

function ArticleCard({ article }) {
    const imageUrl = article.featured_image || '/placeholder-article.jpg';
    const date = new Date(article.published_date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Link to={`/articulo/${article.slug}`} className="card article-card">
            <img
                src={imageUrl}
                alt={article.title}
                className="card-image"
            />
            <div className="card-content">
                <span className="category-tag">{article.article_type}</span>
                <h3 className="card-title">{article.title}</h3>
                <p className="card-text">{article.excerpt}</p>
                <div className="card-meta">
                    <span>{date}</span>
                    <span>Por {article.author}</span>
                    {article.views > 0 && <span>👁 {article.views} vistas</span>}
                </div>
            </div>
        </Link>
    );
}

export default ArticleCard;
