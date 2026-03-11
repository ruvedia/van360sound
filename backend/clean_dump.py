import json
import os

path = '/Users/francervantesruiz/Documents/0_webs/van360sound/backend/db_dump.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

original_len = len(data)
data = [d for d in data if d.get('model') not in ('blog.brand', 'contenttypes.contenttype')]
new_len = len(data)

print(f"Original items: {original_len}, New items: {new_len}")

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Saved clean dump.")
