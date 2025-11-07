from rest_framework import serializers
from .models import *


# canton_provincia
class canton_provinciaSerializers(serializers.ModelSerializer):
    class Meta:
        model = canton_provincia
        fields = '__all__'

# Usuario
class UsuarioSerializers(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

# Categoria
class CategoriaSerializers(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

# servicio
class ServicioSerializers(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__'

# Solicitud
class SolicitudSerializers(serializers.ModelSerializer):
    class Meta:
        model = Solicitud
        fields = '__all__'

# Resenha
class ResenhaSerializers(serializers.ModelSerializer):
    class Meta:
        model = Resenha
        fields = '__all__'

# Mensaje
class MensajeSerializers(serializers.ModelSerializer):
    class Meta:
        model = Mensaje
        fields = '__all__'

# Portafolio
class PortafolioSerializers(serializers.ModelSerializer):
    class Meta:
        model = Portafolio
        fields = '__all__'

# Notificacion
class NotificacionSerializers(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'

# Favorito
class FavoritoSerializers(serializers.ModelSerializer):
    class Meta:
        model = Favorito
        fields = '__all__'

