import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que resetea el scroll al principio cuando cambia la ruta
 */
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export default ScrollToTop;
