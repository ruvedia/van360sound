import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'van360sound.settings')
# Test LOCAL first
django.setup()
from blog.models import Article
local_count = Article.objects.count()

# Test REMOTE
os.environ['DATABASE_URL'] = 'postgresql://van360sound_db_user:SBjkPDubaydzJYnpBMOjEf0GejLGqYzA@dpg-d5mjs1kmrvns73f76jig-a.frankfurt-postgres.render.com/van360sound_db'
# We need to re-setup or re-configure DATABASES manually if django.setup() was already called
from django.conf import settings
import dj_database_url

settings.DATABASES['default'] = dj_database_url.config(default=os.environ['DATABASE_URL'])
remote_count = Article.objects.using('default').count()

with open('db_debug_result.json', 'w') as f:
    json.dump({
        'local_articles': local_count,
        'remote_articles': remote_count,
        'has_dj_database_url': dj_database_url is not None
    }, f)
