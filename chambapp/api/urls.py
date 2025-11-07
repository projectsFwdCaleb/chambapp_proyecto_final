from django.urls import path, include

from .views import *

urlpatterns= [
    # canton_provincia
    path('canton_provincia/',canton_provinciaListCreateView.as_view(),name='get y post canton_provincia'),
    path('canton_provincia/<int:pk>',canton_provinciaRetrieveUpdateDestroyView.as_view(),name='Put,Delete y ById canton_provincias'),
    # Usuario
    path('Usuario/',UsuarioListCreateView.as_view(),name='get y post Usuarios'),
    path('Usuario/<int:pk>',UsuarioRetrieveUpdateDestroyView.as_view(),name='Put,Delete y ById Usuarios'),
    # Categoria
    path('Categoria/',CategoriaListCreateView.as_view(),name='get y post Categorias'),
    path('Categoria/<int:pk>',CategoriaRetrieveUpdateDestroyView.as_view(),name='Put,Delete y ById Categorias'),
    # Servicio
    path('Servicio/',ServicioListCreateView.as_view(),name='get y post Servicios'),
    path('Servicio/<int:pk>',ServicioRetrieveUpdateDestroyView.as_view(),name='Put,Delete y ById Servicios'),
    # Solicitud
    path('Solicitud/',SolicitudListCreateView.as_view(),name='get y post Solicitudes'),
    path('Solicitud/<int:pk>',SolicitudRetrieveUpdateDestroyView.as_view(),name='Put,Delete y ById Solicitudes'),
    # Resenha
    path('Resenha/',ResenhaListCreateView.as_view(),name='get y post Resenhas'),
    path('Resenha/<int:pk>',ResenhaRetrieveUpdateDestroyView.as_view(),name='Put,Delete y ById Resenhas'),
    # Mensaje
    path('Mensaje/',MensajeListCreateView.as_view(),name='get y post Mensajes'),
    path('Mensaje/<int:pk>',MensajeRetrieveUpdateDestroyView.as_view(),name='Put,Delete y ById Mensajes'),
    # Portafolio
    path('Portafolio/',PortafolioListCreateView.as_view(),name='get y post Portafolios'),
    path('Portafolio/<int:pk>',PortafolioRetrieveUpdateDestroyView.as_view(),name='Put,Delete y ById Portafolios'),
    # Notificacion
    path('Notificacion/',NotificacionListCreateView.as_view(),name='get y post Notificaciones'),
    path('Notificacion/<int:pk>',NotificacionRetrieveUpdateDestroyView.as_view(),name='Put,Delete y ById Notificaciones'),
    # Favorito
    path('Favorito/',FavoritoListCreateView.as_view(),name='get y post Favoritos'),
    path('Favorito/<int:pk>',FavoritoRetrieveUpdateDestroyView.as_view(),name='Put,Delete y ById Favoritos'),
]