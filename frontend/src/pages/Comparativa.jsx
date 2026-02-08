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
                                        <p className="comparison-desc" title={selectedHeadphones[colIndex].description}>
                                            {selectedHeadphones[colIndex].description && selectedHeadphones[colIndex].description.length > 120
                                                ? `${selectedHeadphones[colIndex].description.substring(0, 120)}...`
                                                : selectedHeadphones[colIndex].description}
                                        </p>
                                        <div className="specs-list">
                                            <div className="spec-item">
                                                <span className="spec-label">Precio</span>
                                                <span className="spec-value">{selectedHeadphones[colIndex].price} €</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-label">Puntuación</span>
                                                <span className="spec-value" style={{ color: '#f39c12', fontWeight: 'bold' }}>
                                                    {selectedHeadphones[colIndex].rating > 0 ? `⭐ ${selectedHeadphones[colIndex].rating}/5` : '-'}
                                                </span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-label">Tipo</span>
                                                <span className="spec-value">{selectedHeadphones[colIndex].type}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-label">Driver</span>
                                                <span className="spec-value">{selectedHeadphones[colIndex].driver_size || '-'}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-label">Frecuencia</span>
                                                <span className="spec-value">{selectedHeadphones[colIndex].frequency_response || '-'}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-label">Impedancia</span>
                                                <span className="spec-value">{selectedHeadphones[colIndex].impedance || '-'}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-label">Sensibilidad</span>
                                                <span className="spec-value">{selectedHeadphones[colIndex].sensitivity || '-'}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-label">Conectividad</span>
                                                <span className="spec-value">{selectedHeadphones[colIndex].connectivity || '-'}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-label">Batería</span>
                                                <span className="spec-value">{selectedHeadphones[colIndex].battery_life || selectedHeadphones[colIndex].battery_life_hours ? `${selectedHeadphones[colIndex].battery_life_hours}h` : '-'}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-label">Cancelación de Ruido</span>
                                                <span className="spec-value">{selectedHeadphones[colIndex].noise_cancelling ? 'Sí' : 'No'}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-label">Micrófono</span>
                                                <span className="spec-value">{selectedHeadphones[colIndex].microphone ? 'Sí' : 'No'}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-label">Resistente al agua</span>
                                                <span className="spec-value">{selectedHeadphones[colIndex].water_resistant ? 'Sí' : 'No'}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-label">Protección</span>
                                                <span className="spec-value">{selectedHeadphones[colIndex].protection_rating || '-'}</span>
                                            </div>
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
