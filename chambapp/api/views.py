from django.shortcuts import render
from .models import * 
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import *
# Create your views here.

# canton_provincia
class canton_provinciaListCreateView(generics.ListCreateAPIView):
    queryset = canton_provincia.objects.all()
    serializer_class=canton_provinciaSerializers
class canton_provinciaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = canton_provincia.objects.all()
    serializer_class=canton_provinciaSerializers  

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
    serializer_class=CategoriaSerializers
class CategoriaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class=CategoriaSerializers  

# Servicio
class servicioListCreateView(generics.ListCreateAPIView):
    queryset = Servicio.objects.all()
    serializer_class=ServicioSerializers
class ServicioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Servicio.objects.all()
    serializer_class=ServicioSerializers    

# Solicitud
class SolicitudListCreateView(generics.ListCreateAPIView):
    queryset = Solicitud.objects.all()
    serializer_class=SolicitudSerializers
class SolicitudRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Solicitud.objects.all()
    serializer_class=SolicitudSerializers    

# Resenha
class ResenhaListCreateView(generics.ListCreateAPIView):
    queryset = Resenha.objects.all()
    serializer_class=ResenhaSerializers
class ResenhaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Resenha.objects.all()
    serializer_class=ResenhaSerializers    

# Mensaje
class MensajeListCreateView(generics.ListCreateAPIView):
    queryset = Mensaje.objects.all()
    serializer_class=MensajeSerializers
class MensajeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Mensaje.objects.all()
    serializer_class=MensajeSerializers    

# Portafolio
class PortafolioListCreateView(generics.ListCreateAPIView):
    queryset = Portafolio.objects.all()
    serializer_class=PortafolioSerializers
class PortafolioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Portafolio.objects.all()
    serializer_class=PortafolioSerializers    

# Notificacion
class NotificacionListCreateView(generics.ListCreateAPIView):
    queryset = Notificacion.objects.all()
    serializer_class=NotificacionSerializers
class NotificacionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notificacion.objects.all()
    serializer_class=NotificacionSerializers    

# Favorito
class FavoritoListCreateView(generics.ListCreateAPIView):
    queryset = Favorito.objects.all()
    serializer_class=FavoritoSerializers
class FavoritoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Favorito.objects.all()
    serializer_class=FavoritoSerializers    
