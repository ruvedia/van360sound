# Guía de Despliegue en Railway: Van360Sound

Esta guía explica cómo desplegar el proyecto en **Railway.app** tras la migración desde Render.

## 1. Conectar GitHub
1. Ve a [Railway.app](https://railway.app/) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"New Project"** -> **"Deploy from GitHub repo"**.
3. Selecciona tu repositorio `van360sound`.

## 2. Configurar el Backend (Django)
Railway detectará el proyecto automáticamente, pero como es un monorepo, es mejor configurar dos servicios separados:

### Servicio Backend
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate`
- **Start Command**: `gunicorn van360sound.wsgi:application`
- **Variables de Entorno**:
    - `DATABASE_URL`: (Se crea automáticamente al añadir una base de datos PostgreSQL en Railway)
    - `DJANGO_SECRET_KEY`: (Tu clave secreta)
    - `DJANGO_DEBUG`: `False`
    - `DJANGO_ALLOWED_HOSTS`: `*` (O la URL de tu servicio backend)
    - `CSRF_TRUSTED_ORIGINS`: `https://tu-frontend.railway.app` (La URL que te asigne Railway para el frontend)
    - `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, etc. (Para el formulario de contacto)

## 3. Configurar el Frontend (React + Vite)
Crea un segundo servicio desde el mismo repositorio para el frontend:

### Servicio Frontend
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: (Railway detectará `npm start` o servirá el `dist` automáticamente si usas un Static Site)
- **Variables de Entorno**:
    - `VITE_API_URL`: `https://tu-backend.railway.app` (La URL que te asigne Railway para el backend)

## 4. Base de Datos
1. En tu proyecto de Railway, haz clic en **"New"** -> **"Database"** -> **"Add PostgreSQL"**.
2. Railway inyectará automáticamente la variable `DATABASE_URL` en tus servicios si están en el mismo proyecto.

## 5. Notas Importantes
- **CORS**: El backend ahora permite añadir orígenes de confianza mediante la variable `CSRF_TRUSTED_ORIGINS` separada por comas.
- **Static Files**: Railway maneja correctamente los archivos estáticos mediante WhiteNoise, que ya está configurado en el proyecto.
