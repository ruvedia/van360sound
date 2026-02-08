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
                    <NavLink to="/contacto" className="nav-link" onClick={closeMenu}>
                        Contacto
                    </NavLink>
                    <NavLink to="/sobre-nosotros" className="nav-link" onClick={closeMenu}>
                        Sobre Nosotros
                    </NavLink>
                    <Link to="/buscar" className="search-btn" onClick={closeMenu}>
                        🔍 Buscar
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;
