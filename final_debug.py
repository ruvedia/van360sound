import json
import os
import django

# 1. Check local JSON
json_path = 'backend/db_dump.json'
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)
articles_in_json = [d for d in data if d.get('model') == 'blog.article']
categories_in_json = [d for d in data if d.get('model') == 'blog.category']

# 2. Check remote DB
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'van360sound.settings')
os.environ['DATABASE_URL'] = 'postgresql://van360sound_db_user:SBjkPDubaydzJYnpBMOjEf0GejLGqYzA@dpg-d5mjs1kmrvns73f76jig-a.frankfurt-postgres.render.com/van360sound_db'

try:
    import dj_database_url
    from django.conf import settings
    if not settings.configured:
        django.setup()
    from blog.models import Article
    remote_article_count = Article.objects.count()
except Exception as e:
    remote_article_count = f"Error: {str(e)}"

print(f"JSON Articles: {len(articles_in_json)}")
print(f"JSON Categories: {len(categories_in_json)}")
print(f"Remote DB Articles: {remote_article_count}")
