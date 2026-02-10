from django.http import HttpResponse
from django.urls import reverse
from .models import Article, Category, Headphone

def sitemap_view(request):
    """
    Generates a dynamic XML sitemap for Google Search Console.
    Includes:
    - Static pages
    - Categories
    - Headphones
    - Articles
    """
    
    # Base URL (frontend URL) because these links point to the frontend, not the backend API
    # Adjust this to the actual production frontend domain
    base_url = "https://www.van360sound.com"
    
    xml_content = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_content.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    # helper to add url
    def add_url(loc, priority="0.8", changefreq="weekly"):
        xml_content.append('  <url>')
        xml_content.append(f'    <loc>{base_url}{loc}</loc>')
        xml_content.append(f'    <changefreq>{changefreq}</changefreq>')
        xml_content.append(f'    <priority>{priority}</priority>')
        xml_content.append('  </url>')

    # 1. Static Pages
    static_pages = [
        "",              # Home
        "/nuestro-top",
        "/novedades",
        "/analisis",
        "/guia",
        "/comparativa",
        "/sobre-nosotros",
        "/contacto",
        "/buscar",
    ]
    
    for page in static_pages:
        add_url(page, priority="1.0" if page == "" else "0.8", changefreq="daily" if page == "" else "weekly")

    # 2. Categories
    categories = Category.objects.all()
    for cat in categories:
        add_url(f"/categoria/{cat.slug}", priority="0.9", changefreq="weekly")

    # 3. Headphones
    headphones = Headphone.objects.all()
    for hp in headphones:
        add_url(f"/auricular/{hp.slug}", priority="0.8", changefreq="weekly")

    # 4. Articles
    articles = Article.objects.filter(is_published=True)
    for article in articles:
        add_url(f"/articulo/{article.slug}", priority="0.9", changefreq="daily")

    xml_content.append('</urlset>')
    
    return HttpResponse("\n".join(xml_content), content_type="application/xml")
