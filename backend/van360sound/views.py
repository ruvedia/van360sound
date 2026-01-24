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
        # dumpdata writes text, so we need StringIO
        buffer = io.StringIO()
        
        # Dump data to buffer using the 'dumpdata' management command.
        # We exclude 'contenttypes' and 'auth.permission' because they often cause 
        # issues when loading data into a fresh database.
        call_command('dumpdata', exclude=['contenttypes', 'auth.permission'], stdout=buffer)
        
        # Convert string content to bytes for file response
        buffer.seek(0)
        json_content = buffer.getvalue().encode('utf-8')
        byte_buffer = io.BytesIO(json_content)
        
        return FileResponse(
            byte_buffer,
            as_attachment=True,
            filename=f'{date_str}-base_de_datos.json',
            content_type='application/json'
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
