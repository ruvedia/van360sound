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
        # Use simple os.path to locate db.sqlite3
        db_path = settings.DATABASES['default']['NAME']
        
        # Check if it's a string path (SQLite local)
        if hasattr(db_path, 'resolve'): # If it's a Path object
             db_path = str(db_path)

        if not os.path.exists(db_path):
             return HttpResponse("Database file not found", status=404)

        return FileResponse(
            open(db_path, 'rb'),
            as_attachment=True,
            filename=f'{date_str}-db.sqlite3',
            content_type='application/x-sqlite3'
        )
    except Exception as e:
        return HttpResponse(f"Error generando backup: {str(e)}", status=500)

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
