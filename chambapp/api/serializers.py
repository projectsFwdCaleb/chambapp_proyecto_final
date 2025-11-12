from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group


# canton_provincia
class canton_provinciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = canton_provincia
        fields = '__all__'

#UsuarioGroup
class UsuarioGroupSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Group.objects.all()  # Necesario para poder asignar grupos existentes
    )
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'groups']
#group 
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']  # solo campos básicos

# Usuario
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'password', 'email', 'first_name', 'last_name',
            'foto_perfil', 'verificado', 'canton_provincia', 'direccion',
            'latitud', 'longitud', 'calificacion_promedio', 'fecha_registro'
        ]
        extra_kwargs = {
            'password': {'write_only': True},  # La contraseña solo se usa al crear o actualizar
            'email': {'required': True},       # El email debe ser obligatorio
            'username': {'required': True},    # El username también
        }

    def validate_email(self, value):
        # Verifica que el email no esté repetido
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("El correo electrónico ya está registrado.")
        return value

    def validate_password(self, value):
        # Verifica que la contraseña tenga al menos 8 caracteres
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        return value

    def create(self, validated_data):
        # Encripta la contraseña antes de guardar el usuario
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


# Categoria
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

    def validate_nombre(self, value):
        # El nombre no puede estar vacío ni contener solo espacios
        if not value.strip():
            raise serializers.ValidationError("El nombre de la categoría no puede estar vacío.")
        return value

# Servicio
class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__'

    def validate_precio_referencial(self, value):
        # El precio no puede ser negativo
        if value is not None and value < 0:
            raise serializers.ValidationError("El precio no puede ser negativo.")
        return value

    def validate(self, data):
        # Evita que el mismo usuario cree dos servicios con el mismo nombre
        usuario = data.get('usuario')
        nombre = data.get('nombre_servicio')
        if Servicio.objects.filter(usuario=usuario, nombre_servicio__iexact=nombre).exists():
            raise serializers.ValidationError("Ya tienes un servicio con ese nombre.")
        return data


# Solicitud
class SolicitudSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solicitud
        fields = '__all__'

    def validate(self, data):
        # Verifica que las coordenadas sean válidas si existen
        lat = data.get('latitud')
        lon = data.get('longitud')
        if lat is not None and not (-90 <= lat <= 90):
            raise serializers.ValidationError("Latitud fuera del rango válido (-90 a 90).")
        if lon is not None and not (-180 <= lon <= 180):
            raise serializers.ValidationError("Longitud fuera del rango válido (-180 a 180).")
        return data

# Resenha
class ResenhaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resenha
        fields = '__all__'
    
    def validate_puntuacion(self, value):
        # La puntuación debe estar entre 1 y 5
        if not 1 <= value <= 5:
            raise serializers.ValidationError("La puntuación debe estar entre 1 y 5.")
        return value

    def validate(self, data):
        # Evita que un usuario se reseñe a sí mismo
        if data['autor'] == data['trabajador']:
            raise serializers.ValidationError("No puedes reseñarte a ti mismo.")
        return data


# Mensaje
class MensajeSerializer(serializers.ModelSerializer):
    contenido_cifrado = serializers.CharField(write_only=True)
    class Meta:
        model = Mensaje
        fields = ['id', 'remitente', 'destinatario', 'contenido_cifrado', 'fecha_envio']
        read_only_fields = ['fecha_envio']
    # manejar contenido cifrado
    def create(self, validated_data):
        contenido_texto = validated_data.pop('contenido_cifrado')
        mensaje = Mensaje.objects.create(**validated_data)
        mensaje.set_contenido_cifrado(contenido_texto)
        mensaje.save()
        return mensaje
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['contenido_cifrado'] = instance.get_contenido_cifrado()
        return representation

   # def validate(self, data):
        # Evita que un usuario se envíe mensajes a sí mismo
       # if data['remitente'] == data['destinatario']:
        #    raise serializers.ValidationError("No puedes enviarte mensajes a ti mismo.")
      #  return data

# Portafolio
class PortafolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portafolio
        fields = '__all__'
    
    def validate_titulo(self, value):
        # Verifica que el título no esté vacío
        if not value.strip():
            raise serializers.ValidationError("El título del proyecto no puede estar vacío.")
        return value

# Notificacion
class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'
        read_only_fields = ['fecha_envio']  # La fecha se genera automáticamente al crear

# Favorito
class FavoritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorito
        fields = '__all__'
    
    def validate(self, data):
        # Evita que un usuario se agregue a sí mismo como favorito
        if data['usuario'] == data['trabajador']:
            raise serializers.ValidationError("No puedes agregarte a ti mismo como favorito.")
        return data

