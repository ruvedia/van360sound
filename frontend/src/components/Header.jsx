import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div className="header-wrapper">
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
