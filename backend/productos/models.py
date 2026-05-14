from django.db import models


class Producto(models.Model):
    CATEGORIAS = [
        ('procesadores', 'Procesadores'),
        ('tarjetas_graficas', 'Tarjetas Gráficas'),
        ('ram', 'Memoria RAM'),
        ('almacenamiento', 'Almacenamiento'),
        ('monitores', 'Monitores'),
        ('teclados', 'Teclados'),
        ('mouse', 'Mouse'),
        ('auriculares', 'Auriculares'),
        ('chasis', 'Chasis'),
        ('ventiladores', 'Ventiladores'),
        ('gamepads', 'Gamepads'),
        ('fuentes', 'Fuentes de Poder'),
        ('motherboards', 'Motherboards'),
    ]

    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    precio_original = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    imagen = models.ImageField(upload_to='productos/', max_length=500, blank=True, null=True)
    cantidad = models.IntegerField(default=0)
    categoria = models.CharField(max_length=50, choices=CATEGORIAS, default='procesadores')
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    badge = models.CharField(max_length=50, blank=True, default='')
    destacado = models.BooleanField(default=False)
    en_oferta = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha_creacion']
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'

    def __str__(self):
        return self.nombre
