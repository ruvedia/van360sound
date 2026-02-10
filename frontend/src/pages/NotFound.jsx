import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

function NotFound() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <SEO title="Página no encontrada" />
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>404</h1>
            <h2 style={{ marginBottom: '1.5rem' }}>Página no encontrada</h2>
            <p style={{ maxWidth: '500px', margin: '0 auto 2rem', color: 'var(--color-text-secondary)' }}>
                Lo sentimos, la página que buscas no existe o ha sido movida.
                Es posible que hayas seguido un enlace roto o que la dirección esté mal escrita.
            </p>
            <Link to="/" className="btn btn-primary">
                Volver al inicio
            </Link>
        </div>
    );
}

export default NotFound;
