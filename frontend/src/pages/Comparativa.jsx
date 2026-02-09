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
                                            {[
                                                { label: 'Driver', key: 'driver_size' },
                                                { label: 'Frecuencia', key: 'frequency_response' },
                                                { label: 'Impedancia', key: 'impedance' },
                                                { label: 'Sensibilidad', key: 'sensitivity' },
                                                { label: 'Conectividad', key: 'connectivity' },
                                                { label: 'Batería', key: 'battery_life', altKey: 'battery_life_hours', suffix: 'h' },
                                                { label: 'Protección', key: 'protection_rating' }
                                            ].map(spec => {
                                                let value = selectedHeadphones[colIndex][spec.key];
                                                if (!value && spec.altKey) {
                                                    value = selectedHeadphones[colIndex][spec.altKey];
                                                    if (value && spec.suffix) value = `${value}${spec.suffix}`;
                                                }

                                                return (
                                                    <div key={spec.label} className="spec-item" style={{ height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span className="spec-label">{spec.label}</span>
                                                        <span className="spec-value" style={{ textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%' }}>
                                                            {value || '-'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="specs-list" style={{ marginTop: '1.5rem' }}>
                                            <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.25rem' }}>Puntuaciones</h4>

                                            {[
                                                { label: 'Global', key: 'score_overall', color: '#007bff', bold: true },
                                                { label: 'Escenario', key: 'score_soundstage' },
                                                { label: 'Confort', key: 'score_comfort' },
                                                { label: 'Construcción', key: 'score_build' },
                                                { label: 'Agudos', key: 'score_treble' },
                                                { label: 'Medios', key: 'score_mids' },
                                                { label: 'Graves', key: 'score_bass' },
                                                { label: 'Precisión', key: 'score_accuracy' },
                                                { label: 'Valor/Precio', key: 'score_value' },
                                                { label: 'ANC', key: 'score_noise_cancelling' },
                                                { label: 'Transparencia', key: 'score_transparency' },
                                                { label: 'Llamadas', key: 'score_call_quality' },
                                            ].map(score => {
                                                const value = selectedHeadphones[colIndex][score.key];
                                                return (
                                                    <div key={score.label} className="spec-item" style={{ height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span className="spec-label">{score.label}</span>
                                                        <span className="spec-value" style={{
                                                            fontWeight: score.bold ? 'bold' : 'normal',
                                                            color: score.color || 'inherit'
                                                        }}>
                                                            {value > 0 ? `${value}/100` : '-'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
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
