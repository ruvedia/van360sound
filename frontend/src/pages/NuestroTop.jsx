import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/api';

function NuestroTop() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAll();
                setCategories(response.data.results || response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <div className="loading">Cargando categorías...</div>;
    }

    return (
        <div>
            <section className="hero">
                <div className="container">
                    <h1>Nuestro Top de Auriculares</h1>
                    <p className="hero-subtitle">
                        Explora las mejores categorías de auriculares seleccionadas por expertos
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="grid grid-3">
                        {categories.map(category => (
                            <Link
                                key={category.id}
                                to={`/categoria/${category.slug}`}
                                className="card"
                                style={{ textAlign: 'center' }}
                            >
                                {category.image && (
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className={`card-image card-image-${category.slug}`}
                                    />
                                )}
                                <div className="card-content">
                                    <h3 className="card-title">{category.name}</h3>
                                    <p className="card-text">{category.description}</p>
                                    <div className="card-meta">
                                        <span>{category.headphones_count} auriculares</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default NuestroTop;
