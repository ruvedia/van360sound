import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Proxy para las peticiones API
app.use('/api', createProxyMiddleware({
    target: process.env.BACKEND_URL || 'https://van360sound-backend.onrender.com',
    changeOrigin: true,
    logger: console,
    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log(`[Proxy] Proxying ${req.method} request to: ${proxyReq.path}`);
        },
        error: (err, req, res) => {
            console.error('[Proxy] Error:', err);
            res.status(500).send('Proxy Error');
        }
    }
}));

// Proxy para archivos media
app.use('/media', createProxyMiddleware({
    target: process.env.BACKEND_URL || 'https://van360sound-backend.onrender.com',
    changeOrigin: true,
}));

// Servir archivos estáticos desde la carpeta dist
app.use(express.static(path.join(__dirname, 'dist')));

// Todas las rutas deben servir index.html para SPA routing
// Usamos un middleware genérico al final para evitar problemas de sintaxis con path-to-regexp
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
