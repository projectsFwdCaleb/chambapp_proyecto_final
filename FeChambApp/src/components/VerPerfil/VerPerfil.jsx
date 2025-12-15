import React, { useState, useEffect } from 'react';
// import ServicesLogin from '../../Services/ServicesLogin'; // Removed
import ServicesUsuarios from '../../Services/ServicesUsuarios';
import ServicesCantones from '../../Services/ServicesCantones';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VerPerfil.css';
import { Form, Button } from 'react-bootstrap';
import { useUser } from '../../../Context/UserContext';

function VerPerfil() {
  // Datos del usuario
  // const [user, setUser] = useState(null); // Removed local state
  const { user, setUser } = useUser(); // Use hook

  // Lista de cantones
  const [cantones, setCantones] = useState([]);

  // Control de carga
  const [loading, setLoading] = useState(true);

  // Vista previa de la imagen
  const [imagePreview, setImagePreview] = useState(null);

  // Campos individuales para edición
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [cantonProvincia, setCantonProvincia] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);

  // Cargar datos al iniciar
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setEmail(user.email || '');
      setDireccion(user.direccion || '');
      setCantonProvincia(user.canton_provincia || '');
      setImagePreview(user.foto_perfil);
    }
  }, [user]);

  // Obtener datos del usuario y la lista de cantones
  const fetchData = async () => {
    try {
      // const sessionUser = await ServicesLogin.getUserSession(); // Removed
      const cantonesData = await ServicesCantones.getCanton();

      // Asegurar que cantones sea lista válida
      setCantones(Array.isArray(cantonesData) ? cantonesData : cantonesData.results || []);


      setLoading(false);
    } catch (error) {
      console.error("Error loading profile data:", error);
      toast.error("Error al cargar datos del perfil");
      setLoading(false);
    }
  };

  // Manejar cambio de foto
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFotoPerfil(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
  e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("direccion", direccion);
      formData.append("canton_provincia", cantonProvincia);

      // Agregar imagen solo si existe
      if (fotoPerfil instanceof File) {
        formData.append("foto_perfil", fotoPerfil);
      }

      await ServicesUsuarios.putUsuarios(user.id, formData);

      const updatedUser = {
        ...user,
        first_name: firstName,
        last_name: lastName,
        email,
        direccion,
        canton_provincia: cantonProvincia,
      };

      if (fotoPerfil instanceof File) {
        updatedUser.foto_perfil = URL.createObjectURL(fotoPerfil);
      }

      setUser(updatedUser);

      toast.success("Perfil actualizado correctamente");

    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar el perfil");
    }
  };

  // Mostrar carga
  if (loading) return <div className="text-center mt-5">Cargando perfil...</div>;

  return (
    <div className="ver-perfil-container">
      <ToastContainer position="top-right" theme="colored" autoClose={3000} closeOnClick pauseOnHover/>

      <div className="profile-card">

        {/* Encabezado del perfil */}
        <div className="profile-header">

          {/* Imagen de perfil */}
          <div className="profile-image-container">
            <img
              src={imagePreview || "/default-profile.png"}
              alt="Perfil"
              className="profile-image"
            />

            {/* Botón para seleccionar foto */}
            <label htmlFor="photo-upload" className="profile-image-upload">
              <span className="upload-icon">📷</span>
            </label>

            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Nombre de usuario */}
          <h2 className="section-title">{user?.username}</h2>
          <p className="section-subtitle">Gestiona tu información personal</p>
        </div>

        {/* Formulario de edición */}
        <Form onSubmit={handleSubmit}>

          <div className="row">

            {/* Nombre */}
            <div className="col-md-6 mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            {/* Apellido */}
            <div className="col-md-6 mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            {/* Correo */}
            <div className="col-md-6 mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Cantón */}
            <div className="col-md-6 mb-3">
              <Form.Label>Cantón</Form.Label>
              <Form.Select
                value={cantonProvincia}
                onChange={(e) => setCantonProvincia(e.target.value)}
                required
              >
                <option value="">Selecciona tu cantón</option>
                {cantones.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </Form.Select>
            </div>

            {/* Dirección */}
            <div className="col-md-12 mb-3">
              <Form.Label>Dirección exacta</Form.Label>
              <Form.Control
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Botón para guardar */}
          <div className="text-center mt-4">
            <Button type="submit" variant="primary" className="btn-save">
              Guardar Cambios
            </Button>
          </div>

        </Form>
      </div>
    </div>
  );
}

export default VerPerfil;
