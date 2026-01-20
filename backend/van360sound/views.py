from django.http import FileResponse, Http404, HttpResponse
from django.contrib.admin.views.decorators import staff_member_required
from django.conf import settings
import os
import zipfile
import io
from datetime import datetime

@staff_member_required
def download_database(request):
    db_path = settings.BASE_DIR / 'db.sqlite3'
    if not os.path.exists(db_path):
        return HttpResponse("Base de datos no encontrada / Database not found", status=404)
        
    date_str = datetime.now().strftime('%Y-%m-%d')
    response = FileResponse(open(db_path, 'rb'))
    response['Content-Disposition'] = f'attachment; filename="{date_str}-base_de_datos.sqlite3"'
    return response

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
    response = FileResponse(buffer, as_attachment=True, filename=f'{date_str}-img.zip')
    return response
