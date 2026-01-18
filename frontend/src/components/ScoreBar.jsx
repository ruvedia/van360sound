function ScoreBar({ label, score, color = '#333' }) {
    // Definimos un color basado en la puntuación si no se proporciona uno
    const getBarColor = (val) => {
        if (val >= 90) return '#27ae60'; // Excelente - Verde
        if (val >= 80) return '#2ecc71'; // Muy bueno - Verde claro
        if (val >= 70) return '#f1c40f'; // Bueno - Amarillo
        return '#e67e22'; // Regular - Naranja
    };

    const barColor = color === '#333' ? getBarColor(score) : color;

    // Etiquetas cualitativas similares al sitio original
    const getQualitative = (val) => {
        if (val >= 95) return 'Perfecta';
        if (val >= 90) return 'Excelente';
        if (val >= 80) return 'Notable';
        if (val >= 70) return 'Buena';
        return 'Regular';
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: '500' }}>
                <span>{label}</span>
                <span style={{ color: '#666' }}>{getQualitative(score)} ({score}%)</span>
            </div>
            <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#eee',
                borderRadius: '4px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${score}%`,
                    height: '100%',
                    backgroundColor: barColor,
                    borderRadius: '4px',
                    transition: 'width 1s ease-out'
                }} />
            </div>
        </div>
    );
}

export default ScoreBar;
