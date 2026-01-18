#!/bin/bash

# Script para poblar la base de datos con datos de ejemplo

echo "Creando superusuario y datos de ejemplo..."

./venv/bin/python manage.py shell << EOF
from django.contrib.auth import get_user_model
from blog.models import Category, Headphone, Article

User = get_user_model()

# Crear superusuario si no existe
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@van360sound.com', 'admin123')
    print('✓ Superusuario creado: admin/admin123')

# Crear categorías
categories_data = [
    {'name': 'Noise Cancelling', 'description': 'Auriculares con cancelación activa de ruido', 'order': 1},
    {'name': 'True Wireless', 'description': 'Auriculares completamente inalámbricos', 'order': 2},
    {'name': 'Sport', 'description': 'Auriculares diseñados para deportes', 'order': 3},
    {'name': 'Gaming', 'description': 'Auriculares para gaming profesional', 'order': 4},
    {'name': 'In-Ear', 'description': 'Auriculares intraurales de alta calidad', 'order': 5},
    {'name': 'HiFi', 'description': 'Auriculares de alta fidelidad audiófila', 'order': 6},
]

for cat_data in categories_data:
    category, created = Category.objects.get_or_create(
        name=cat_data['name'],
        defaults=cat_data
    )
    if created:
        print(f'✓ Categoría creada: {category.name}')

# Crear algunos auriculares de ejemplo
headphones_data = [
    {
        'name': 'QuietComfort 45',
        'brand': 'Bose',
        'category': 'Noise Cancelling',
        'description': 'Los mejores auriculares con cancelación de ruido del mercado. Comodidad excepcional y calidad de sonido premium.',
        'price': 329.99,
        'battery_life': '24 horas',
        'connectivity': 'Bluetooth 5.1',
        'rating': 4.8,
        'is_featured': True,
    },
    {
        'name': 'AirPods Pro 2',
        'brand': 'Apple',
        'category': 'True Wireless',
        'description': 'Auriculares true wireless con cancelación de ruido adaptativa y audio espacial personalizado.',
        'price': 279.99,
        'battery_life': '6 horas (30 con estuche)',
        'connectivity': 'Bluetooth 5.3',
        'rating': 4.7,
        'is_featured': True,
    },
    {
        'name': 'Powerbeats Pro',
        'brand': 'Beats',
        'category': 'Sport',
        'description': 'Auriculares deportivos totalmente inalámbricos con gancho para la oreja y resistencia al sudor.',
        'price': 199.99,
        'battery_life': '9 horas',
        'connectivity': 'Bluetooth 5.0',
        'rating': 4.5,
        'is_featured': False,
    },
    {
        'name': 'BlackShark V2 Pro',
        'brand': 'Razer',
        'category': 'Gaming',
        'description': 'Auriculares gaming inalámbricos con THX Spatial Audio y micrófono desmontable.',
        'price': 179.99,
        'driver_size': '50mm',
        'connectivity': 'Wireless 2.4GHz',
        'rating': 4.6,
        'is_featured': True,
    },
    {
        'name': 'IE 300',
        'brand': 'Sennheiser',
        'category': 'In-Ear',
        'description': 'Auriculares in-ear de alta gama con drivers dinámicos de 7mm y cable desmontable.',
        'price': 299.99,
        'driver_size': '7mm',
        'frequency_response': '6Hz - 20kHz',
        'impedance': '16 Ohm',
        'rating': 4.9,
        'is_featured': False,
    },
    {
        'name': 'HD 800 S',
        'brand': 'Sennheiser',
        'category': 'HiFi',
        'description': 'Auriculares de referencia para audiófilos con drivers de 56mm y diseño abierto.',
        'price': 1699.99,
        'driver_size': '56mm',
        'frequency_response': '4Hz - 51kHz',
        'impedance': '300 Ohm',
        'sensitivity': '102 dB',
        'rating': 5.0,
        'is_featured': True,
    },
]

for hp_data in headphones_data:
    category_name = hp_data.pop('category')
    category = Category.objects.get(name=category_name)
    hp_data['category'] = category
    
    headphone, created = Headphone.objects.get_or_create(
        name=hp_data['name'],
        brand=hp_data['brand'],
        defaults=hp_data
    )
    if created:
        print(f'✓ Auricular creado: {headphone.brand} {headphone.name}')

# Crear algunos artículos de ejemplo
articles_data = [
    {
        'title': 'Análisis completo: Bose QuietComfort 45',
        'article_type': 'analisis',
        'excerpt': 'Probamos a fondo los nuevos auriculares con cancelación de ruido de Bose. ¿Merecen la pena?',
        'content': 'Los Bose QuietComfort 45 representan la evolución de una de las series más icónicas...',
        'headphone_name': 'QuietComfort 45',
    },
    {
        'title': 'Apple presenta los nuevos AirPods Pro 2',
        'article_type': 'novedad',
        'excerpt': 'Apple renueva sus auriculares premium con mejor cancelación de ruido y audio espacial mejorado.',
        'content': 'Apple ha presentado oficialmente la segunda generación de los AirPods Pro...',
        'headphone_name': 'AirPods Pro 2',
    },
    {
        'title': 'Guía: Cómo elegir auriculares gaming',
        'article_type': 'guia',
        'excerpt': 'Todo lo que necesitas saber para elegir los mejores auriculares para gaming.',
        'content': 'Elegir auriculares gaming puede ser complicado con tantas opciones en el mercado...',
    },
]

for art_data in articles_data:
    headphone_name = art_data.pop('headphone_name', None)
    if headphone_name:
        try:
            headphone = Headphone.objects.get(name=headphone_name)
            art_data['headphone'] = headphone
        except Headphone.DoesNotExist:
            pass
    
    article, created = Article.objects.get_or_create(
        title=art_data['title'],
        defaults=art_data
    )
    if created:
        print(f'✓ Artículo creado: {article.title}')

print('\n✅ Base de datos poblada correctamente!')
print('Accede al admin en: http://localhost:8000/admin')
print('Usuario: admin')
print('Contraseña: admin123')

EOF
