from rest_framework import viewsets, filters, status, permissions, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Category, Headphone, Article, ContactMessage, Comment, Product, Order, OrderItem, Booking
from .utils import send_whatsapp_message
from .serializers import (
    CategorySerializer, HeadphoneSerializer,
    ArticleSerializer, ArticleListSerializer, ContactMessageSerializer,
    CommentSerializer, ProductSerializer, OrderSerializer, BookingSerializer,
    BookingPublicSerializer
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
        """Filtrar comentarios por categoría o artículo si se proporciona"""
        queryset = Comment.objects.filter(is_approved=True)
        category_slug = self.request.query_params.get('category', None)
        article_slug = self.request.query_params.get('article', None)
        
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        if article_slug:
            queryset = queryset.filter(article__slug=article_slug)
            
        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """Crear nuevo comentario"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Aquí podrías añadir lógica para enviar email
        # comment = serializer.instance
        # send_comment_notification_email(comment)
        

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para productos de la tienda"""
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']

import uuid

class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet para pedidos (Solo POST)"""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    http_method_names = ['post']
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        # Generar ID de pedido único
        order_id = f"VAN-{uuid.uuid4().hex[:8].upper()}"
        
        # Obtener items del request
        items_data = self.request.data.get('items', [])
        total_amount = 0
        
        # Guardar pedido inicial para tener la instancia
        order = serializer.save(order_id=order_id, total_amount=0)
        
        # Crear items y calcular total
        for item in items_data:
            try:
                product = Product.objects.get(id=item['product'])
                qty = int(item['quantity'])
                price = product.price
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=qty,
                    price_at_purchase=price
                )
                total_amount += price * qty
                # Descontar stock
                product.stock -= qty
                product.save()
            except Product.DoesNotExist:
                continue
        
        # Actualizar total
        order.total_amount = total_amount
        order.save()

class BookingViewSet(viewsets.ModelViewSet):
    """ViewSet para citas"""
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    http_method_names = ['get', 'post']
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BookingPublicSerializer
        return BookingSerializer

    def get_queryset(self):
        queryset = Booking.objects.all()
        date = self.request.query_params.get('date', None)
        if self.action == 'list':
            # Para el listado público, solo mostramos las que bloquean horario
            queryset = queryset.filter(status__in=['pending', 'confirmed'])
            if date:
                queryset = queryset.filter(date=date)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        booking = serializer.instance
        
        # Enviar Email de Notificación al Admin
        try:
            subject = f"Nueva Cita Solicitada: {booking.name} - {booking.date}"
            message = f"""
            Has recibido una nueva solicitud de cita.
            
            Datos del cliente:
            ------------------
            Nombre: {booking.name}
            Email: {booking.email}
            WhatsApp: {booking.phone}
            
            Detalles de la cita:
            --------------------
            Fecha: {booking.date}
            Hora: {booking.time}
            Notas: {booking.notes or 'Ninguna'}
            
            Gestiona esta cita en: {settings.VITE_API_URL}/admin/blog/booking/{booking.id}/change/
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.CONTACT_EMAIL_RECIPIENT],
                fail_silently=True
            )
        except Exception as e:
            print(f"Error enviando email de cita: {e}")

        # Enviar WhatsApp al Cliente
        try:
            wa_message = (
                f"¡Hola {booking.name}! 🎧\n\n"
                f"Hemos recibido tu solicitud de cita en *Van360Sound*.\n\n"
                f"📅 *Fecha:* {booking.date.strftime('%d/%m/%Y')}\n"
                f"⏰ *Hora:* {booking.time.strftime('%H:%M')}\n\n"
                "Te confirmaremos la disponibilidad lo antes posible. ¡Gracias por confiar en nosotros!"
            )
            send_whatsapp_message(booking.phone, wa_message)
        except Exception as e:
            print(f"Error enviando WhatsApp de cita: {e}")

        return Response(
            {
                'message': 'Cita solicitada correctamente',
                'booking': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
