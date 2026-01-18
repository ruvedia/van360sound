# Van360Sound.com

Blog de auriculares profesional con React (frontend) y Django (backend).

## Estructura del Proyecto

```
proyecto_web/
├── backend/          # Django REST API
│   ├── van360sound/  # Configuración del proyecto
│   ├── blog/         # App principal con modelos y API
│   ├── manage.py
│   └── requirements.txt
└── frontend/         # React + Vite
    ├── src/
    │   ├── components/  # Componentes reutilizables
    │   ├── pages/       # Páginas de la aplicación
    │   ├── services/    # Servicios API
    │   └── index.css    # Estilos globales
    ├── package.json
    └── vite.config.js
```

## Backend (Django)

### Instalación y Configuración

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Ejecutar el Servidor

```bash
# Aplicar migraciones (ya realizadas)
./venv/bin/python manage.py migrate

# Crear superusuario (ya creado: admin/admin123)
# ./venv/bin/python manage.py createsuperuser

# Iniciar servidor
./venv/bin/python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`
Panel de administración: `http://localhost:8000/admin`

### API Endpoints

- `GET /api/categories/` - Listar categorías
- `GET /api/headphones/` - Listar auriculares
- `GET /api/headphones/?category=slug` - Filtrar por categoría
- `GET /api/headphones/search/?q=query` - Buscar auriculares
- `GET /api/articles/` - Listar artículos
- `GET /api/articles/?type=analisis` - Filtrar por tipo
- `POST /api/contact/` - Enviar mensaje de contacto

## Frontend (React)

### Instalación

**IMPORTANTE**: Necesitas tener Node.js instalado. Si no lo tienes:

```bash
# macOS (con Homebrew)
brew install node

# O descarga desde: https://nodejs.org/
```

Luego instala las dependencias:

```bash
cd frontend
npm install
```

### Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### Build para Producción

```bash
npm run build
```

## Características

### Backend
- ✅ 6 categorías de auriculares (Noise Cancelling, True Wireless, Sport, Gaming, In-Ear, HiFi)
- ✅ Modelos completos con especificaciones técnicas
- ✅ Sistema de artículos (análisis, novedades, guías)
- ✅ API REST con Django REST Framework
- ✅ Panel de administración Django
- ✅ Datos de ejemplo precargados

### Frontend
- ✅ Diseño minimalista con fondo blanco y footer negro
- ✅ Header con navegación completa
- ✅ Páginas: Home, Nuestro Top, Novedades, Análisis, Contacto, Sobre Nosotros
- ✅ Búsqueda de auriculares
- ✅ Responsive design
- ✅ Tipografía moderna (Inter)
- ✅ Integración completa con API Django

## Datos de Ejemplo

El proyecto incluye datos de ejemplo:
- 6 categorías de auriculares
- 6 auriculares de ejemplo (Bose, Apple, Beats, Razer, Sennheiser)
- 3 artículos de blog

## Credenciales de Administración

- **Usuario**: admin
- **Contraseña**: admin123

## Tecnologías Utilizadas

### Backend
- Django 5.0.1
- Django REST Framework 3.14.0
- django-cors-headers 4.3.1
- SQLite (base de datos)

### Frontend
- React 18.2.0
- React Router DOM 6.21.0
- Axios 1.6.2
- Vite 5.0.8

## Próximos Pasos

1. Instalar Node.js si no lo tienes
2. Ejecutar `npm install` en la carpeta frontend
3. Iniciar ambos servidores (backend y frontend)
4. Acceder a http://localhost:5173 para ver la aplicación

## Notas

- El backend debe estar ejecutándose para que el frontend funcione correctamente
- Las imágenes de auriculares se pueden subir desde el panel de administración
- El proxy de Vite redirige las peticiones `/api` y `/media` al backend Django
