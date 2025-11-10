from django.shortcuts import render
from .models import * 
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import *
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