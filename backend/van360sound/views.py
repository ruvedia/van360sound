from django.core.management import call_command
from django.http import FileResponse, Http404, HttpResponse
from django.contrib.admin.views.decorators import staff_member_required
from django.conf import settings
import os
import zipfile
import io
from datetime import datetime

@staff_member_required
def download_database(request):
    try:
        date_str = datetime.now().strftime('%Y-%m-%d')
        
        # Intento 1: Usar la configuración de Django
        db_name = settings.DATABASES['default']['NAME']
        
        # Intento 2: Construir ruta explícita al archivo db.sqlite3
        # Esto soluciona problemas si settings.NAME es relativo o si se usa dj_database_url de forma extraña
        explicit_path = os.path.join(settings.BASE_DIR, 'db.sqlite3')

        final_path = None
        
        if os.path.exists(str(db_name)) and os.path.isfile(str(db_name)):
            final_path = str(db_name)
        elif os.path.exists(explicit_path) and os.path.isfile(explicit_path):
            final_path = explicit_path
            
        if not final_path:
             engine = settings.DATABASES['default']['ENGINE']
             return HttpResponse(f"Error: No se encuentra el archivo 'db.sqlite3'. \nMotor de base de datos actual: {engine}. \nSi usas PostgreSQL, esta opción no funciona (usa JSON).", status=404)

        return FileResponse(
            open(final_path, 'rb'),
            as_attachment=True,
            filename=f'{date_str}-db.sqlite3',
            content_type='application/x-sqlite3'
        )
    except Exception as e:
        return HttpResponse(f"Error interno generando descarga: {str(e)}", status=500)

@staff_member_required
def download_media(request):
    buffer = io.BytesIO()
    date_str = datetime.now().strftime('%Y-%m-%d')
    
    # Verificar si existe el directorio media
    if not os.path.exists(settings.MEDIA_ROOT):
         # Crear un zip vacío si no hay media
         with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
             pass
    else:
        with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for root, dirs, files in os.walk(settings.MEDIA_ROOT):
                for file in files:
                    file_path = os.path.join(root, file)
                    # Create relative path for zip to avoid full directory structure
                    arcname = os.path.relpath(file_path, settings.MEDIA_ROOT)
                    try:
                        zip_file.write(file_path, arcname)
                    except Exception as e:
                        print(f"Error zipping file {file}: {e}")
    
    buffer.seek(0)
    return FileResponse(
        buffer,
        as_attachment=True,
        filename=f'{date_str}-img.zip',
        content_type='application/zip'
    )
