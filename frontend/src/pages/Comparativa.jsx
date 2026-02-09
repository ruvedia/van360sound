import { useState, useEffect } from 'react';
import { headphoneService } from '../services/api';
import { Link } from 'react-router-dom';

function Comparativa() {
    const [allHeadphones, setAllHeadphones] = useState([]);
    const [selectedHeadphones, setSelectedHeadphones] = useState([null, null]);
    const [searchQuery, setSearchQuery] = useState(['', '']);
    const [openDropdown, setOpenDropdown] = useState([false, false]);
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
                <div className="container" style={{ overflowX: 'auto' }}>
                    <table className="comparison-table" style={{ width: '100%', minWidth: '300px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                        <thead>
                            <tr>
                                {[0, 1].map((colIndex) => (
                                    <th key={colIndex} style={{ padding: '0.5rem', verticalAlign: 'top', borderBottom: '2px solid #eee', width: '50%' }}>
                                        {selectedHeadphones[colIndex] ? (
                                            <div className="selected-header" style={{ position: 'relative' }}>
                                                <button
                                                    className="remove-btn"
                                                    onClick={() => handleRemoveHeadphone(colIndex)}
                                                    style={{ position: 'absolute', top: 0, right: 0, background: '#ff4444', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', zIndex: 1 }}
                                                    aria-label="Eliminar"
                                                >
                                                    ✕
                                                </button>
                                                <img
                                                    src={selectedHeadphones[colIndex].main_image || selectedHeadphones[colIndex].image}
                                                    alt={selectedHeadphones[colIndex].name}
                                                    style={{ width: '100%', height: '150px', objectFit: 'contain', marginBottom: '0.5rem' }}
                                                />
                                                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', lineHeight: '1.2' }}>
                                                    <Link to={`/auricular/${selectedHeadphones[colIndex].slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                        {selectedHeadphones[colIndex].name}
                                                    </Link>
                                                </h3>
                                            </div>
                                        ) : (
                                            <div className="empty-slot" style={{ padding: '2rem 0', textAlign: 'center' }}>
                                                <div className="search-container" style={{ position: 'relative' }}>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="Buscar model..."
                                                        value={searchQuery[colIndex]}
                                                        onChange={(e) => handleSearch(colIndex, e.target.value)}
                                                        onFocus={() => {
                                                            const newOpen = [...openDropdown];
                                                            newOpen[colIndex] = true;
                                                            setOpenDropdown(newOpen);
                                                        }}
                                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                                                    />
                                                    {openDropdown[colIndex] && (
                                                        <ul className="search-dropdown" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ddd', borderRadius: '0 0 4px 4px', maxHeight: '200px', overflowY: 'auto', zIndex: 10, listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
                                                            {getFilteredHeadphones(colIndex).length > 0 ? (
                                                                getFilteredHeadphones(colIndex).map(headphone => (
                                                                    <li
                                                                        key={headphone.id}
                                                                        onClick={() => handleSelectHeadphone(colIndex, headphone)}
                                                                        style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                                    >
                                                                        <img src={headphone.main_image || headphone.image} alt={headphone.name} style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                                                                        <span style={{ fontSize: '0.8rem' }}>{headphone.name}</span>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li style={{ padding: '0.5rem', color: '#999', fontSize: '0.8rem' }}>Sin resultados</li>
                                                            )}
                                                        </ul>
                                                    )}
                                                </div>
                                                <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.8rem' }}>Añadir</p>
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Description Row */}
                            <tr>
                                {[0, 1].map(colIndex => (
                                    <td key={`desc-${colIndex}`} style={{ padding: '0.5rem', verticalAlign: 'top', borderBottom: '1px solid #eee' }}>
                                        {selectedHeadphones[colIndex] ? (
                                            <p className="comparison-description">
                                                {selectedHeadphones[colIndex].description || ''}
                                            </p>
                                        ) : null}
                                    </td>
                                ))}
                            </tr>

                            {/* Technical Specs Rows */}
                            <tr style={{ background: '#f8f9fa' }}>
                                <td colSpan={2} style={{ padding: '0.5rem', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', color: '#666' }}>Especificaciones</td>
                            </tr>
                            {[
                                { label: 'Driver', key: 'driver_size' },
                                { label: 'Frecuencia', key: 'frequency_response' },
                                { label: 'Impedancia', key: 'impedance' },
                                { label: 'Sensibilidad', key: 'sensitivity' },
                                { label: 'Conectividad', key: 'connectivity' },
                                { label: 'Batería', key: 'battery_life', altKey: 'battery_life_hours', suffix: 'h' },
                                { label: 'Protección', key: 'protection_rating' }
                            ].map(spec => (
                                <tr key={spec.label}>
                                    {[0, 1].map(colIndex => {
                                        let value = '-';
                                        if (selectedHeadphones[colIndex]) {
                                            value = selectedHeadphones[colIndex][spec.key];
                                            if (!value && spec.altKey) {
                                                value = selectedHeadphones[colIndex][spec.altKey];
                                                if (value && spec.suffix) value = `${value}${spec.suffix}`;
                                            }
                                        }
                                        return (
                                            <td key={`${spec.label}-${colIndex}`} style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0', verticalAlign: 'top' }}>
                                                {selectedHeadphones[colIndex] ? (
                                                    <div className="spec-container">
                                                        <span className="spec-label">{spec.label}</span>
                                                        <span className="spec-value">{value || '-'}</span>
                                                    </div>
                                                ) : null}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}

                            {/* Scores Rows */}
                            <tr style={{ background: '#f8f9fa' }}>
                                <td colSpan={2} style={{ padding: '0.5rem', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', color: '#666' }}>Puntuaciones</td>
                            </tr>
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
                            ].map(score => (
                                <tr key={score.label}>
                                    {[0, 1].map(colIndex => {
                                        const headphone = selectedHeadphones[colIndex];
                                        const value = headphone ? headphone[score.key] : 0;
                                        return (
                                            <td key={`${score.label}-${colIndex}`} style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' }}>
                                                {headphone ? (
                                                    <div className="score-container">
                                                        <span className="score-label">{score.label}</span>
                                                        <span className="score-value" style={{
                                                            fontWeight: score.bold ? '800' : '600',
                                                            color: score.color || '#333',
                                                            background: score.bold ? '#e7f1ff' : '#f5f5f5',
                                                        }}>
                                                            {value > 0 ? value : '-'}
                                                        </span>
                                                    </div>
                                                ) : null}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default Comparativa;
