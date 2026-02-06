import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { headphoneService } from '../services/api';

function HeadphoneDetail() {
    const { slug } = useParams();
    const [headphone, setHeadphone] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHeadphone = async () => {
            try {
                const response = await headphoneService.getBySlug(slug);
                setHeadphone(response.data);
            } catch (error) {
                console.error('Error fetching headphone:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHeadphone();
    }, [slug]);

    if (loading) {
        return <div className="loading">Cargando detalles del auricular...</div>;
    }

    if (!headphone) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h2>Auricular no encontrado</h2>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Volver al inicio</Link>
            </div>
        );
    }

    const mainImage = headphone.main_image || '/placeholder-headphone.jpg';

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>← Volver</Link>
            </div>

            <div className="grid grid-2" style={{ gap: '3rem', alignItems: 'start' }}>
                <div>
                    <img
                        src={mainImage}
                        alt={`${headphone.brand} ${headphone.name}`}
                        className="card-image"
                        style={{ width: '100%', borderRadius: '12px', height: 'auto', maxHeight: '500px', objectFit: 'cover' }}
                    />
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        {headphone.image_2 && <img src={headphone.image_2} alt="Vista 2" style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />}
                        {headphone.image_3 && <img src={headphone.image_3} alt="Vista 3" style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />}
                    </div>
                </div>

                <div>
                    <span className="category-tag">{headphone.category_name}</span>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{headphone.brand} {headphone.name}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        {headphone.show_price && headphone.price && (
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{headphone.price} €</span>
                        )}
                        {headphone.rating > 0 && <span style={{ color: '#f39c12' }}>⭐ {headphone.rating}/5</span>}
                    </div>

                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem', color: '#555' }}>
                        {headphone.description}
                    </p>

                    <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: '12px' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Especificaciones Técnicas</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {headphone.driver_size && (
                                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>Driver</td>
                                        <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{headphone.driver_size}</td>
                                    </tr>
                                )}
                                {headphone.frequency_response && (
                                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>Frecuencia</td>
                                        <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{headphone.frequency_response}</td>
                                    </tr>
                                )}
                                {headphone.impedance && (
                                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>Impedancia</td>
                                        <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{headphone.impedance}</td>
                                    </tr>
                                )}
                                {headphone.sensitivity && (
                                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>Sensibilidad</td>
                                        <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{headphone.sensitivity}</td>
                                    </tr>
                                )}
                                {headphone.battery_life && (
                                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>Batería</td>
                                        <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{headphone.battery_life}</td>
                                    </tr>
                                )}
                                {headphone.protection_rating && (
                                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>Protección</td>
                                        <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{headphone.protection_rating}</td>
                                    </tr>
                                )}
                                {headphone.connectivity && (
                                    <tr>
                                        <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>Conectividad</td>
                                        <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{headphone.connectivity}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeadphoneDetail;
