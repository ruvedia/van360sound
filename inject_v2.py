import os
import django
import json
import sys

log_file = "/Users/francervantesruiz/Documents/0_webs/van360sound/injection_report.txt"

def log(msg):
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(str(msg) + "\n")
    print(msg)

if os.path.exists(log_file):
    os.remove(log_file)

log("--- Starting Injection Report ---")

# DB Settings
dsn = "postgresql://van360sound_db_user:SBjkPDubaydzJYnpBMOjEf0GejLGqYzA@dpg-d5mjs1kmrvns73f76jig-a.frankfurt-postgres.render.com/van360sound_db"
os.environ['DATABASE_URL'] = dsn
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'van360sound.settings')

try:
    import dj_database_url
    from django.conf import settings
    settings.DATABASES['default'] = dj_database_url.config(default=dsn)
    
    log(f"Configured DB: {settings.DATABASES['default'].get('NAME')}")
    
    django.setup()
    from blog.models import Article
    
    log(f"Pre-injection remote count: {Article.objects.count()}")
    
    # Load JSON
    json_path = "/Users/francervantesruiz/Documents/0_webs/van360sound/backend/db_dump.json"
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    articles_in_json = [d for d in data if d.get('model') == 'blog.article']
    log(f"Articles in JSON: {len(articles_in_json)}")
    
    from django.core.management import call_command
    import io
    
    out = io.StringIO()
    log("Running loaddata...")
    call_command('loaddata', json_path, stdout=out)
    log("Loaddata output captured.")
    log(out.getvalue())
    
    log(f"Post-injection remote count: {Article.objects.count()}")
    log("--- Report Finished Successfully ---")

except Exception as e:
    log(f"CRITICAL ERROR: {str(e)}")
    import traceback
    log(traceback.format_exc())
