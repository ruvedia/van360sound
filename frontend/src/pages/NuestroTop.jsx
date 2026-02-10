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
            <section className="hero" style={{ padding: 'var(--spacing-xl) 0 var(--spacing-md)' }}>
                <div className="container">
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>Nuestro Top de Auriculares</h1>
                    <p className="hero-subtitle" style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-lg)' }}>
                        Explora las mejores categorías de auriculares seleccionadas por expertos
                    </p>

                    <div className="category-quick-nav" style={{ marginTop: 'var(--spacing-md)' }}>
                        {categories.map(category => (
                            <Link
                                key={category.id}
                                to={`/categoria/${category.slug}`}
                                className="category-pill"
                                style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section" style={{ padding: 'var(--spacing-xl) 0' }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                        {categories.map(category => (
                            <Link
                                key={category.id}
                                to={`/categoria/${category.slug}`}
                                className="card card-horizontal"
                            >
                                {category.image && (
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className={`card-image card-image-${category.slug}`}
                                    />
                                )}
                                <div className="card-content">
                                    <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{category.name}</h3>
                                    <p className="card-text">
                                        {category.meta_description || category.description}
                                    </p>
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
