from rest_framework import serializers
from .models import Category, Headphone, Article, ContactMessage, Comment

class CategorySerializer(serializers.ModelSerializer):
    headphones_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'order', 'headphones_count']
    
    def get_headphones_count(self, obj):
        return obj.headphones.count()

class HeadphoneSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Headphone
        fields = [
            'id', 'name', 'slug', 'brand', 'category', 'category_name',
            'description', 'price', 'show_price', 'show_review_button', 'driver_size', 'frequency_response',
            'impedance', 'sensitivity', 'battery_life', 'connectivity',
            'main_image', 'image_2', 'image_3', 'rating', 'ranking_order',
            'is_featured', 'amazon_link', 'official_link', 'score_soundstage', 'score_comfort',
            'score_build', 'score_treble', 'score_mids', 'score_bass',
            'score_noise_cancelling', 'score_transparency', 'score_call_quality',
            'score_accuracy', 'score_value', 'score_overall',
            'created_at', 'updated_at'
        ]

class ArticleSerializer(serializers.ModelSerializer):
    headphone_name = serializers.CharField(source='headphone.name', read_only=True)
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'article_type', 'excerpt', 'content',
            'headphone', 'headphone_name', 'featured_image', 'author',
            'published_date', 'updated_date', 'is_published', 'views'
        ]

class ArticleListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listados"""
    headphone_name = serializers.CharField(source='headphone.name', read_only=True)
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'article_type', 'excerpt',
            'headphone_name', 'featured_image', 'author',
            'published_date', 'views'
        ]

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['created_at']

class CommentSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.SlugField(write_only=True, required=False)
    
    class Meta:
        model = Comment
        fields = ['id', 'category', 'category_slug', 'category_name', 'author_name', 'author_email', 'content', 'created_at', 'is_approved']
        read_only_fields = ['created_at', 'is_approved', 'category']
        extra_kwargs = {'category': {'required': False}}
    
    def create(self, validated_data):
        category_slug = validated_data.pop('category_slug', None)
        if category_slug:
            from .models import Category
            category = Category.objects.get(slug=category_slug)
            validated_data['category'] = category
        return super().create(validated_data)
