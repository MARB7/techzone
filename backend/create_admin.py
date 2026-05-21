"""
Script para crear el usuario administrador 'ramos' con contraseña '1234567'.
Ejecutar desde la carpeta del backend:
    python3 create_admin.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'python.settings')
django.setup()

from django.contrib.auth.models import User
from usuarios.models import Perfil

# ─── Datos del admin ───
ADMIN_USERNAME = 'ramos'
ADMIN_PASSWORD = '1234567'
ADMIN_EMAIL = 'ramos@techzone.com'

# Crear o actualizar el usuario
user, created = User.objects.get_or_create(username=ADMIN_USERNAME)
user.set_password(ADMIN_PASSWORD)
user.email = ADMIN_EMAIL
user.is_staff = True
user.is_superuser = True
user.save()

# Crear o actualizar su perfil como admin
perfil, _ = Perfil.objects.get_or_create(usuario=user)
perfil.rol = 'admin'
perfil.save()

if created:
    print(f'✅ Usuario "{ADMIN_USERNAME}" CREADO exitosamente como ADMIN')
else:
    print(f'✅ Usuario "{ADMIN_USERNAME}" ACTUALIZADO exitosamente como ADMIN')

print(f'   Username:  {ADMIN_USERNAME}')
print(f'   Password:  {ADMIN_PASSWORD}')
print(f'   Email:     {ADMIN_EMAIL}')
print(f'   Rol:       admin')
print(f'   is_staff:  True')
print(f'   superuser: True')
