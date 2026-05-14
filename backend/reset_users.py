import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'python.settings')
django.setup()

from django.contrib.auth.models import User
from usuarios.models import Perfil
from django.db import connection

# Encontrar el admin
admins = User.objects.filter(perfil__rol='admin')
admin_names = [u.username for u in admins]
print(f"Usuarios admin (se mantienen): {admin_names}")

# Borrar usuarios no-admin
non_admins = User.objects.exclude(perfil__rol='admin')
count = non_admins.count()
non_admins.delete()
print(f"Se eliminaron {count} usuarios no-admin.")

# Obtener el ID del admin para reiniciar la secuencia después de él
if admins.exists():
    max_admin_id = max(a.id for a in admins)
    # Reiniciar secuencia de auth_user
    cursor = connection.cursor()
    cursor.execute(f"ALTER SEQUENCE auth_user_id_seq RESTART WITH {max_admin_id + 1}")
    # Reiniciar secuencia de perfil
    max_perfil_id = max(Perfil.objects.values_list('id', flat=True))
    cursor.execute(f"ALTER SEQUENCE usuarios_perfil_id_seq RESTART WITH {max_perfil_id + 1}")
    # Reiniciar tokens
    cursor.execute("DELETE FROM authtoken_token WHERE user_id NOT IN (SELECT id FROM auth_user)")
    print(f"Secuencia de IDs reiniciada. El próximo usuario será ID = {max_admin_id + 1}")
else:
    cursor = connection.cursor()
    cursor.execute("ALTER SEQUENCE auth_user_id_seq RESTART WITH 1")
    cursor.execute("ALTER SEQUENCE usuarios_perfil_id_seq RESTART WITH 1")
    print("No hay admins. Secuencia reiniciada a 1.")

print("Listo.")
