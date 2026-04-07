from django.db import models
from django.utils.text import slugify
from ckeditor_uploader.fields import RichTextUploadingField

class Category(models.Model):
    """Categorías de auriculares"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # SEO Fields
    seo_h1 = models.CharField(max_length=200, blank=True, null=True, verbose_name='Título H1 (SEO)', help_text="Si se deja vacío, se usa el nombre de la categoría.")
    seo_h2 = models.CharField(max_length=200, blank=True, null=True, verbose_name='Título H2 (SEO)', help_text="Subtítulo opcional para SEO.")
    meta_title = models.CharField(max_length=200, blank=True, null=True, verbose_name='Meta Title', help_text="Título que aparece en la pestaña del navegador y en Google.")
    meta_description = models.TextField(blank=True, null=True, verbose_name='Meta Description', help_text="Descripción para motores de búsqueda.")
    
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

def headphone_directory_path(instance, filename):
    # El archivo se subirá a MEDIA_ROOT/headphones/<category_slug>/<filename>
    # Si la categoría tiene slug, lo usa, si no, usa 'uncategorized'
    cat_path = instance.category.slug if instance.category and instance.category.slug else 'uncategorized'
    return 'headphones/{0}/{1}'.format(cat_path, filename)

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
    protection_rating = models.CharField(max_length=50, blank=True, default='', verbose_name='Grado de Protección (IP)')
    
    # Imágenes
    main_image = models.ImageField(upload_to=headphone_directory_path, blank=True, null=True, verbose_name='Imagen Principal')
    image_2 = models.ImageField(upload_to=headphone_directory_path, blank=True, null=True, verbose_name='Imagen Secundaria 1')
    image_3 = models.ImageField(upload_to=headphone_directory_path, blank=True, null=True, verbose_name='Imagen Secundaria 2')
    
    # Ratings y Ranking
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    ranking_order = models.IntegerField(default=0, verbose_name='Orden en Ranking')
    is_featured = models.BooleanField(default=False, verbose_name='Destacado')
    amazon_link = models.URLField(blank=True, null=True, verbose_name='Enlace Amazon')
    official_link = models.URLField(blank=True, null=True, verbose_name='Enlace Oficial')
    custom_review_link = models.CharField(max_length=255, blank=True, null=True, verbose_name='Enlace Personalizado de Review')

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
        ('marcas', 'Marcas'),
    ]

    TEMPLATE_CHOICES = [
        ('default', 'Por defecto'),
        ('marcas', 'Plantilla Marcas (Imágenes centradas)'),
    ]

    IMAGE_FIT_CHOICES = [
        ('contain', 'Mostrar entera (Sin recortes, puede dejar márgenes)'),
        ('cover', 'Llenar espacio (Recortada para llenar todo el marco sin márgenes)'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    article_type = models.CharField(max_length=20, choices=ARTICLE_TYPES, default='analisis')
    template = models.CharField(max_length=20, choices=TEMPLATE_CHOICES, default='default', verbose_name='Plantilla')
    excerpt = models.TextField(max_length=300, verbose_name='Resumen Breve', help_text="Breve introducción de 1-2 frases que aparecerá en el listado del blog.")
    content = RichTextUploadingField(verbose_name='Contenido')
    
    # Campos Específicos para Portadas/Listados (Optativos)
    list_title = models.CharField(max_length=200, blank=True, null=True, verbose_name='Título Corto (Portada)', help_text='Si se rellena, este título reemplazará al título principal únicamente en las cuadrículas y listados (útil para que solo ponga el nombre de la Marca).')
    list_image = models.ImageField(upload_to='articles/list/', blank=True, null=True, verbose_name='Imagen/Logo (Portada)', help_text='Logo o imagen simplificada exclusiva para listados exteriores. Si se deja en blanco, usará la imagen principal.')
    image_fit = models.CharField(max_length=20, choices=IMAGE_FIT_CHOICES, default='contain', verbose_name='Ajuste de Imagen (Portada)', help_text="Configura cómo se debe comportar la imagen en las tarjetas de la vista general.")
    image_width = models.IntegerField(default=100, verbose_name='Ancho de la Imagen (%) (Portada)', help_text='Porcentaje de ancho que ocupará la imagen en la PORTADA (10-100).')
    image_width_detail = models.IntegerField(default=100, verbose_name='Ancho de la Imagen (%) (Interior)', help_text='Porcentaje de ancho que ocupará la imagen dentro del ARTÍCULO (10-100).')
    
    # Relación con auriculares
    headphone = models.ForeignKey(Headphone, on_delete=models.SET_NULL, null=True, blank=True, related_name='articles')
    
    # Imágenes
    featured_image = models.ImageField(upload_to='articles/', blank=True, null=True, verbose_name='Imagen Principal (Interior)')
    
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
        verbose_name='Categoría',
        null=True, blank=True
    )
    article = models.ForeignKey(
        'Article', 
        on_delete=models.CASCADE, 
        related_name='comments',
        verbose_name='Artículo',
        null=True, blank=True
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

class Product(models.Model):
    """Productos a la venta en la tienda"""
    name = models.CharField(max_length=200, verbose_name='Nombre del Producto')
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = RichTextUploadingField(verbose_name='Descripción Detallada')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Precio')
    stock = models.IntegerField(default=10, verbose_name='Stock Disponible')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    main_image = models.ImageField(upload_to='products/', verbose_name='Imagen Principal')
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Order(models.Model):
    """Pedidos realizados en la tienda"""
    STATUS_CHOICES = [
        ('payment_pending', 'Pendiente de Pago'),
        ('paid', 'Pagado'),
        ('shipped', 'Enviado'),
        ('delivered', 'Entregado'),
        ('cancelled', 'Cancelado'),
    ]
    
    order_id = models.CharField(max_length=100, unique=True, verbose_name='ID de Pedido')
    customer_name = models.CharField(max_length=200, verbose_name='Nombre del Cliente')
    customer_email = models.EmailField(verbose_name='Email del Cliente')
    shipping_address = models.TextField(verbose_name='Dirección de Envío')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Importe Total')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='payment_pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'
        ordering = ['-created_at']

    def __str__(self):
        return f"Pedido {self.order_id} - {self.customer_name}"

class OrderItem(models.Model):
    """Líneas de un pedido"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name if self.product else 'Producto eliminado'}"

class Booking(models.Model):
    """Reservas de citas"""
    STATUS_CHOICES = [
        ('pending', 'Pendiente de Confirmación'),
        ('confirmed', 'Confirmada'),
        ('cancelled', 'Cancelada/No asistió'),
        ('completed', 'Completada'),
    ]
    
    name = models.CharField(max_length=100, verbose_name='Nombre Completo')
    email = models.EmailField(verbose_name='Email')
    phone = models.CharField(max_length=20, verbose_name='WhatsApp / Teléfono')
    date = models.DateField(verbose_name='Fecha de la Cita')
    time = models.TimeField(verbose_name='Hora de la Cita')
    notes = models.TextField(blank=True, null=True, verbose_name='Notas adicionales')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Estado')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Cita'
        verbose_name_plural = 'Citas'
        ordering = ['date', 'time']

    def __str__(self):
        return f"Cita {self.date} {self.time} - {self.name}"
