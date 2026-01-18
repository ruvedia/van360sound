import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>Van360Sound</h4>
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                            Tu guía definitiva para encontrar los mejores auriculares.
                            Análisis profesionales, reviews y las últimas novedades del mercado.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4>Navegación</h4>
                        <ul className="footer-links">
                            <li><Link to="/nuestro-top">Nuestro Top</Link></li>
                            <li><Link to="/novedades">Novedades</Link></li>
                            <li><Link to="/analisis">Análisis</Link></li>
                            <li><Link to="/contacto">Contacto</Link></li>
                            <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Categorías</h4>
                        <ul className="footer-links">
                            <li><Link to="/categoria/noise-cancelling">Noise Cancelling</Link></li>
                            <li><Link to="/categoria/true-wireless">True Wireless</Link></li>
                            <li><Link to="/categoria/sport">Sport</Link></li>
                            <li><Link to="/categoria/gaming">Gaming</Link></li>
                            <li><Link to="/categoria/in-ear">In-Ear</Link></li>
                            <li><Link to="/categoria/hifi">HiFi</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Síguenos</h4>
                        <ul className="footer-links">
                            <li><a href="#" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                            <li><a href="#" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                            <li><a href="#" target="_blank" rel="noopener noreferrer">YouTube</a></li>
                            <li><a href="#" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Van360Sound.com - Todos los derechos reservados</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
