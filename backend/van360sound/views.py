from django.http import FileResponse
from django.contrib.admin.views.decorators import staff_member_required
from django.conf import settings
import os
import zipfile
import io

@staff_member_required
def download_database(request):
    db_path = settings.BASE_DIR / 'db.sqlite3'
    response = FileResponse(open(db_path, 'rb'))
    response['Content-Disposition'] = 'attachment; filename="db.sqlite3"'
    return response

@staff_member_required
def download_media(request):
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for root, dirs, files in os.walk(settings.MEDIA_ROOT):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, settings.MEDIA_ROOT)
                zip_file.write(file_path, arcname)
    
    buffer.seek(0)
    response = FileResponse(buffer, as_attachment=True, filename='media_backup.zip')
    return response
