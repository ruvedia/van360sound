import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import NuestroTop from './pages/NuestroTop';
import CategoryPage from './pages/CategoryPage';
import Novedades from './pages/Novedades';
import Analisis from './pages/Analisis';
import Contacto from './pages/Contacto';
import SobreNosotros from './pages/SobreNosotros';
import Buscar from './pages/Buscar';
import HeadphoneDetail from './pages/HeadphoneDetail';
import ArticleDetail from './pages/ArticleDetail';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/nuestro-top" element={<NuestroTop />} />
                        <Route path="/categoria/:slug" element={<CategoryPage />} />
                        <Route path="/novedades" element={<Novedades />} />
                        <Route path="/analisis" element={<Analisis />} />
                        <Route path="/contacto" element={<Contacto />} />
                        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
                        <Route path="/buscar" element={<Buscar />} />
                        <Route path="/auricular/:slug" element={<HeadphoneDetail />} />
                        <Route path="/articulo/:slug" element={<ArticleDetail />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
