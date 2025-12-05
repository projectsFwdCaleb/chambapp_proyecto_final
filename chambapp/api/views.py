from django.shortcuts import render, get_object_or_404
from .models import * 
from rest_framework import generics, filters
from django.contrib.auth.models import Group
from .serializers import *
from django.utils import timezone # lapso de tiempo
from datetime import timedelta # tiempo que se resta y se obtiene por ejemplo los ultimos 7 dias
from rest_framework.decorators import api_view, permission_classes # permite que una funcion de python se com´porte como un endpoint
from rest_framework.response import Response # necesario para api view
from rest_framework.views import APIView
from django.db.models import Avg, Q, Count, Min
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .permissions import IsTrabajador
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
import os
import json
import requests
from rest_framework.parsers import MultiPartParser, FormParser




OPENAI_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_URL = "https://api.openai.com/v1/chat/completions"

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
class UsuarioGroupListCreateView(generics.ListAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioGroupSerializer
class UsuarioGroupUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioGroupSerializer
    #permission_classes = [IsAuthenticated, IsAdminUser]

# Usuario
class UsuarioListCreateView(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class=UsuarioSerializer
class UsuarioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    parser_classes = [MultiPartParser, FormParser]

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)
    #permission_classes = [IsAuthenticated]  

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
   # permission_classes = [IsAuthenticated]

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
def trabajadores_por_categoria(request, categoria_id):
    # Filtros opcionales
    canton = request.query_params.get("canton")
    min_precio = request.query_params.get("min")
    max_precio = request.query_params.get("max")
    ordenar = request.query_params.get("ordenar")  # ejemplo: "precio", "-precio"
    # buscar servicios disponibles dentro de la categoría
    servicios = Servicio.objects.filter(
        categoria_id=categoria_id,
        disponibilidad=True
    ).select_related("usuario", "categoria")
    # aplicar filtros de precio a nivel de servicio
    if min_precio:
        servicios = servicios.filter(precio_referencial__gte=min_precio)
    if max_precio:
        servicios = servicios.filter(precio_referencial__lte=max_precio)
    # obtener IDs de trabajadores sin repetir
    ids_trabajadores = servicios.values_list("usuario_id", flat=True).distinct()
    # obtener usuarios con prefetch
    trabajadores_qs = Usuario.objects.filter(
        id__in=ids_trabajadores
    ).prefetch_related("servicios")
    # filtro por cantón
    if canton:
        trabajadores_qs = trabajadores_qs.filter(canton_provincia=canton)
    # ordenamiento opcional
    if ordenar in ["precio", "-precio"]:
        # se ordena por el precio mínimo disponible del trabajador
        trabajadores_qs = trabajadores_qs.annotate(
            min_precio=Min("servicios__precio_referencial")
        ).order_by("min_precio" if ordenar == "precio" else "-min_precio")
    # mapear para rendimiento
    trabajadores_map = {u.id: u for u in trabajadores_qs}
    resultados = []
    for trabajador_id in ids_trabajadores:
        user = trabajadores_map.get(trabajador_id)
        if not user:
            continue
        user_data = UserSerializer(user).data
        servicios_user = user.servicios.filter(
            categoria_id=categoria_id,
            disponibilidad=True
        )
        user_data["servicios"] = ServicioSerializer(servicios_user, many=True).data
        resultados.append(user_data)
    return Response(resultados)

# populares hoy (Devuelve los trabajadores más populares (mejor promedio de reseñas)en los últimos 7 días.)
@api_view(['GET'])
def populares_hoy(request):
    hace_7_dias = timezone.now() - timedelta(days=15)
    # Agrupamos reseñas por trabajador y obtenemos promedio
    top_trabajoderes = (
        Resenha.objects
        .filter(fecha__gte=hace_7_dias)
        .values('trabajador')
        .annotate(promedio=Avg('puntuacion'))
        .order_by('-promedio')[:10]
    )
    ids_usuarios = [item['trabajador'] for item in top_trabajoderes]
    # Traemos los usuarios y prefetch de servicios para eficiencia
    usuarios_qs = Usuario.objects.filter(id__in=ids_usuarios).prefetch_related('servicios')
    usuarios_map = {u.id: u for u in usuarios_qs}

    resultados = []
    for item in top_trabajoderes:
        user_id = item['trabajador']
        usuario_obj = usuarios_map.get(user_id)
        if not usuario_obj:
            continue
        # Serializamos usuario (campos básicos)
        usuario_data = UsuarioSerializer(usuario_obj).data
        # Tomamos servicios disponibles del usuario (podemos limitar el número si queremos)
        servicios_qs = usuario_obj.servicios.filter(disponibilidad=True).select_related('categoria')  # si quieres categoria incluida
        servicios_ser = ServicioSerializer(servicios_qs, many=True).data
        usuario_data['servicios'] = servicios_ser
        usuario_data['promedio_calificacion_7_dias'] = round(item.get('promedio') or 0, 2)
        resultados.append(usuario_data)
    return Response(resultados)


# conversaciones entre usuarios 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
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
        'trabajador_id': trabajador.id,
        'trabajos_completados': trabajos_completados,
        'promedio_calificacion': round(promedio['puntuacion__avg'] or 0, 2),
        'servicios_ofrecidos': servicios,
        'tasa_satisfaccion': round(tasa_satisfaccion, 2),
        'verificado': trabajador.verificado})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def usuarios_cercanos(request):
    user = request.user
    if not user.canton_provincia:
        # Si el usuario no tiene ubicación definida, devuelve una lista vacía
        return Response([], status=200)
    # Obtener el límite de resultados
    limit = request.query_params.get('limit')
    try:
        limit = int(limit) if limit is not None else 10
    except ValueError:
        limit = 10

    # Filtrar usuarios en el mismo cantón, excluir al propio usuario
    usuarios = Usuario.objects.filter(
        canton_provincia=user.canton_provincia
    ).exclude(id=user.id)[:limit]  # Aplicar el límite directamente
    # Serializar y devolver
    serializer = UsuarioSerializer(usuarios, many=True)
    return Response(serializer.data)

class ChatBotAPIView(APIView):
    def post(self, request, *args, **kwargs):
        messages = request.data.get('messages')
        if not messages:
            return Response({"error": "No se proporcionaron mensajes."},
                            status=status.HTTP_400_BAD_REQUEST)

        # ---- DIAGNÓSTICO ----
        print("=== DIAGNOSTICO OPENAI ===")
        print("OPENAI_KEY cargada?", bool(OPENAI_KEY))
        if OPENAI_KEY:
            print("Primeros 8 caracteres:", OPENAI_KEY[:8])
        else:
            print("OPENAI_KEY es None")
        print("===========================")

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_KEY}"
        }

        data = {
            "model": "gpt-4o-mini",
            "messages": messages
        }

        try:
            response = requests.post(OPENAI_URL, headers=headers, json=data)

            print("STATUS CODE:", response.status_code)
            print("RESPUESTA RAW:", response.text[:300], "...")
            
            response.raise_for_status()

            reply = response.json()['choices'][0]['message']['content']
            return Response({"reply": reply})

        except Exception as e:
            print("ERROR REAl:", e)
            return Response(
                {"error": "Error interno en el servidor."},
                status=500
            )