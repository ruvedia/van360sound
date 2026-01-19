from rest_framework import viewsets, filters, status, permissions, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Category, Headphone, Article, ContactMessage, Comment
from .serializers import (
    CategorySerializer, HeadphoneSerializer,
    ArticleSerializer, ArticleListSerializer, ContactMessageSerializer,
    CommentSerializer
)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para categorías de auriculares"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

class HeadphoneViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para auriculares"""
    queryset = Headphone.objects.all()
    serializer_class = HeadphoneSerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'brand', 'description']
    ordering_fields = ['created_at', 'rating', 'price']
    
    def get_queryset(self):
        queryset = Headphone.objects.all()
        category_slug = self.request.query_params.get('category', None)
        is_featured = self.request.query_params.get('featured', None)
        
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        if is_featured:
            queryset = queryset.filter(is_featured=True)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Búsqueda de auriculares"""
        query = request.query_params.get('q', '')
        if query:
            headphones = Headphone.objects.filter(
                Q(name__icontains=query) |
                Q(brand__icontains=query) |
                Q(description__icontains=query)
            )
            serializer = self.get_serializer(headphones, many=True)
            return Response(serializer.data)
        return Response([])

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para artículos del blog"""
    queryset = Article.objects.filter(is_published=True)
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['published_date', 'views']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ArticleListSerializer
        return ArticleSerializer
    
    def get_queryset(self):
        queryset = Article.objects.filter(is_published=True)
        article_type = self.request.query_params.get('type', None)
        
        if article_type:
            queryset = queryset.filter(article_type=article_type)
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        """Incrementar vistas al ver un artículo"""
        instance = self.get_object()
        instance.views += 1
        instance.save(update_fields=['views'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

from django.core.mail import send_mail
from django.conf import settings

class ContactMessageViewSet(viewsets.ModelViewSet):
    """ViewSet para mensajes de contacto"""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    http_method_names = ['post']  # Solo permitir POST
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Enviar notificación por email
        try:
            contact = serializer.instance
            subject = f"Nuevo mensaje de contacto Web: {contact.subject}"
            message = f"""
            Has recibido un nuevo mensaje desde el formulario de contacto de Van360Sound.
            
            Detalles del remitente:
            -----------------------
            Nombre: {contact.name}
            Email: {contact.email}
            Asunto: {contact.subject}
            
            Mensaje:
            -----------------------
            {contact.message}
            """
            
            print(f"Intentando enviar email a: {settings.CONTACT_EMAIL_RECIPIENT} desde {settings.DEFAULT_FROM_EMAIL}")
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.CONTACT_EMAIL_RECIPIENT],
                fail_silently=False,  # Cambiado a False para ver el error
            )
            print("Email enviado correctamente desde el servidor.")
        except Exception as e:
            print(f"❌ ERROR CRÍTICO al enviar email: {str(e)}")
            # No relanzamos la excepción para no romper la respuesta al usuario (que vea 'Mensaje enviado')
            # pero el admin podrá ver el error en los logs.

        return Response(
            {'message': 'Mensaje enviado correctamente'},
            status=status.HTTP_201_CREATED
        )

class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet para comentarios"""
    queryset = Comment.objects.filter(is_approved=True)
    serializer_class = CommentSerializer
    http_method_names = ['get', 'post']  # Solo GET y POST
    
    def get_queryset(self):
        """Filtrar comentarios por categoría si se proporciona"""
        queryset = Comment.objects.filter(is_approved=True)
        category_slug = self.request.query_params.get('category', None)
        
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """Crear nuevo comentario"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Aquí podrías añadir lógica para enviar email
        # comment = serializer.instance
        # send_comment_notification_email(comment)
        
        return Response(
            {
                'message': 'Comentario publicado correctamente',
                'comment': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
