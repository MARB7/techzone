from rest_framework import serializers
from .models import Producto


class ProductoSerializer(serializers.ModelSerializer):
    imagen = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'descripcion', 'precio', 'precio_original',
            'imagen', 'cantidad', 'categoria', 'rating', 'badge',
            'destacado', 'en_carrusel', 'en_oferta', 'fecha_creacion'
        ]

    def get_imagen(self, obj):
        """
        Si la imagen es una URL externa (http/https), la devuelve tal cual.
        Si es un archivo local (subido por admin), construye la URL completa.
        """
        if not obj.imagen:
            return None
        imagen_str = str(obj.imagen)
        if imagen_str.startswith('http://') or imagen_str.startswith('https://'):
            return imagen_str
        # Es un archivo local: construir la URL completa
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(f'/media/{imagen_str}')
        return f'/media/{imagen_str}'
