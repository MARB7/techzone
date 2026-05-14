from django.urls import path
from . import views

app_name = 'usuarios'

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('perfil/', views.user_profile, name='perfil'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    # Admin
    path('admin/', views.AdminUsersView.as_view(), name='admin-users'),
    path('admin/<int:pk>/', views.AdminUsersView.as_view(), name='admin-user-delete'),
]
