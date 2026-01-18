# Guía de Despliegue: Van360Sound.com (Render)

Para subir tu proyecto a internet, te recomiendo usar **Render**, ya que es gratuito para sitios estáticos y servicios web pequeños, y muy fácil de configurar.

## Paso 1: Subir el código a GitHub
1. Crea un repositorio nuevo en tu cuenta de GitHub.
2. Sube todo el contenido de la carpeta `proyecto_web` a ese repositorio.

## Paso 2: Despliegue del Backend (Django)
1. Entra en [Render.com](https://render.com) y crea un nuevo **"Web Service"**.
2. Conecta tu repositorio de GitHub.
3. Configura los siguientes parámetros:
   - **Name**: `van360sound-backend`
   - **Environment**: `Python`
   - **Build Command**: `./render-build.sh` (Lo crearemos a continuación)
   - **Start Command**: `gunicorn van360sound.wsgi:application`
4. Añade estas **Variables de Entorno (Environment Variables)**:
   - `DJANGO_SECRET_KEY`: (Cualquier cadena larga y aleatoria)
   - `DJANGO_DEBUG`: `False`
   - `DJANGO_ALLOWED_HOSTS`: `van360sound-backend.onrender.com` (o la URL que te asigne Render)
   - `CORS_ALLOWED_ORIGINS`: `https://van360sound.onrender.com` (tu URL de frontend)

## Paso 3: Despliegue del Frontend (React)
1. Crea un nuevo **"Static Site"** en Render.
2. Conecta el mismo repositorio de GitHub.
3. Configura los parámetros:
   - **Name**: `van360sound`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. En **Redirects/Rewrites**, añade una regla para que todas las rutas apunten a `index.html` (necesario para React Router):
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`

## Paso 4: Configuración de la Base de Datos
> [!NOTE]
> Por defecto, el proyecto usa SQLite. En el plan gratuito de Render, el archivo de la base de datos se borra cada vez que el servidor se reinicia. Para un blog real, te recomiendo crear una **Database (PostgreSQL)** en Render y conectar la URL en el `settings.py`.

---

¿Quieres que te prepare el archivo `render-build.sh` y el `Procfile` para automatizar esto ahora mismo?
