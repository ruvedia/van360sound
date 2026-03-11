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
                    background-color: var(--color-background);
                    border-bottom: 1px solid var(--color-border);
                }
                .header-hidden {
                    transform: translateY(-100%);
                }
                `}
            </style>
            <header className="header">
                <div className="container header-container">
                    <div className="header-top">
                        <Link to="/" className="logo" onClick={closeMenu}>
                            Van360Sound.com
                        </Link>

                        <nav className="top-nav-center">
                            <Link to="/sobre-nosotros" className="top-nav-link">Sobre Nosotros</Link>
                            <Link to="/contacto" className="top-nav-link">Contacto</Link>
                        </nav>

                        <div className="header-right">
                            <Link to="/buscar" className="search-btn" onClick={closeMenu}>
                                🔍 Buscar
                            </Link>
                            <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
                                {mobileMenuOpen ? '✕' : '☰'}
                            </button>
                        </div>
                    </div>

                    <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
                        <div className="mobile-top-links">
                            <NavLink to="/sobre-nosotros" className="nav-link mobile-only" onClick={closeMenu}>
                                Sobre Nosotros
                            </NavLink>
                            <NavLink to="/contacto" className="nav-link mobile-only" onClick={closeMenu}>
                                Contacto
                            </NavLink>
                        </div>
                        <div className="nav-main-links">
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
                            <NavLink to="/marcas" className="nav-link" onClick={closeMenu}>
                                Marcas
                            </NavLink>
                            <NavLink to="/comparativa" className="nav-link" onClick={closeMenu}>
                                Comparativa
                            </NavLink>
                        </div>
                    </nav>
                </div>
            </header>
        </div>
    );
}

export default Header;
