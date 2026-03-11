import os
import django
import sqlite3

# Try raw sqlite3 first to avoid django setup issues
try:
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()
    cursor.execute("SELECT count(*) FROM blog_article")
    count = cursor.fetchone()[0]
    result = f"SQLITE_ARTICLE_COUNT:{count}"
except Exception as e:
    result = f"SQLITE_ERROR:{str(e)}"

with open('/Users/francervantesruiz/Documents/0_webs/van360sound/sqlite_check.txt', 'w') as f:
    f.write(result)
