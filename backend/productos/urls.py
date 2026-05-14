from django.urls import path
from . import views

app_name = 'productos'

urlpatterns = [
    path('', views.producto_list, name='list'),
    path('<int:pk>/', views.producto_detail, name='detail'),
    # Admin endpoints
    path('admin/crear/', views.AdminProductoView.as_view(), name='admin-create'),
    path('admin/<int:pk>/', views.AdminProductoView.as_view(), name='admin-edit-delete'),
]
