from django.shortcuts import render, get_object_or_404
from .models import * 
from rest_framework import generics, filters
from django.contrib.auth.models import Group
from .serializers import *
from django.utils import timezone # lapso de tiempo
from datetime import timedelta # tiempo que se resta y se obtiene por ejemplo los ultimos 7 dias
from rest_framework.decorators import api_view # permite que una funcion de python se com´porte como un endpoint
from rest_framework.response import Response # necesario para api view
from rest_framework.views import APIView
from django.db.models import Avg, Q, Count
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .permissions import IsTrabajador
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# usuario en sesion
class UserInSession(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# canton_provincia
class canton_provinciaListCreateView(generics.ListCreateAPIView):
    queryset = canton_provincia.objects.all()
    serializer_class=canton_provinciaSerializer
class canton_provinciaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = canton_provincia.objects.all()
    serializer_class=canton_provinciaSerializer
    permission_classes= [IsAuthenticated, IsAdminUser]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Group
class GroupReadOnlyView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes= [IsAuthenticated, IsAdminUser]

# UsuarioGroup
class UsuarioGroupListCreateView(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class=UsuarioGroupSerializer
class UsuarioGroupUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioGroupSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

# Usuario
class UsuarioListCreateView(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class=UsuarioSerializer
class UsuarioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class=UsuarioSerializer
    permission_classes = [IsAuthenticated]  

# Categoria
class CategoriaListCreateView(generics.ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class=CategoriaSerializer
class CategoriaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class=CategoriaSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

# Servicio
class ServicioListCreateView(generics.ListCreateAPIView):
    queryset = Servicio.objects.all().exclude(nombre_servicio__isnull=True).exclude(descripcion__isnull=True)
    serializer_class = ServicioSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['usuario', 'categoria']
    search_fields = ['nombre_servicio', 'descripcion']

class ServicioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Servicio.objects.all()
    serializer_class=ServicioSerializer
    permission_classes = [IsAuthenticated, IsTrabajador | IsAdminUser]    

# Solicitud
class SolicitudListCreateView(generics.ListCreateAPIView):
    queryset = Solicitud.objects.all()
    serializer_class=SolicitudSerializer
class SolicitudRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Solicitud.objects.all()
    serializer_class=SolicitudSerializer
    permission_classes = [IsAuthenticated] 

# Resenha
class ResenhaListCreateView(generics.ListCreateAPIView):
    queryset = Resenha.objects.all()
    serializer_class=ResenhaSerializer
    permission_classes = [IsAuthenticated]
class ResenhaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Resenha.objects.all()
    serializer_class=ResenhaSerializer
    permission_classes = [IsAuthenticated]

# Mensaje
class MensajeListCreateView(generics.ListCreateAPIView):
    queryset = Mensaje.objects.all()
    serializer_class=MensajeSerializer
    permission_classes = [IsAuthenticated]
class MensajeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Mensaje.objects.all()
    serializer_class=MensajeSerializer
    permission_classes = [IsAuthenticated] 

# Portafolio
class PortafolioListCreateView(generics.ListCreateAPIView):
    queryset = Portafolio.objects.all()
    serializer_class=PortafolioSerializer
class PortafolioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Portafolio.objects.all()
    serializer_class=PortafolioSerializer    

# Notificacion
class NotificacionListCreateView(generics.ListCreateAPIView):
    queryset = Notificacion.objects.all()
    serializer_class=NotificacionSerializer
    permission_classes = [IsAuthenticated, IsTrabajador]
class NotificacionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notificacion.objects.all()
    serializer_class=NotificacionSerializer
    permission_classes = [IsAuthenticated, IsTrabajador]    

# Favorito
class FavoritoListCreateView(generics.ListCreateAPIView):
    queryset = Favorito.objects.all()
    serializer_class=FavoritoSerializer
    permission_classes = [IsAuthenticated]
class FavoritoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Favorito.objects.all()
    serializer_class=FavoritoSerializer
    permission_classes = [IsAuthenticated]

# CUSTOM VIEWS

# Obtener servicios por categoría
@api_view(['GET'])
def servicios_por_categoria(request, categoria_id):
    servicios = Servicio.objects.filter(categoria_id=categoria_id, disponibilidad=True)
    serializer = ServicioSerializer(servicios, many=True)
    return Response(serializer.data)

# populares hoy (Devuelve los trabajadores más populares (mejor promedio de reseñas)en los últimos 7 días.)
@api_view(['GET'])
def populares_hoy(request):
        #fecha de hoy - 7 dias
        hace_7_dias = timezone.now() - timedelta(days=7)
        top_trabajoderes = (
            Resenha.objects
            .filter(fecha__gte=hace_7_dias)
            .values('trabajador')
            .annotate(promedio=Avg('puntuacion')) #annotate agrega un nuevo atributo al modelo
            .order_by('-promedio')[:10] # reduce el filtrado a 10 resultados
        )
        ids_usuarios = [item['trabajador'] for item in top_trabajoderes]
        usuarios = Usuario.objects.filter(id__in=ids_usuarios)
        serializer = UsuarioSerializer(usuarios, many=True)

        resultados= []
        for usuario in serializer.data:
            user_id = usuario['id']
            promedio = next((item['promedio'] for item in top_trabajoderes if item['trabajador'] == user_id), 0)
            usuario['promedio_calificacion_7_dias'] = round(promedio, 2)
            resultados.append(usuario)
        return Response(resultados)


# conversaciones entre usuarios 
@api_view(['GET'])
def conversaciones_usuario(request, usuario_id):
    # Obtener todos los mensajes donde el usuario participa
    mensajes = Mensaje.objects.filter(
        Q(remitente_id=usuario_id) | Q(destinatario_id=usuario_id)
    ).select_related('remitente', 'destinatario').order_by('-fecha_envio')
    
    # Procesar para obtener el último mensaje de cada conversación
    conversaciones_dict = {}
    
    for msg in mensajes:
        # Determinar quién es el otro usuario
        other_user_id = msg.destinatario_id if msg.remitente_id == usuario_id else msg.remitente_id
        
        # Solo guardar si es la primera vez que vemos este usuario (el más reciente)
        if other_user_id not in conversaciones_dict:
            other_user = msg.destinatario if msg.remitente_id == usuario_id else msg.remitente
            conversaciones_dict[other_user_id] = {
                'usuario': UsuarioSerializer(other_user).data,
                'ultimo_mensaje': MensajeSerializer(msg).data,
                'ultima_fecha': msg.fecha_envio}
    # Convertir a lista y ordenar
    conversaciones = list(conversaciones_dict.values())
    conversaciones.sort(key=lambda x: x['ultima_fecha'], reverse=True)
    return Response(conversaciones)
    

# Obtener mensajes entre dos usuarios
@api_view(['GET'])
def mensajes_entre_usuarios(request, usuario1_id, usuario2_id):
    mensajes = Mensaje.objects.filter(
        Q(remitente_id=usuario1_id, destinatario_id=usuario2_id) |
        Q(remitente_id=usuario2_id, destinatario_id=usuario1_id)
    ).order_by('fecha_envio')
    
    serializer = MensajeSerializer(mensajes, many=True)
    return Response(serializer.data)

# solicitudes_por_categoria
@api_view(['GET'])
def solicitudes_por_categoria(request, categoria_id):
    qs = Solicitud.objects.filter(categoria_id=categoria_id, estado=True).select_related('canton_provincia','usuario').order_by('-fecha_publicacion')
    serializer = SolicitudSerializer(qs, many=True)
    return Response(serializer.data)

# Obtener reseñas de un trabajador con promedio
@api_view(['GET'])
def resenhas_trabajador(request, trabajador_id):
    trabajador = get_object_or_404(Usuario, id=trabajador_id)
    qs = Resenha.objects.filter(trabajador_id=trabajador_id).order_by('-fecha')
    agg = qs.aggregate(promedio=Avg('puntuacion'), total=Count('id'))
    serializer = ResenhaSerializer(qs, many=True)
    return Response({
        'resenhas': serializer.data,
        'promedio': round(agg['promedio'] or 0, 2),
        'total': agg['total'] or 0})

# Estadísticas de un trabajador
@api_view(['GET'])
def estadisticas_trabajador(request, trabajador_id):
    trabajador = Usuario.objects.get(id=trabajador_id)
    # Contar trabajos (reseñas recibidas)
    trabajos_completados = Resenha.objects.filter(trabajador_id=trabajador_id).count()
    # Promedio de calificación
    promedio = Resenha.objects.filter(trabajador_id=trabajador_id).aggregate(Avg('puntuacion'))
    # Servicios ofrecidos
    servicios = Servicio.objects.filter(usuario_id=trabajador_id).count()
    # Tasa de satisfacción (reseñas >= 4)
    resenhas_positivas = Resenha.objects.filter(trabajador_id=trabajador_id, puntuacion__gte=4).count()
    tasa_satisfaccion = (resenhas_positivas / trabajos_completados * 100) if trabajos_completados > 0 else 0
    return Response({
        'trabajos_completados': trabajos_completados,
        'promedio_calificacion': round(promedio['puntuacion__avg'] or 0, 2),
        'servicios_ofrecidos': servicios,
        'tasa_satisfaccion': round(tasa_satisfaccion, 2),
        'verificado': trabajador.verificado})