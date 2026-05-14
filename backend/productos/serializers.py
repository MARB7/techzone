from rest_framework import serializers
from .models import Producto


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'descripcion', 'precio', 'precio_original',
            'imagen', 'cantidad', 'categoria', 'rating', 'badge',
            'destacado', 'en_carrusel', 'en_oferta', 'fecha_creacion'
        ]
