import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { headphoneService, categoryService } from '../services/api';
import HeadphoneCard from '../components/HeadphoneCard';
import ScoreBar from '../components/ScoreBar';
import { rankings } from '../data/rankingData';
import CommentsSection from '../components/CommentsSection';
import './CategoryPage.css';

function CategoryPage() {
    const { slug } = useParams();
    const [category, setCategory] = useState(null);
    const [headphones, setHeadphones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtenemos datos locales para intro/outro y SEO
                const localRanking = rankings[slug];

                // Siempre intentamos obtener los datos del backend primero
                const [categoryRes, headphonesRes] = await Promise.all([
                    categoryService.getBySlug(slug),
                    headphoneService.getByCategory(slug)
                ]);

                const categoryData = categoryRes.data;

                // Si tenemos datos locales, los usamos para enriquecer (SEO, intro, outro)
                // pero los productos (auriculares) vienen de la BD
                if (localRanking) {
                    setCategory({
                        ...categoryData,
                        description: localRanking.metaDescription || categoryData.description // Preferimos SEO meta del archivo local
                    });

                    // SEO actualizado desde local si existe
                    document.title = localRanking.seoTitle || `${categoryData.name} - Van360Sound`;
                    const metaDesc = document.querySelector('meta[name="description"]');
                    if (metaDesc) {
                        metaDesc.setAttribute('content', localRanking.metaDescription);
                    }
                } else {
                    setCategory(categoryData);
                    document.title = `${categoryData.name} - Van360Sound`;
                }

                // Procesamos los auriculares de la API
                const apiHeadphones = headphonesRes.data.results || headphonesRes.data;
                const sorted = apiHeadphones.sort((a, b) => {
                    // Ordenar por ranking_order explícito
                    if (a.ranking_order && b.ranking_order) return a.ranking_order - b.ranking_order;
                    return new Date(b.created_at) - new Date(a.created_at);
                });

                setHeadphones(sorted);

            } catch (error) {
                console.error('Error fetching data:', error);

                // Fallback: Si falla la API pero tenemos localRanking, usamos eso
                const localRanking = rankings[slug];
                if (localRanking) {
                    console.log('Falling back to local data');
                    setCategory({
                        name: localRanking.title,
                        description: localRanking.metaDescription
                    });

                    const mappedHeadphones = localRanking.headphones.map(h => ({
                        ...h,
                        id: h.ranking_order, // Usamos ranking como ID temporal
                        slug: `${h.brand.toLowerCase()}-${h.name.toLowerCase().replace(/\s+/g, '-')}`,
                        // Mapeo de scores
                        score_soundstage: h.scores.soundstage,
                        score_comfort: h.scores.comfort,
                        score_build: h.scores.build,
                        score_treble: h.scores.treble,
                        score_mids: h.scores.mids,
                        score_bass: h.scores.bass,
                        score_noise_cancelling: h.scores.noise_cancelling || 0,
                        score_transparency: h.scores.transparency || 0,
                        score_call_quality: h.scores.call_quality || 0,
                        score_accuracy: h.scores.accuracy,
                        score_value: h.scores.value,
                        score_overall: h.scores.overall
                    }));
                    setHeadphones(mappedHeadphones);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Reset scroll on slug change
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (!category) {
        return <div className="loading">Categoría no encontrada</div>;
    }

    // Comprobamos si es una página de ranking local
    const localRanking = rankings[slug];
    const isRanking = localRanking || headphones.some(h => h.ranking_order > 0);
    const introData = localRanking ? localRanking.introData : null;
    const outroData = localRanking ? localRanking.outroData : null;

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;

        // Si tenemos una URL de API definida en el entorno (.env), la usamos como base
        const apiBase = import.meta.env.VITE_API_URL;

        if (apiBase) {
            // Si la base es ej: http://localhost:8000/api, le quitamos /api para tener la raíz
            // y concatenamos la ruta de la imagen (ej: /media/...)
            const rootUrl = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase;
            // Aseguramos que no haya doble slash //
            const cleanRoot = rootUrl.endsWith('/') ? rootUrl.slice(0, -1) : rootUrl;
            const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
            return `${cleanRoot}${cleanPath}`;
        }

        return imagePath; // Fallback: ruta relativa (confiando en proxy local)
    };

    const heroImage = getImageUrl(category.image);

    // Helpers para la distribución dinámica de scores
    const getActiveScores = (headphone) => {
        const potentialScores = [
            { label: "Escenario Sonoro", value: headphone.score_soundstage },
            { label: "Confort", value: headphone.score_comfort },
            { label: "Calidad de Construcción", value: headphone.score_build },
            { label: "Tonos Agudos", value: headphone.score_treble },
            { label: "Tonos Medios", value: headphone.score_mids },
            { label: "Tonos Graves", value: headphone.score_bass },
            { label: "Precisión Acústica", value: headphone.score_accuracy },
            { label: "Valor por el Precio", value: headphone.score_value },
            { label: "Cancelación de Ruido", value: headphone.score_noise_cancelling },
            { label: "Modo Transparencia", value: headphone.score_transparency },
            { label: "Calidad de Llamadas", value: headphone.score_call_quality },
        ];
        return potentialScores.filter(s => s.value > 0);
    };

    return (
        <div>
            <section className="hero">
                <div className="container">
                    <h1>{category.name}</h1>
                    <p className="hero-subtitle">{category.description}</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {/* Renderizado de la introducción si existe */}
                    {introData && (
                        <div className="category-intro" style={{ marginBottom: '4rem', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
                            {introData.map((block, idx) => {
                                if (block.type === 'title') return <h2 key={idx} style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>{block.content}</h2>;
                                if (block.type === 'subtitle') return <h3 key={idx} style={{ fontSize: '1.8rem', marginTop: '2.5rem', marginBottom: '1.2rem' }}>{block.content}</h3>;
                                if (block.type === 'paragraph') return <p key={idx} style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem', color: '#444' }} dangerouslySetInnerHTML={{ __html: block.content }} />;
                                return null;
                            })}
                        </div>
                    )}

                    {headphones.length > 0 ? (
                        isRanking ? (
                            <div className="ranking-list">
                                {headphones.map((headphone, index) => (
                                    <article key={headphone.id} className="ranking-item" style={{ marginBottom: '4rem', paddingBottom: '4rem', borderBottom: index < headphones.length - 1 ? '1px solid #eee' : 'none' }}>
                                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
                                            {headphone.ranking_order}. {headphone.brand} {headphone.name}
                                        </h2>

                                        <div className="ranking-grid">
                                            {/* Columna izquierda: Imagen + Botones */}
                                            <div>
                                                <img
                                                    src={headphone.main_image || '/placeholder-headphone.jpg'}
                                                    alt={headphone.name}
                                                    className="ranking-grid-image"
                                                    loading="lazy"
                                                />

                                                {/* Botones debajo de la imagen */}
                                                <div className="ranking-buttons-container">
                                                    {headphone.show_review_button && (
                                                        <Link to={`/auricular/${headphone.slug}`} className="btn btn-primary" style={{ padding: '0.9rem 1.5rem', fontSize: '0.95rem', textAlign: 'center', display: 'block' }}>
                                                            Ver Análisis Detallado
                                                        </Link>
                                                    )}
                                                    {headphone.amazon_link && (
                                                        <a href={headphone.amazon_link} target="_blank" rel="noopener noreferrer" className="btn" style={{ backgroundColor: '#000', color: '#fff', padding: '0.9rem 1.5rem', fontSize: '0.95rem', textAlign: 'center', display: 'block' }}>
                                                            Ver en Amazon
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Columna derecha: Contenido */}
                                            <div>
                                                {/* Descripción */}
                                                <div className="description" style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem', whiteSpace: 'pre-line' }}>
                                                    {headphone.description}
                                                </div>

                                                {/* Características Técnicas */}
                                                <div className="specs-box" style={{ marginBottom: '2rem' }}>
                                                    <h4 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Características Técnicas:</h4>
                                                    <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.8' }}>
                                                        {headphone.acoustic_design && <li><strong>Diseño Acústico:</strong> {headphone.acoustic_design}</li>}
                                                        {headphone.driver_size && <li><strong>Tipo de Driver:</strong> {headphone.driver_size}</li>}
                                                        {headphone.frequency_response && <li><strong>Respuesta de Frecuencia:</strong> {headphone.frequency_response}</li>}
                                                        {headphone.impedance && <li><strong>Impedancia:</strong> {headphone.impedance}</li>}
                                                        {headphone.battery_life && <li><strong>Batería:</strong> {headphone.battery_life}</li>}
                                                        {headphone.connectivity && <li><strong>Conexión:</strong> {headphone.connectivity}</li>}
                                                    </ul>
                                                </div>

                                                {/* Barras en 2 columnas dentro del mismo cuadro */}
                                                <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '12px', marginTop: '2rem' }}>
                                                    <h4 style={{ marginBottom: '1.5rem', borderBottom: '2px solid #333', paddingBottom: '0.5rem', display: 'inline-block' }}>Puntuación:</h4>

                                                    {/* Puntuación Global - versión compacta con colores originales */}
                                                    <div style={{
                                                        backgroundColor: '#fff',
                                                        padding: '1rem',
                                                        borderRadius: '8px',
                                                        marginBottom: '1.2rem',
                                                        border: '1.5px solid #ddd',
                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{
                                                                    color: '#333',
                                                                    fontSize: '0.85rem',
                                                                    fontWeight: '600',
                                                                    marginBottom: '0.5rem'
                                                                }}>
                                                                    Puntuación Global
                                                                </div>
                                                                <div style={{
                                                                    backgroundColor: '#eee',
                                                                    borderRadius: '4px',
                                                                    height: '8px',
                                                                    overflow: 'hidden'
                                                                }}>
                                                                    <div style={{
                                                                        width: `${headphone.score_overall}%`,
                                                                        height: '100%',
                                                                        backgroundColor: headphone.score_overall >= 90 ? '#27ae60' : headphone.score_overall >= 80 ? '#2ecc71' : headphone.score_overall >= 70 ? '#f1c40f' : '#e67e22',
                                                                        borderRadius: '4px',
                                                                        transition: 'width 0.6s ease'
                                                                    }} />
                                                                </div>
                                                            </div>
                                                            <div style={{
                                                                fontSize: '1.2rem',
                                                                fontWeight: '700',
                                                                color: headphone.score_overall >= 90 ? '#27ae60' : headphone.score_overall >= 80 ? '#2ecc71' : headphone.score_overall >= 70 ? '#f1c40f' : '#e67e22',
                                                                minWidth: '50px',
                                                                textAlign: 'right'
                                                            }}>
                                                                {headphone.score_overall}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Puntuaciones detalladas */}
                                                    {/* Puntuaciones detalladas con distribución dinámica */}
                                                    <div className="ranking-scores-grid">
                                                        {(() => {
                                                            const activeScores = getActiveScores(headphone);
                                                            const midPoint = Math.ceil(activeScores.length / 2);
                                                            const leftScores = activeScores.slice(0, midPoint);
                                                            const rightScores = activeScores.slice(midPoint);

                                                            return (
                                                                <>
                                                                    <div>
                                                                        {leftScores.map((score, i) => (
                                                                            <ScoreBar key={i} label={score.label} score={score.value} />
                                                                        ))}
                                                                    </div>
                                                                    <div>
                                                                        {rightScores.map((score, i) => (
                                                                            <ScoreBar key={i} label={score.label} score={score.value} />
                                                                        ))}
                                                                    </div>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-3">
                                {headphones.map(headphone => (
                                    <HeadphoneCard key={headphone.id} headphone={headphone} />
                                ))}
                            </div>
                        )
                    ) : (
                        <p className="text-center">No hay auriculares en esta categoría todavía.</p>
                    )}

                    {/* Renderizado de las definiciones si existen */}
                    {localRanking && localRanking.definitionsData && (
                        <div className="score-definitions" style={{
                            marginBottom: '4rem',
                            maxWidth: '900px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            backgroundColor: '#f8f9fa',
                            padding: '2rem',
                            borderRadius: '12px'
                        }}>
                            <h3 style={{
                                fontSize: '1.8rem',
                                marginBottom: '1.5rem',
                                color: '#111',
                                borderBottom: '2px solid #ddd',
                                paddingBottom: '0.5rem',
                                display: 'inline-block'
                            }}>
                                ¿Qué valoramos en nuestros análisis?
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                                {localRanking.definitionsData.map((def, idx) => (
                                    <div key={idx} className="definition-item">
                                        <h4 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '700',
                                            marginBottom: '0.5rem',
                                            color: '#2c3e50'
                                        }}>
                                            {def.title}
                                        </h4>
                                        <p style={{
                                            fontSize: '0.95rem',
                                            lineHeight: '1.6',
                                            color: '#555',
                                            margin: 0
                                        }}>
                                            {def.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Renderizado de la conclusión si existe */}
                    {outroData && (
                        <div className="category-outro" style={{ marginTop: '4rem', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
                            {outroData.map((block, idx) => {
                                if (block.type === 'subtitle') return <h3 key={idx} style={{ fontSize: '1.8rem', marginTop: '2.5rem', marginBottom: '1.2rem' }}>{block.content}</h3>;
                                if (block.type === 'paragraph') return <p key={idx} style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem', color: '#444' }} dangerouslySetInnerHTML={{ __html: block.content }} />;
                                if (block.type === 'list') return (
                                    <ul key={idx} style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem', paddingLeft: '2rem' }}>
                                        {block.items.map((item, itemIdx) => (
                                            <li key={itemIdx} style={{ marginBottom: '1rem' }} dangerouslySetInnerHTML={{ __html: item }} />
                                        ))}
                                    </ul>
                                );
                                return null;
                            })}
                        </div>
                    )}

                    {/* Sección de comentarios (para cualquier ranking) */}
                    {isRanking && (
                        <div style={{ maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
                            <CommentsSection categorySlug={slug} />
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default CategoryPage;

