import { useState } from 'react';
import { headphoneService } from '../services/api';
import HeadphoneCard from '../components/HeadphoneCard';

function Buscar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSearched(true);

        try {
            const response = await headphoneService.search(query);
            setResults(response.data);
        } catch (error) {
            console.error('Error searching:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <section className="hero">
                <div className="container">
                    <h1>Buscar Auriculares</h1>
                    <p className="hero-subtitle">
                        Encuentra exactamente lo que buscas
                    </p>

                    <form onSubmit={handleSearch} style={{ marginTop: 'var(--spacing-2xl)', maxWidth: '600px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Buscar por marca, modelo o característica..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button type="submit" className="btn btn-primary">
                                Buscar
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {loading && <div className="loading">Buscando...</div>}

                    {!loading && searched && (
                        <>
                            <h2 className="section-title">
                                {results.length > 0
                                    ? `${results.length} resultado${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}`
                                    : 'No se encontraron resultados'
                                }
                            </h2>

                            {results.length > 0 && (
                                <div className="grid grid-3">
                                    {results.map(headphone => (
                                        <HeadphoneCard key={headphone.id} headphone={headphone} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Buscar;
