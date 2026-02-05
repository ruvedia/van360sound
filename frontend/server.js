import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware global para logging de peticiones
app.use((req, res, next) => {
    console.log(`[Server] ${req.method} ${req.path}`);
    next();
});

// Proxy para API, Media, Admin y Static files del backend
// Proxy Configuration
const backendUrl = process.env.BACKEND_URL || 'https://van360sound-backend.onrender.com';
// Proxy Configuration
const backendUrl = process.env.BACKEND_URL || 'https://van360sound-backend.onrender.com';

const proxyMiddleware = createProxyMiddleware({
    target: backendUrl,
    changeOrigin: true,
    logger: console,
    pathFilter: [
        '/api',
        '/media',
        '/admin',
        '/static',
        '/ckeditor'
    ],
    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log(`[Proxy] Proxying ${req.method} request to: ${proxyReq.path} -> ${backendUrl}`);
        },
        error: (err, req, res) => {
            console.error('[Proxy] Error:', err);
            res.status(500).send('Proxy Error');
        }
    }
});

// Mount proxy at root to preserve paths (Express strips path if mounted on specific route)
app.use(proxyMiddleware);

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
