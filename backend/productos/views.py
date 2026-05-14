from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Producto
from .serializers import ProductoSerializer


def is_admin(user):
    """Verificar si el usuario es administrador"""
    try:
        return user.perfil.rol == 'admin'
    except Exception:
        return False


@api_view(['GET'])
def producto_list(request):
    """Listar todos los productos con filtros opcionales"""
    productos = Producto.objects.all()

    # Filtrar por categoría
    categoria = request.query_params.get('categoria', None)
    if categoria:
        productos = productos.filter(categoria=categoria)

    # Filtrar destacados
    destacado = request.query_params.get('destacado', None)
    if destacado == 'true':
        productos = productos.filter(destacado=True)

    # Filtrar ofertas
    en_oferta = request.query_params.get('en_oferta', None)
    if en_oferta == 'true':
        productos = productos.filter(en_oferta=True)

    # Búsqueda por nombre
    search = request.query_params.get('search', None)
    if search:
        productos = productos.filter(nombre__icontains=search)

    serializer = ProductoSerializer(productos, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def producto_detail(request, pk):
    """Obtener detalle de un producto"""
    try:
        producto = Producto.objects.get(pk=pk)
    except Producto.DoesNotExist:
        return Response(
            {'error': 'Producto no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    serializer = ProductoSerializer(producto, context={'request': request})
    return Response(serializer.data)


class AdminProductoView(APIView):
    """CRUD de productos - solo admin"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Crear producto"""
        if not is_admin(request.user):
            return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ProductoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        """Editar producto"""
        if not is_admin(request.user):
            return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        try:
            producto = Producto.objects.get(pk=pk)
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductoSerializer(producto, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        """Eliminar producto"""
        if not is_admin(request.user):
            return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        try:
            producto = Producto.objects.get(pk=pk)
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        producto.delete()
        return Response({'message': 'Producto eliminado'}, status=status.HTTP_200_OK)
