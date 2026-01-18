import { Link } from 'react-router-dom';

function HeadphoneCard({ headphone }) {
    const imageUrl = headphone.main_image || '/placeholder-headphone.jpg';

    return (
        <Link to={`/auricular/${headphone.slug}`} className="card">
            <img
                src={imageUrl}
                alt={`${headphone.brand} ${headphone.name}`}
                className="card-image"
            />
            <div className="card-content">
                <span className="category-tag">{headphone.category_name}</span>
                <h3 className="card-title">{headphone.brand} {headphone.name}</h3>
                <p className="card-text">
                    {headphone.description.substring(0, 100)}...
                </p>
                <div className="card-meta">
                    {headphone.price && (
                        <span>€{headphone.price}</span>
                    )}
                    {headphone.rating > 0 && (
                        <span>⭐ {headphone.rating}/5</span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default HeadphoneCard;
