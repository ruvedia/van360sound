import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const location = useLocation();

    const toggleMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMenu = () => {
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Si el menú móvil está abierto, no escondemos el header
            if (mobileMenuOpen) return;

            // Mostrar el header si subimos (scroll up) o si estamos muy arriba
            if (currentScrollY < lastScrollY || currentScrollY < 100) {
                setIsHeaderVisible(true);
            }
            // Esconder el header si bajamos (scroll down) y ya pasamos la zona inicial
            else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
                setIsHeaderVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY, mobileMenuOpen]);

    // Cerramos el menú siempre que cambiamos de ruta
    useEffect(() => {
        closeMenu();
        // Al cambiar de página aseguramos que el header se vea
        setIsHeaderVisible(true);
    }, [location.pathname]);

    return (
        <div className={`header-wrapper ${!isHeaderVisible ? 'header-hidden' : ''}`}>
            <style>
                {`
                .header-wrapper {
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    transition: transform 0.3s cubic-bezier(0.33, 1, 0.68, 1);
                }
                .header-hidden {
                    transform: translateY(-100%);
                }
                `}
            </style>
            <div className="top-bar">
                <div className="container top-bar-container">
                    <nav className="top-nav">
                        <Link to="/sobre-nosotros" className="top-nav-link">Sobre Nosotros</Link>
                        <Link to="/contacto" className="top-nav-link">Contacto</Link>
                    </nav>
                </div>
            </div>
            <header className="header">
                <div className="container header-container">
                    <Link to="/" className="logo" onClick={closeMenu}>
                        Van360Sound.com
                    </Link>

                    <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>

                    <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
                        <NavLink to="/nuestro-top" className="nav-link" onClick={closeMenu}>
                            Nuestro Top
                        </NavLink>
                        <NavLink to="/novedades" className="nav-link" onClick={closeMenu}>
                            Novedades
                        </NavLink>
                        <NavLink to="/analisis" className="nav-link" onClick={closeMenu}>
                            Análisis
                        </NavLink>
                        <NavLink to="/guia" className="nav-link" onClick={closeMenu}>
                            Guía
                        </NavLink>
                        <NavLink to="/comparativa" className="nav-link" onClick={closeMenu}>
                            Comparativa
                        </NavLink>
                        <Link to="/buscar" className="search-btn" onClick={closeMenu}>
                            🔍 Buscar
                        </Link>
                    </nav>
                </div>
            </header>
        </div>
    );
}

export default Header;
