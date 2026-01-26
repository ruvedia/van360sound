from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0011_headphone_custom_review_link'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='meta_description',
            field=models.TextField(blank=True, help_text='Descripción para motores de búsqueda.', null=True, verbose_name='Meta Description'),
        ),
        migrations.AddField(
            model_name='category',
            name='meta_title',
            field=models.CharField(blank=True, help_text='Título que aparece en la pestaña del navegador y en Google.', max_length=200, null=True, verbose_name='Meta Title'),
        ),
        migrations.AddField(
            model_name='category',
            name='seo_h1',
            field=models.CharField(blank=True, help_text='Si se deja vacío, se usa el nombre de la categoría.', max_length=200, null=True, verbose_name='Título H1 (SEO)'),
        ),
        migrations.AddField(
            model_name='category',
            name='seo_h2',
            field=models.CharField(blank=True, help_text='Subtítulo opcional para SEO.', max_length=200, null=True, verbose_name='Título H2 (SEO)'),
        ),
    ]
