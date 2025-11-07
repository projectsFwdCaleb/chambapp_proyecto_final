from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password


# canton_provincia
class canton_provinciaSerializers(serializers.ModelSerializer):
    class Meta:
        model = canton_provincia
        fields = '__all__'

# Usuario
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'password', 'email', 'Nombre', 'Apellido', 'Correo', 'foto_perfil', 'verificado', 'canton_provincia', 'direccion', 'latitud','longitud','calificacion_promedio', 'fecha_registro']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

# Categoria
class CategoriaSerializers(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

# Servicio
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

