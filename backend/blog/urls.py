from rest_framework import routers
from django.urls import path, include
from .views import (
    CategoryViewSet, HeadphoneViewSet, ArticleViewSet, 
    ContactMessageViewSet, CommentViewSet, ProductViewSet,
    OrderViewSet, BookingViewSet
)

router = routers.DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'headphones', HeadphoneViewSet)
router.register(r'articles', ArticleViewSet)
router.register(r'contact', ContactMessageViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'bookings', BookingViewSet)

from django.http import JsonResponse

def version_view(request):
    return JsonResponse({
        "version": "1.2.0-pivot-marcas",
        "timestamp": "2026-03-03T14:15:00Z",
        "status": "active"
    })

urlpatterns = [
    path('version/', version_view),
    path('', include(router.urls)),
]
