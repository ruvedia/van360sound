import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Servir archivos estáticos desde la carpeta dist
app.use(express.static(path.join(__dirname, 'dist')));

// Todas las rutas deben servir index.html para SPA routing
// Express 5.x requiere sintaxis :0* en lugar de *
app.get('/:0*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
