from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.db import transaction
from django.db.models import F
from .models import Producto
from .serializers import ProductoSerializer


def is_admin(user):
    """Verificar si el usuario es administrador"""
    try:
        return user.perfil.rol == 'admin'
    except Exception:
        return False


@api_view(['GET'])
@permission_classes([AllowAny])
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

    # Filtrar carrusel
    en_carrusel = request.query_params.get('en_carrusel', None)
    if en_carrusel == 'true':
        productos = productos.filter(en_carrusel=True)

    # Filtrar ofertas
    en_oferta = request.query_params.get('en_oferta', None)
    if en_oferta == 'true':
        productos = productos.filter(en_oferta=True)

    # Búsqueda por nombre o categoría
    search = request.query_params.get('search', None)
    if search:
        from django.db.models import Q
        productos = productos.filter(Q(nombre__icontains=search) | Q(categoria__icontains=search))

    serializer = ProductoSerializer(productos, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
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


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def checkout(request):
    """
    Procesar el pago: descontar stock de cada producto del carrito.
    Espera un JSON con la estructura:
    { "items": [ { "producto_id": 1, "qty": 2 }, ... ] }
    Los productos con stock 0 se mantienen en la BD, no se eliminan.
    """
    items = request.data.get('items', [])

    if not items:
        return Response(
            {'error': 'El carrito está vacío'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validar estructura de datos
    for item in items:
        if 'producto_id' not in item or 'qty' not in item:
            return Response(
                {'error': 'Cada item debe tener producto_id y qty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if int(item['qty']) < 1:
            return Response(
                {'error': 'La cantidad debe ser al menos 1'},
                status=status.HTTP_400_BAD_REQUEST
            )

    try:
        with transaction.atomic():
            productos_actualizados = []

            for item in items:
                producto_id = int(item['producto_id'])
                qty = int(item['qty'])

                # select_for_update() bloquea la fila para evitar condiciones de carrera
                producto = Producto.objects.select_for_update().get(pk=producto_id)

                if producto.cantidad < qty:
                    return Response(
                        {
                            'error': f'Stock insuficiente para "{producto.nombre}". '
                                     f'Disponible: {producto.cantidad}, Solicitado: {qty}'
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Descontar stock (nunca baja de 0)
                producto.cantidad = F('cantidad') - qty
                producto.save(update_fields=['cantidad'])

                # Refrescar para obtener el valor actualizado
                producto.refresh_from_db()
                productos_actualizados.append({
                    'id': producto.id,
                    'nombre': producto.nombre,
                    'cantidad_restante': producto.cantidad
                })

        return Response({
            'message': 'Compra realizada con éxito',
            'productos': productos_actualizados
        }, status=status.HTTP_200_OK)

    except Producto.DoesNotExist:
        return Response(
            {'error': 'Uno o más productos no fueron encontrados'},
            status=status.HTTP_404_NOT_FOUND
        )


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
