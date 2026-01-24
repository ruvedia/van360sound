from django.contrib import admin
from .models import Category, Headphone, Article, ContactMessage, Comment

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
            'fields': ('brand', 'name', 'slug', 'category', 'description', 'price', 'amazon_link')
        }),
        ('Ranking y Destacados', {
            'fields': ('ranking_order', 'rating', 'is_featured')
        }),
        ('Especificaciones Técnicas', {
            'fields': ('driver_size', 'frequency_response', 'impedance', 'sensitivity', 'battery_life', 'connectivity')
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
    list_display = ['title', 'article_type', 'author', 'published_date', 'is_published', 'views']
    list_filter = ['article_type', 'is_published', 'published_date']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_published']

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_editable = ['is_read']
    readonly_fields = ['created_at']

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['author_name', 'category', 'content_preview', 'created_at', 'is_approved']
    list_filter = ['category', 'is_approved', 'created_at']
    search_fields = ['author_name', 'author_email', 'content']
    list_editable = ['is_approved']
    readonly_fields = ['created_at']
    actions = ['approve_comments', 'reject_comments']
    
    def content_preview(self, obj):
        """Muestra los primeros 50 caracteres del comentario"""
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Comentario'
    
    def approve_comments(self, request, queryset):
        """Acción para aprobar comentarios seleccionados"""
        queryset.update(is_approved=True)
    approve_comments.short_description = 'Aprobar comentarios seleccionados'
    
    def reject_comments(self, request, queryset):
        """Acción para rechazar comentarios seleccionados"""
        queryset.update(is_approved=False)
    reject_comments.short_description = 'Rechazar comentarios seleccionados'
