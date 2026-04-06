# Guía de Despliegue en Railway: Van360Sound

Esta guía explica cómo desplegar el proyecto en **Railway.app**.

## 1. Conectar GitHub
1. Ve a [Railway.app](https://railway.app/) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"New Project"** -> **"Deploy from GitHub repo"**.
3. Selecciona tu repositorio `van360sound`.

## 2. Configuración Monorepo (¡IMPORTANTE!)
Como el proyecto tiene el backend y el frontend en carpetas separadas, **debes configurar el "Root Directory" para cada servicio**. Si no lo haces, Nixpacks no encontrará los archivos de configuración y fallará el build.

### Paso 2.1: El Servicio Backend (Django)
1. Al añadir el repo, entra en los **Settings** del servicio.
2. Busca la sección **"General"** -> **"Root Directory"**.
3. Cambia `/` por `backend`.
4. En **"Build"**, asegúrate de que el **Build Command** sea:
   `pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate`
5. En **"Deploy"**, el **Start Command** debe ser:
   `gunicorn van360sound.wsgi:application`
6. Añade las **Variables de Entorno**:
   - `DATABASE_URL`: (Se añade sola si creas un PostgreSQL en el mismo proyecto)
   - `DJANGO_SECRET_KEY`: (Tu clave secreta)
   - `DJANGO_DEBUG`: `False`
   - `DJANGO_ALLOWED_HOSTS`: `*`
   - `CSRF_TRUSTED_ORIGINS`: `https://tu-frontend.railway.app`

### Paso 2.2: El Servicio Frontend (React)
1. Pulsa el botón **"New"** en tu proyecto y selecciona el mismo repositorio de GitHub otra vez.
2. Entra en los **Settings** de este nuevo servicio.
3. Busca **"General"** -> **"Root Directory"** y cámbialo por `frontend`.
4. En **"Build"**, Railway detectará automáticamente `npm run build`.
5. En **"Variables de Entorno"**:
   - `VITE_API_URL`: `https://tu-backend.railway.app`

---

## Solución al error "Nixpacks build failed"
Si recibes este error, es casi seguro que no has configurado el **Root Directory**. Sigue los pasos anteriores para que Railway busque en las carpetas `backend` o `frontend` en lugar de en la raíz del proyecto.
