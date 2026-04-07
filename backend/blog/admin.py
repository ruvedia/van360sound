from django.contrib import admin
from .models import Category, Headphone, Article, ContactMessage, Comment, Product, Order, OrderItem, Booking

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['order']

@admin.register(Headphone)
class HeadphoneAdmin(admin.ModelAdmin):
    list_display = ['name', 'brand', 'category', 'ranking_order', 'price', 'is_featured', 'created_at']
    list_filter = ['category', 'brand', 'is_featured']
    search_fields = ['name', 'brand', 'description']
    prepopulated_fields = {'slug': ('brand', 'name')}
    list_editable = ['ranking_order', 'is_featured']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('brand', 'name', 'slug', 'category', 'description', 'price', 'show_price', 'show_review_button', 'amazon_link', 'official_link', 'custom_review_link')
        }),
        ('Ranking y Destacados', {
            'fields': ('ranking_order', 'rating', 'is_featured')
        }),
        ('Especificaciones Técnicas', {
            'fields': ('driver_size', 'frequency_response', 'impedance', 'sensitivity', 'battery_life', 'connectivity', 'protection_rating')
        }),
        ('Puntuaciones (Barras 0-100)', {
            'fields': (
                'score_soundstage', 'score_comfort', 'score_build', 
                'score_treble', 'score_mids', 'score_bass', 
                'score_noise_cancelling', 'score_transparency', 'score_call_quality',
                'score_accuracy', 'score_value', 'score_overall'
            )
        }),
        ('Multimedia', {
            'fields': ('main_image', 'image_2', 'image_3')
        }),
    )

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'list_title', 'article_type', 'template', 'author', 'published_date', 'is_published', 'views']
    list_filter = ['article_type', 'template', 'is_published', 'published_date']
    search_fields = ['title', 'list_title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_published']

    fieldsets = (
        ('Información Principal', {
            'fields': ('title', 'slug', 'article_type', 'template', 'excerpt', 'content')
        }),
        ('Apariencia en Listados/Portadas', {
            'fields': ('list_title', 'list_image', 'image_fit', 'image_width'),
            'description': 'Campos opcionales para personalizar cómo se ve la tarjeta de este artículo/marca desde fuera. Si los dejas vacíos, se usará el Título Principal y la Imagen Principal.'
        }),
        ('Relaciones y Multimedia', {
            'fields': ('headphone', 'featured_image', 'image_width_detail')
        }),
        ('Metadatos', {
            'fields': ('author', 'is_published', 'views')
        }),
    )

    class Media:
        css = {
            'all': ('blog/css/admin_custom.css',)
        }

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_editable = ['is_read']
    readonly_fields = ['created_at']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'is_active', 'created_at']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['price', 'stock', 'is_active']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price_at_purchase']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'customer_name', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_id', 'customer_name', 'customer_email']
    readonly_fields = ['order_id', 'total_amount', 'created_at']
    inlines = [OrderItemInline]

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['name', 'date', 'time', 'phone', 'status', 'created_at']
    list_filter = ['status', 'date']
    search_fields = ['name', 'email', 'phone']
    list_editable = ['status']
    readonly_fields = ['created_at']
