import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { categoryService } from '../services/api';

function Footer() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAll();
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories for footer:", error);
            }
        };

        fetchCategories();
    }, []);

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
                            <li><Link to="/guia">Guía</Link></li>
                            <li><Link to="/comparativa">Comparativa</Link></li>
                            <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Categorías</h4>
                        <ul className="footer-links">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <Link to={`/categoria/${category.slug}`}>
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
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
                    <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
                        Página creada por <a href="https://www.ruvedia.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>ruvedia.com</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
