from rest_framework import routers
from django.urls import path, include
from .views import CategoryViewSet, HeadphoneViewSet, ArticleViewSet, ContactMessageViewSet, CommentViewSet

router = routers.DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'headphones', HeadphoneViewSet)
router.register(r'articles', ArticleViewSet)
router.register(r'contact', ContactMessageViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
