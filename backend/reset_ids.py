import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'python.settings')
django.setup()

from productos.models import Producto
from django.db import connection

count = Producto.objects.count()
Producto.objects.all().delete()

cursor = connection.cursor()
cursor.execute("ALTER SEQUENCE productos_producto_id_seq RESTART WITH 1")

print(f"Se eliminaron {count} productos. La secuencia de IDs fue reiniciada a 1.")
print("Ahora puedes crear productos nuevos y empezarán desde ID = 1.")
