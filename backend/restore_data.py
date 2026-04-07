import os
import django
import sys

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'van360sound.settings')
django.setup()

from django.core.management import call_command
from django.contrib.contenttypes.models import ContentType

def restore():
    print("--- Iniciando restauración de datos en Railway ---")
    
    # 1. Limpiar ContentTypes para evitar conflictos de IDs
    # Esto es necesario cuando se restaura un dump completo en una base de datos nueva
    print("Limpiando ContentTypes antiguos...")
    ContentType.objects.all().delete()
    
    # 2. Cargar el dump
    dump_file = 'db_dump.json'
    if not os.path.exists(dump_file):
        print(f"Error: No se encuentra el archivo {dump_file}")
        return

    print(f"Cargando datos desde {dump_file}...")
    try:
        call_command('loaddata', dump_file)
        print("✅ Datos restaurados con éxito.")
        print("Ahora deberías poder entrar al /admin con tu usuario 'admin_van360'")
    except Exception as e:
        print(f"❌ Error durante la carga: {e}")

if __name__ == "__main__":
    restore()
