from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

# Usuario en sesión
class UserSerializer(serializers.ModelSerializer):
    grupos = serializers.SerializerMethodField()
    servicios = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'foto_perfil',
            'grupos',
            'servicios',
            'direccion', 
            'canton_provincia'
        ]

    def get_grupos(self, obj):
        # Esto lee los grupos desde la tabla usuario_groups
        return list(obj.groups.values_list("name", flat=True))
    
    def get_servicios(self, obj):
        return list(obj.servicios.values_list("nombre_servicio", flat=True))

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.foto_perfil:
            representation['foto_perfil'] = instance.foto_perfil.url
        return representation


# canton_provincia
class canton_provinciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = canton_provincia
        fields = '__all__'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        groups = self.user.groups.values_list('name', flat=True)

        data['role'] = groups[0] if groups else None
        data['id'] = self.user.id 
        
        return data

#UsuarioGroup
class UsuarioGroupSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Group.objects.all()
    )
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'groups']
        read_only_fields = ['id', 'username']  # <--- importante
        
#group 
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']  # solo campos básicos

# Usuario
class UsuarioSerializer(serializers.ModelSerializer):
    servicios = serializers.SerializerMethodField()
    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'password', 'email', 'first_name', 'last_name',
            'foto_perfil', 'verificado', 'canton_provincia', 'direccion',
            'latitud', 'longitud', 'calificacion_promedio', 'fecha_registro',
            'servicios'
        ]
        extra_kwargs = {
            'password': {'write_only': True},  # La contraseña solo se usa al crear o actualizar
            'email': {'required': True},       # El email debe ser obligatorio
            'username': {'required': True},    # El username también
        }

    def get_servicios(self, obj):
        return list(obj.servicios.values_list("nombre_servicio", flat=True))

    def validate_email(self, value):
        user = self.instance
        if user and user.email == value:
            return value
        
        qs = Usuario.objects.filter(email=value)
        if user:
            qs = qs.exclude(id=user.id)
            
        if qs.exists():
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

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.foto_perfil:
            representation['foto_perfil'] = instance.foto_perfil.url
        return representation


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
    nombre = serializers.CharField(source='nombre_servicio', read_only=True)

    class Meta:
        model = Servicio
        # incluimos explicitamente los campos que necesitamos (evita confusiones)
        fields = [
            'id',
            'usuario',
            'categoria',
            'nombre_servicio',
            'nombre',  # alias práctico para frontend
            'descripcion',
            'precio_referencial',
            'disponibilidad',
            'whatsapp_contacto'
        ]

    def validate_precio_referencial(self, value):
        # El precio no puede ser negativo
        if value is not None and value < 0:
            raise serializers.ValidationError("El precio no puede ser negativo.")
        return value

    def validate(self, data):
        # Manejo de actualizaciones parciales (PATCH)
        # Si 'usuario'/'nombre_servicio' no viene en data, lo tomamos de la instancia
        usuario = data.get('usuario')
        nombre = data.get('nombre_servicio')

        if self.instance:
            if not usuario:
                usuario = self.instance.usuario
            if not nombre:
                nombre = self.instance.nombre_servicio

        # Validar usuario obligatorio
        if not usuario:
            raise serializers.ValidationError("El usuario es requerido.")
        
        # Lógica diferenciada para Creación vs Actualización
        if self.instance:
            # ESTAMOS ACTUALIZANDO
            # Solo verificamos duplicado si el nombre existe en OTRO servicio (excluyendo el actual)
            if nombre and Servicio.objects.filter(usuario=usuario, nombre_servicio__iexact=nombre).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("Ya tienes un servicio con ese nombre.")
        else:
            # ESTAMOS CREANDO
            # Evita más de 3 servicios
            if Servicio.objects.filter(usuario=usuario).count() >= 3:
                raise serializers.ValidationError("No puedes registrar más de 3 servicios.")
            # Evita duplicados por nombre
            if nombre and Servicio.objects.filter(usuario=usuario, nombre_servicio__iexact=nombre).exists():
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
    
    def validate_numero_activas(self, datos):
        user = datos['usuario']
        activas = Solicitud.objects.filter(usuario=user, estado=True).count()
        if activas >= 3:
            raise serializers.ValidationError("Solo se puede tener 3 solicitudes activas a la vez")
        return datos

# Resenha
class ResenhaSerializer(serializers.ModelSerializer):
    autor_detalle = UserSerializer(source='autor', read_only=True)
    class Meta:
        model = Resenha
        fields = [
            'id', 'autor', 'autor_detalle', 'trabajador',
            'puntuacion', 'comentario', 'fecha', 'servicio'
        ]
    
    def validate_puntuacion(self, value):
        # La puntuación debe estar entre 1 y 5
        if not 1 <= value <= 5:
            raise serializers.ValidationError("La puntuación debe estar entre 1 y 5.")
        return value

    def validate(self, data):
        # Manejo de partial update
        autor = data.get('autor')
        trabajador = data.get('trabajador')

        if self.instance:
            if not autor:
                autor = self.instance.autor
            if not trabajador:
                trabajador = self.instance.trabajador

        # Evita que un usuario se reseñe a sí mismo
        if autor and trabajador and autor == trabajador:
            raise serializers.ValidationError("No puedes reseñarte a ti mismo.")
        
        # Verificamos duplicado, excluyendo la propia reseña si es update
        if autor and trabajador:
            qs = Resenha.objects.filter(autor=autor, trabajador=trabajador)
            if self.instance:
                qs = qs.exclude(id=self.instance.id)
            
            if qs.exists():
                raise serializers.ValidationError("Ya has reseñado a este trabajador.")
        return data

# Mensaje
class MensajeSerializer(serializers.ModelSerializer):
    contenido = serializers.CharField(write_only=True)  # nombre lógico, el texto plano

    class Meta:
        model = Mensaje
        fields = ['id', 'remitente', 'destinatario', 'contenido', 'fecha_envio']
        read_only_fields = ['fecha_envio']

    def create(self, validated_data):
        contenido_texto = validated_data.pop('contenido')
        mensaje = Mensaje.objects.create(**validated_data)
        mensaje.set_contenido(contenido_texto)  # ✅ usa el método real del modelo
        mensaje.save()
        return mensaje

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['contenido'] = instance.get_contenido()  # ✅ se descifra al devolver
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

