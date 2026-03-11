import os
import django
import json

# DB Settings
dsn = "postgresql://van360sound_db_user:SBjkPDubaydzJYnpBMOjEf0GejLGqYzA@dpg-d5mjs1kmrvns73f76jig-a.frankfurt-postgres.render.com/van360sound_db"
os.environ['DATABASE_URL'] = dsn
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'van360sound.settings')

# Setup Django
import dj_database_url
from django.conf import settings

# Force override DATABASES
settings.DATABASES['default'] = dj_database_url.config(default=dsn)
django.setup()

from django.core.management import call_command
import io

out = io.StringIO()
err = io.StringIO()

print("Starting injection...")
try:
    # First flush
    call_command('flush', interactive=False, stdout=out, stderr=err)
    print("Flush completed.")
    # Then loaddata
    # Use full path to avoid relative issues
    dump_path = os.path.abspath('backend/db_dump.json')
    call_command('loaddata', dump_path, stdout=out, stderr=err)
    print("Loaddata completed.")
    
    with open('injection_log.txt', 'w') as f:
        f.write("STDOUT:\n")
        f.write(out.getvalue())
        f.write("\nSTDERR:\n")
        f.write(err.getvalue())
    
    print("SUCCESS: Data injected.")
except Exception as e:
    print(f"FAILED: {str(e)}")
    with open('injection_log.txt', 'w') as f:
        f.write(f"ERROR: {str(e)}\n")
        f.write("STDOUT:\n")
        f.write(out.getvalue())
        f.write("\nSTDERR:\n")
        f.write(err.getvalue())
