from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    """Categorías de auriculares"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['order', 'name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class Headphone(models.Model):
    """Modelo de auriculares"""
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    brand = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='headphones')
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    show_price = models.BooleanField(default=True, verbose_name='Mostrar Precio')
    show_review_button = models.BooleanField(default=True, verbose_name='Mostrar Botón de Análisis')
    
    # Especificaciones técnicas
    acoustic_design = models.CharField(max_length=100, blank=True, verbose_name='Diseño Acústico')
    driver_size = models.CharField(max_length=50, blank=True, verbose_name='Tamaño del driver')
    frequency_response = models.CharField(max_length=100, blank=True, verbose_name='Respuesta de frecuencia')
    impedance = models.CharField(max_length=50, blank=True, verbose_name='Impedancia')
    sensitivity = models.CharField(max_length=50, blank=True, verbose_name='Sensibilidad')
    battery_life = models.CharField(max_length=100, blank=True, verbose_name='Duración de batería')
    connectivity = models.CharField(max_length=100, blank=True, verbose_name='Conectividad')
    
    # Imágenes
    main_image = models.ImageField(upload_to='headphones/', blank=True, null=True)
    image_2 = models.ImageField(upload_to='headphones/', blank=True, null=True)
    image_3 = models.ImageField(upload_to='headphones/', blank=True, null=True)
    
    # Ratings y Ranking
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    ranking_order = models.IntegerField(default=0, verbose_name='Orden en Ranking')
    is_featured = models.BooleanField(default=False, verbose_name='Destacado')
    amazon_link = models.URLField(blank=True, null=True, verbose_name='Enlace Amazon')

    # Puntuaciones detalladas (0-100)
    score_soundstage = models.IntegerField(default=0, verbose_name='Escenario Sonoro')
    score_comfort = models.IntegerField(default=0, verbose_name='Confort')
    score_build = models.IntegerField(default=0, verbose_name='Calidad de Construcción')
    score_treble = models.IntegerField(default=0, verbose_name='Agudos')
    score_mids = models.IntegerField(default=0, verbose_name='Medios')
    score_bass = models.IntegerField(default=0, verbose_name='Graves')
    score_accuracy = models.IntegerField(default=0, verbose_name='Precisión Acústica')
    score_value = models.IntegerField(default=0, verbose_name='Valor/Precio')
    score_noise_cancelling = models.IntegerField(default=0, verbose_name='Cancelación de Ruido')
    score_transparency = models.IntegerField(default=0, verbose_name='Modo Transparencia')
    score_call_quality = models.IntegerField(default=0, verbose_name='Calidad de Llamadas')
    score_overall = models.IntegerField(default=0, verbose_name='Puntuación Global')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Auricular'
        verbose_name_plural = 'Auriculares'
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.brand}-{self.name}")
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.brand} {self.name}"


class Article(models.Model):
    """Artículos del blog (análisis, novedades, etc.)"""
    ARTICLE_TYPES = [
        ('analisis', 'Análisis'),
        ('novedad', 'Novedad'),
        ('guia', 'Guía'),
        ('comparativa', 'Comparativa'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    article_type = models.CharField(max_length=20, choices=ARTICLE_TYPES, default='analisis')
    excerpt = models.TextField(max_length=300, verbose_name='Extracto')
    content = models.TextField(verbose_name='Contenido')
    
    # Relación con auriculares
    headphone = models.ForeignKey(Headphone, on_delete=models.SET_NULL, null=True, blank=True, related_name='articles')
    
    # Imágenes
    featured_image = models.ImageField(upload_to='articles/', blank=True, null=True)
    
    # Metadata
    author = models.CharField(max_length=100, default='Van360Sound')
    published_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)
    views = models.IntegerField(default=0)
    
    class Meta:
        verbose_name = 'Artículo'
        verbose_name_plural = 'Artículos'
        ordering = ['-published_date']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    """Mensajes de contacto"""
    name = models.CharField(max_length=100, verbose_name='Nombre')
    email = models.EmailField(verbose_name='Email')
    subject = models.CharField(max_length=200, verbose_name='Asunto')
    message = models.TextField(verbose_name='Mensaje')
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False, verbose_name='Leído')
    
    class Meta:
        verbose_name = 'Mensaje de contacto'
        verbose_name_plural = 'Mensajes de contacto'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.subject}"


class Comment(models.Model):
    """Comentarios de usuarios en categorías"""
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='comments',
        verbose_name='Categoría'
    )
    author_name = models.CharField(max_length=100, verbose_name='Nombre del autor')
    author_email = models.EmailField(blank=True, null=True, verbose_name='Email del autor')
    content = models.TextField(verbose_name='Contenido')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    is_approved = models.BooleanField(default=True, verbose_name='Aprobado')
    is_notified = models.BooleanField(default=False, verbose_name='Notificado por email')
    
    class Meta:
        verbose_name = 'Comentario'
        verbose_name_plural = 'Comentarios'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.author_name} en {self.category.name} - {self.created_at.strftime('%d/%m/%Y')}"
