import { useState } from 'react';
import { headphoneService, articleService } from '../services/api';
import HeadphoneCard from '../components/HeadphoneCard';
import ArticleCard from '../components/ArticleCard';

function Buscar() {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState('all'); // all, headphone, analisis, novedad, guia
    const [headphoneResults, setHeadphoneResults] = useState([]);
    const [articleResults, setArticleResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const searchTypes = [
        { id: 'all', label: 'Todo' },
        { id: 'headphone', label: 'Auriculares' },
        { id: 'analisis', label: 'Análisis' },
        { id: 'novedad', label: 'Novedades' },
        { id: 'guia', label: 'Guías' },
    ];

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSearched(true);
        setHeadphoneResults([]);
        setArticleResults([]);

        try {
            const promises = [];

            // Determine what to fetch based on searchType
            if (searchType === 'all' || searchType === 'headphone') {
                promises.push(headphoneService.search(query).then(res => ({ type: 'headphone', data: res.data })));
            }

            if (searchType === 'all') {
                promises.push(articleService.search(query).then(res => ({ type: 'article', data: res.data.results || res.data })));
            } else if (searchType !== 'headphone') {
                // Specific article type
                promises.push(articleService.search(query, searchType).then(res => ({ type: 'article', data: res.data.results || res.data })));
            }

            const results = await Promise.all(promises);

            results.forEach(result => {
                if (result.type === 'headphone') {
                    setHeadphoneResults(result.data);
                } else if (result.type === 'article') {
                    setArticleResults(result.data);
                }
            });

        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const hasResults = headphoneResults.length > 0 || articleResults.length > 0;

    return (
        <div>
            <section className="hero">
                <div className="container">
                    <h1>Buscar en Van360Sound</h1>
                    <p className="hero-subtitle">
                        Encuentra auriculares, análisis, noticias y guías
                    </p>

                    <form onSubmit={handleSearch} style={{ marginTop: 'var(--spacing-xl)', maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="¿Qué estás buscando?"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button type="submit" className="btn btn-primary">
                                Buscar
                            </button>
                        </div>

                        <div className="category-quick-nav" style={{ justifyContent: 'center', gap: '0.5rem' }}>
                            {searchTypes.map(type => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setSearchType(type.id)}
                                    className={`category-pill ${searchType === type.id ? 'active' : ''}`}
                                    style={{
                                        border: '1px solid var(--color-border)',
                                        background: searchType === type.id ? 'var(--color-primary)' : 'white',
                                        color: searchType === type.id ? 'white' : 'var(--color-text-primary)',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </form>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {loading && <div className="loading">Buscando...</div>}

                    {!loading && searched && !hasResults && (
                        <div className="text-center">
                            <h3>No se encontraron resultados para "{query}"</h3>
                            <p>Intenta con otros términos o cambia la categoría de búsqueda.</p>
                        </div>
                    )}

                    {!loading && searched && hasResults && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3xl)' }}>

                            {/* Headphones Results */}
                            {headphoneResults.length > 0 && (
                                <div>
                                    <h2 className="section-title" style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                                        Auriculares ({headphoneResults.length})
                                    </h2>
                                    <div className="grid grid-3">
                                        {headphoneResults.map(headphone => (
                                            <HeadphoneCard key={headphone.id} headphone={headphone} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Articles Results */}
                            {articleResults.length > 0 && (
                                <div>
                                    <h2 className="section-title" style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                                        Artículos ({articleResults.length})
                                    </h2>
                                    <div className="grid grid-3">
                                        {articleResults.map(article => (
                                            <ArticleCard key={article.id} article={article} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Buscar;
