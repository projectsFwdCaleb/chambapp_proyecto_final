from django.shortcuts import render
from .models import * 
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import *
from django.utils import timezone # lapso de tiempo
from datetime import timedelta # tiempo que se resta y se obtiene por ejemplo los ultimos 7 dias
from rest_framework.decorators import api_view # permite que una funcion de python se com´porte como un endpoint
from rest_framework.response import Response # necesario para api view 
from django.db.models import Avg 


# canton_provincia
class canton_provinciaListCreateView(generics.ListCreateAPIView):
    queryset = canton_provincia.objects.all()
    serializer_class=canton_provinciaSerializer
class canton_provinciaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = canton_provincia.objects.all()
    serializer_class=canton_provinciaSerializer  

# Group
class GroupReadOnlyView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

# UsuarioGroup
class UsuarioGroupListCreateView(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class=UsuarioGroupSerializer
class UsuarioGroupUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioGroupSerializer

# Usuario
class UsuarioListCreateView(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class=UsuarioSerializer
class UsuarioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class=UsuarioSerializer    

# Categoria
class CategoriaListCreateView(generics.ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class=CategoriaSerializer
class CategoriaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class=CategoriaSerializer

# Servicio
class ServicioListCreateView(generics.ListCreateAPIView):
    queryset = Servicio.objects.all()
    serializer_class=ServicioSerializer
class ServicioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Servicio.objects.all()
    serializer_class=ServicioSerializer    

# Solicitud
class SolicitudListCreateView(generics.ListCreateAPIView):
    queryset = Solicitud.objects.all()
    serializer_class=SolicitudSerializer
class SolicitudRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Solicitud.objects.all()
    serializer_class=SolicitudSerializer    

# Resenha
class ResenhaListCreateView(generics.ListCreateAPIView):
    queryset = Resenha.objects.all()
    serializer_class=ResenhaSerializer
class ResenhaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Resenha.objects.all()
    serializer_class=ResenhaSerializer    

# Mensaje
class MensajeListCreateView(generics.ListCreateAPIView):
    queryset = Mensaje.objects.all()
    serializer_class=MensajeSerializer
class MensajeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Mensaje.objects.all()
    serializer_class=MensajeSerializer    

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
class NotificacionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notificacion.objects.all()
    serializer_class=NotificacionSerializer    

# Favorito
class FavoritoListCreateView(generics.ListCreateAPIView):
    queryset = Favorito.objects.all()
    serializer_class=FavoritoSerializer
class FavoritoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Favorito.objects.all()
    serializer_class=FavoritoSerializer

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

# Obtener conversaciones de un usuario (personas con las que ha hablado)
@api_view(['GET'])
def conversaciones_usuario(request, usuario_id):
    # Obtener todas las combinaciones remitente/destinatario donde participa el usuario
    ids_conversaciones = (
        Mensaje.objects.filter(Q(remitente_id=usuario_id) | Q(destinatario_id=usuario_id))
        .values_list('remitente_id', 'destinatario_id')
        .distinct()
    )
    #IDs unicos de los otros usuarios
    ids_flat = {i for par in ids_conversaciones for i in par if i != usuario_id}
    # ultimo mensaje de cada conversación
    conversaciones = []
    for uid in ids_flat:
        ultimo_mensaje = (
            Mensaje.objects.filter(
                Q(remitente_id=usuario_id, destinatario_id=uid) |
                Q(remitente_id=uid, destinatario_id=usuario_id))
            .order_by('-fecha_envio')
            .first())
        conversaciones.append({
            'usuario': UsuarioSerializer(Usuario.objects.get(id=uid)).data,
            'ultimo_mensaje': MensajeSerializer(ultimo_mensaje).data if ultimo_mensaje else None})
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

# Obtener solicitudes por categoría
@api_view(['GET'])
def solicitudes_por_categoria(request, categoria_id):
    solicitudes = Solicitud.objects.filter(
        categoria_id=categoria_id,
        estado=True
    ).order_by('-fecha_publicacion')
    serializer = SolicitudSerializer(solicitudes, many=True)
    return Response(serializer.data)

# Obtener reseñas de un trabajador con promedio
@api_view(['GET'])
def resenhas_trabajador(request, trabajador_id):
    resenhas = Resenha.objects.filter(trabajador_id=trabajador_id).order_by('-fecha')
    promedio = resenhas.aggregate(Avg('puntuacion'))
    serializer = ResenhaSerializer(resenhas, many=True)
    return Response({
        'resenhas': serializer.data,
        'promedio': round(promedio['puntuacion__avg'] or 0, 2),
        'total': resenhas.count()
    })