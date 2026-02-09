import { useState, useEffect } from 'react';
import { headphoneService } from '../services/api';
import { Link } from 'react-router-dom';

function Comparativa() {
    const [allHeadphones, setAllHeadphones] = useState([]);
    const [selectedHeadphones, setSelectedHeadphones] = useState([null, null, null]);
    const [searchQuery, setSearchQuery] = useState(['', '', '']);
    const [openDropdown, setOpenDropdown] = useState([false, false, false]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHeadphones = async () => {
            try {
                const response = await headphoneService.getAll({ page_size: 1000 });
                setAllHeadphones(response.data.results || response.data);
            } catch (error) {
                console.error('Error getting headphones:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHeadphones();
    }, []);

    const handleSearch = (index, value) => {
        const newQueries = [...searchQuery];
        newQueries[index] = value;
        setSearchQuery(newQueries);

        if (!openDropdown[index]) {
            const newOpen = [...openDropdown];
            newOpen[index] = true;
            setOpenDropdown(newOpen);
        }
    };

    const handleSelectHeadphone = (index, headphone) => {
        const newSelected = [...selectedHeadphones];
        newSelected[index] = headphone;
        setSelectedHeadphones(newSelected);

        const newQueries = [...searchQuery];
        newQueries[index] = '';
        setSearchQuery(newQueries);

        const newOpen = [...openDropdown];
        newOpen[index] = false;
        setOpenDropdown(newOpen);
    };

    const handleRemoveHeadphone = (index) => {
        const newSelected = [...selectedHeadphones];
        newSelected[index] = null;
        setSelectedHeadphones(newSelected);
    };

    const toggleDropdown = (index) => {
        const newOpen = [...openDropdown];
        newOpen[index] = !newOpen[index];
        setOpenDropdown(newOpen);
    };

    const getFilteredHeadphones = (index) => {
        const query = searchQuery[index].toLowerCase();
        return allHeadphones.filter(h =>
            h.name.toLowerCase().includes(query) &&
            !selectedHeadphones.some(s => s && s.id === h.id) // Exclude already selected
        );
    };

    if (loading) {
        return <div className="loading">Cargando comparador...</div>;
    }

    return (
        <div>
            <section className="hero">
                <div className="container">
                    <h1 className="hero-title">Comparativa de Auriculares</h1>
                    <p className="hero-subtitle">
                        Compara las especificaciones técnicas de hasta 3 modelos
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="comparison-grid">
                        {[0, 1, 2].map((colIndex) => (
                            <div key={colIndex} className="comparison-col">
                                {selectedHeadphones[colIndex] ? (
                                    <div className="selected-headphone-card">
                                        <button
                                            className="remove-btn"
                                            onClick={() => handleRemoveHeadphone(colIndex)}
                                            aria-label="Eliminar"
                                        >
                                            ✕
                                        </button>
                                        <img
                                            src={selectedHeadphones[colIndex].main_image || selectedHeadphones[colIndex].image}
                                            alt={selectedHeadphones[colIndex].name}
                                            className="comparison-img"
                                        />
                                        <h3 className="comparison-name">
                                            <Link to={`/auricular/${selectedHeadphones[colIndex].slug}`}>
                                                {selectedHeadphones[colIndex].name}
                                            </Link>
                                        </h3>
                                        <p className="comparison-desc">
                                            {selectedHeadphones[colIndex].description || ''}
                                        </p>
                                        <div className="specs-list">
                                            {selectedHeadphones[colIndex].driver_size && (
                                                <div className="spec-item">
                                                    <span className="spec-label">Driver</span>
                                                    <span className="spec-value">{selectedHeadphones[colIndex].driver_size}</span>
                                                </div>
                                            )}

                                            {selectedHeadphones[colIndex].frequency_response && (
                                                <div className="spec-item">
                                                    <span className="spec-label">Frecuencia</span>
                                                    <span className="spec-value">{selectedHeadphones[colIndex].frequency_response}</span>
                                                </div>
                                            )}

                                            {selectedHeadphones[colIndex].impedance && (
                                                <div className="spec-item">
                                                    <span className="spec-label">Impedancia</span>
                                                    <span className="spec-value">{selectedHeadphones[colIndex].impedance}</span>
                                                </div>
                                            )}

                                            {selectedHeadphones[colIndex].sensitivity && (
                                                <div className="spec-item">
                                                    <span className="spec-label">Sensibilidad</span>
                                                    <span className="spec-value">{selectedHeadphones[colIndex].sensitivity}</span>
                                                </div>
                                            )}

                                            {selectedHeadphones[colIndex].connectivity && (
                                                <div className="spec-item">
                                                    <span className="spec-label">Conectividad</span>
                                                    <span className="spec-value">{selectedHeadphones[colIndex].connectivity}</span>
                                                </div>
                                            )}

                                            {(selectedHeadphones[colIndex].battery_life || selectedHeadphones[colIndex].battery_life_hours) && (
                                                <div className="spec-item">
                                                    <span className="spec-label">Batería</span>
                                                    <span className="spec-value">
                                                        {selectedHeadphones[colIndex].battery_life ||
                                                            `${selectedHeadphones[colIndex].battery_life_hours}h`}
                                                    </span>
                                                </div>
                                            )}

                                            {selectedHeadphones[colIndex].protection_rating && (
                                                <div className="spec-item">
                                                    <span className="spec-label">Protección</span>
                                                    <span className="spec-value">{selectedHeadphones[colIndex].protection_rating}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="specs-list" style={{ marginTop: '1.5rem' }}>
                                            <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.25rem' }}>Puntuaciones</h4>

                                            {[
                                                { label: 'Global', value: selectedHeadphones[colIndex].score_overall, color: '#007bff' },
                                                { label: 'Escenario Sonoro', value: selectedHeadphones[colIndex].score_soundstage },
                                                { label: 'Confort', value: selectedHeadphones[colIndex].score_comfort },
                                                { label: 'Construcción', value: selectedHeadphones[colIndex].score_build },
                                                { label: 'Agudos', value: selectedHeadphones[colIndex].score_treble },
                                                { label: 'Medios', value: selectedHeadphones[colIndex].score_mids },
                                                { label: 'Graves', value: selectedHeadphones[colIndex].score_bass },
                                                { label: 'Precisión', value: selectedHeadphones[colIndex].score_accuracy },
                                                { label: 'Valor/Precio', value: selectedHeadphones[colIndex].score_value },
                                                { label: 'ANC', value: selectedHeadphones[colIndex].score_noise_cancelling },
                                                { label: 'Transparencia', value: selectedHeadphones[colIndex].score_transparency },
                                                { label: 'Llamadas', value: selectedHeadphones[colIndex].score_call_quality },
                                            ].map(score => (
                                                score.value > 0 && (
                                                    <div key={score.label} className="spec-item" style={{ justifyContent: 'space-between' }}>
                                                        <span className="spec-label">{score.label}</span>
                                                        <span className="spec-value" style={{ fontWeight: 'bold', color: score.color || 'inherit' }}>
                                                            {score.value}/100
                                                        </span>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="empty-slot">
                                        <div className="search-container">
                                            <input
                                                type="text"
                                                className="form-input search-input"
                                                placeholder="Buscar auricular..."
                                                value={searchQuery[colIndex]}
                                                onChange={(e) => handleSearch(colIndex, e.target.value)}
                                                onFocus={() => {
                                                    const newOpen = [...openDropdown];
                                                    newOpen[colIndex] = true;
                                                    setOpenDropdown(newOpen);
                                                }}
                                            />
                                            {openDropdown[colIndex] && (
                                                <ul className="search-dropdown">
                                                    {getFilteredHeadphones(colIndex).length > 0 ? (
                                                        getFilteredHeadphones(colIndex).map(headphone => (
                                                            <li
                                                                key={headphone.id}
                                                                onClick={() => handleSelectHeadphone(colIndex, headphone)}
                                                            >
                                                                <img src={headphone.main_image || headphone.image} alt={headphone.name} className="dropdown-thumb" />
                                                                <span>{headphone.name}</span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="no-results">No se encontraron resultados</li>
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                        <p className="empty-text">Selecciona un auricular</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Comparativa;
