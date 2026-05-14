from django.contrib import admin
from .models import Producto


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'precio', 'cantidad', 'categoria', 'destacado', 'en_oferta']
    list_filter = ['categoria', 'destacado', 'en_oferta']
    search_fields = ['nombre', 'descripcion']
    list_editable = ['precio', 'cantidad', 'destacado', 'en_oferta']
