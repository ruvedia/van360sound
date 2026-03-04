from django.core.management import call_command
from django.http import FileResponse, Http404, HttpResponse
from django.contrib.admin.views.decorators import staff_member_required
from django.conf import settings
import os
import zipfile
import io
from datetime import datetime

# 2026-03-04 12:40 - Force redeploy Panchromatico
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
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def restore_database(request):
    # Security check: Simple token to prevent random people from resetting the DB
    if request.GET.get('key') != 'van360_emergency_restore':
        return HttpResponse("Unauthorized. Missing or invalid 'key' parameter.", status=403)

    try:
        import json
        dump_path = settings.BASE_DIR / 'db_dump.json'
        if not dump_path.exists():
             return HttpResponse(f"Error: No se encuentra el archivo db_dump.json en {dump_path}", status=404)
        
        # Cargamos y limpiamos los datos en memoria para evitar errores de modelos inexistentes
        with open(dump_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Lista de modelos a excluir (obsoletos o que causan conflictos)
        exclude_models = ['blog.brand', 'contenttypes.contenttype']
        clean_data = [obj for obj in data if obj.get('model') not in exclude_models]
        
        # Guardamos temporalmente el archivo limpio
        temp_dump = settings.BASE_DIR / 'temp_restore.json'
        with open(temp_dump, 'w', encoding='utf-8') as f:
            json.dump(clean_data, f)

        out = io.StringIO()
        # Limpiamos la BD para evitar conflictos de Unique IDs
        call_command('flush', interactive=False, stdout=out)
        
        # Cargamos los datos limpios
        call_command('loaddata', str(temp_dump), stdout=out)
        
        # Limpieza del temporal
        if os.path.exists(temp_dump):
            os.remove(temp_dump)
            
        from django.db import connection
        db_info = f"DB Host: {connection.settings_dict.get('HOST')}, DB Name: {connection.settings_dict.get('NAME')}"
        
        return HttpResponse(f"¡Restauración Completada! {db_info}. Salida: {out.getvalue()}", status=200)
    except Exception as e:
        return HttpResponse(f"Error restaurando base de datos: {str(e)}", status=500)
