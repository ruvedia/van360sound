import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'van360sound.settings')
django.setup()

from django.contrib.auth import get_user_model

def ensure_admin():
    User = get_user_model()
    username = 'admin'
    password = 'Spiderman-5'
    email = 'admin@van360sound.com'
    
    try:
        if User.objects.filter(username=username).exists():
            print(f"User {username} exists. Updating password...")
            user = User.objects.get(username=username)
            user.set_password(password)
            user.save()
            print("Password updated successfully.")
        else:
            print(f"Creating user {username}...")
            User.objects.create_superuser(username, email, password)
            print("Superuser created successfully.")
    except Exception as e:
        print(f"Error ensuring admin user: {e}")

if __name__ == '__main__':
    ensure_admin()
