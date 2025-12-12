import React, { useState, useEffect } from 'react';
import ServicesServicio from '../../Services/ServicesServicio';
import ServicesUsuarios from '../../Services/ServicesUsuarios';
// import ServicesLogin from '../../Services/ServicesLogin'; // Removed
import ServicesCategoria from '../../Services/ServicesCategoria';
import ServicesCantones from '../../Services/ServicesCantones';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ServiciosProfesionales.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { useUser } from '../../../Context/UserContext';

function ServiciosProfesionales() {
  // const [user, setUser] = useState(null); // Removed local state
  const { user, setUser } = useUser(); // Use hook
  const [categorias, setCategorias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Estado del formulario de servicios
  const [serviceData, setServiceData] = useState({
    nombre_servicio: '',
    descripcion: '',
    precio_referencial: '',
    categoria: ''
  });

  // Estado del formulario de perfil
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    direccion: '',
    foto_perfil: null,
    canton_provincia: ''
  });

  // Vista previa de la imagen (misma lógica que en VerPerfil)
  const [imagePreview, setImagePreview] = useState(null);

  // Cargar usuario, categorías y cantones
  useEffect(() => {
    // fetchUserData(); // Removed
    fetchCategorias();
    fetchCantones();
  }, []);

  useEffect(() => {
    if (user) {
      // Rellenar el formulario de perfil
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        direccion: user.direccion || '',
        canton_provincia: user.canton_provincia || '',
        foto_perfil: user.foto_perfil || null
      });

      // Usar la URL existente como preview (puede ser string)
      setImagePreview(user.foto_perfil || null);
    }
  }, [user]);

  /* Removed fetchUserData
  // Obtener datos del usuario en sesión
  const fetchUserData = async () => {
    try {
      const sessionUser = await ServicesLogin.getUserSession();
      if (sessionUser) {
        setUser(sessionUser);

        // Rellenar el formulario de perfil
        setProfileData({
          first_name: sessionUser.first_name || '',
          last_name: sessionUser.last_name || '',
          direccion: sessionUser.direccion || '',
          canton_provincia: sessionUser.canton_provincia || '',
          foto_perfil: sessionUser.foto_perfil || null
        });

        // Usar la URL existente como preview (puede ser string)
        setImagePreview(sessionUser.foto_perfil || null);
      }
    } catch (error) {
      console.error("Error al obtener sesión de usuario", error);
      toast.error("Error al obtener sesión de usuario");
    }
  };
  */

  // Obtener lista de categorías
  const fetchCategorias = async () => {
    try {
      const data = await ServicesCategoria.getCategoria();
      setCategorias(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error al obtener categorias", error);
    }
  };

  // Obtener lista de cantones
  const fetchCantones = async () => {
    try {
      const data = await ServicesCantones.getCanton();
      setCantones(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error al obtener cantones", error);
    }
  };


  // Validar que el perfil esté completo
  const isProfileComplete = () => {
    if (!user) return false;

    return (
      user.first_name &&
      user.last_name &&
      user.direccion &&
      user.foto_perfil &&
      user.canton_provincia
    );
  };

  // Registrar un nuevo servicio
  const handleServiceSubmit = async (e) => {
    e.preventDefault();

    // Evita crear servicio si el perfil está incompleto
    if (!isProfileComplete()) {
      setShowProfileModal(true);
      toast.info("Por favor completa tu perfil antes de agregar un servicio.");
      return;
    }

    try {
      const payload = {
        nombre_servicio: serviceData.nombre_servicio,
        descripcion: serviceData.descripcion,
        categoria: serviceData.categoria ? parseInt(serviceData.categoria, 10) : null,
        precio_referencial: serviceData.precio_referencial !== ''
          ? parseFloat(serviceData.precio_referencial)
          : null,
        usuario: user.id
      };

      console.log(payload);

      //post
      await ServicesServicio.postServicio(payload);
      toast.success("Servicio creado exitosamente!");

      // Reiniciar formulario
      setServiceData({
        nombre_servicio: '',
        descripcion: '',
        precio_referencial: '',
        categoria: ''
      });

    } catch (error) {
      console.error("Error al crear el servicio:", error);
      toast.error("Error al crear el servicio");
    }
  };

  // Guardar cambios en el perfil
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        direccion: profileData.direccion,
        canton_provincia: profileData.canton_provincia
      };

      // Enviar foto solo si es un File (nueva seleccionada)
      if (profileData.foto_perfil instanceof File) {
        dataToSend.foto_perfil = profileData.foto_perfil;
      }

      await ServicesUsuarios.putUsuarios(user.id, dataToSend);

      // Actualizar estado local del usuario (ahora global)
      setUser({ ...user, ...dataToSend });

      // Si subieron una nueva foto, actualizar preview y user.foto_perfil con la URL temporal
      if (profileData.foto_perfil instanceof File) {
        const newPreview = URL.createObjectURL(profileData.foto_perfil);
        setImagePreview(newPreview);
        setUser(prev => ({ ...prev, foto_perfil: newPreview }));
      }

      setShowProfileModal(false);
      toast.success("Perfil actualizado correctamente. Ahora puedes agregar tu servicio.");

    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar perfil");
    }
  };

  // Manejar cambios del formulario de servicio
  const handleServiceChange = (e) => {
    setServiceData({ ...serviceData, [e.target.name]: e.target.value });
  };

  // Manejar cambios del formulario de perfil (no incluye la foto)
  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Manejar cambio de foto para el perfil (misma lógica que VerPerfil)
  const handleProfileImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setProfileData(prev => ({ ...prev, foto_perfil: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="servicios-profesionales-container text-dark">
      <ToastContainer position="top-right" theme="dark" />

      <h2 className="page-title">Ofrecer mis Servicios</h2>

      <div className="add-service-section">
        <h3 className="mb-4">Agregar Nuevo Servicio</h3>
        <Form onSubmit={handleServiceSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label className="form-label">Nombre del Servicio</Form.Label>
              <Form.Control
                type="text"
                name="nombre_servicio"
                value={serviceData.nombre_servicio}
                onChange={handleServiceChange}
                required
                placeholder="Ej: Plomería Residencial"
              />
            </div>

            <div className="col-md-6 mb-3">
              <Form.Label className="form-label">Categoría</Form.Label>
              <Form.Select
                name="categoria"
                value={serviceData.categoria}
                onChange={handleServiceChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </Form.Select>
            </div>

            <div className="col-md-12 mb-3">
              <Form.Label className="form-label">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={serviceData.descripcion}
                onChange={handleServiceChange}
                required
                placeholder="Describe detalladamente lo que ofreces..."
              />
            </div>

            <div className="col-md-6 mb-3">
              <Form.Label className="form-label">precio_referencial Estimado (₡)</Form.Label>
              <Form.Control
                type="number"
                name="precio_referencial"
                value={serviceData.precio_referencial}
                onChange={handleServiceChange}
                placeholder="0.00 (opcional)"
              />
            </div>
          </div>

          <div className="text-end mt-3">
            <Button className='btn-save' type="submit">
              Publicar Servicio
            </Button>
          </div>
        </Form>
      </div>

      {/* Modal para completar perfil */}
      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        backdrop="static"
        keyboard={false}
        centered
        className="profile-modal"
        contentClassName="dark-modal"
      >
        <Modal.Header closeButton closeVariant="dark">
          <Modal.Title>Completa tu Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-dark mb-4">
            Para convertirte en trabajador y ofrecer servicios, necesitamos que completes tu información de perfil.
          </p>
          <Form onSubmit={handleProfileUpdate}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={profileData.first_name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={profileData.last_name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <Form.Label className="form-label">Cantón</Form.Label>
                <Form.Select
                  name="canton_provincia"
                  value={profileData.canton_provincia}
                  onChange={handleProfileChange}
                  required
                >
                  <option value="">Selecciona un cantón</option>
                  {cantones.map(can => (
                    <option key={can.id} value={can.id}>{can.nombre}</option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-md-12 mb-3">
                <Form.Label>Foto de perfil</Form.Label>
                {/* No usar value en input type=file; usar el mismo manejo que VerPerfil */}
                <Form.Control
                  type="file"
                  name="foto_perfil"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  required
                />
                {/* Mostrar preview si existe */}
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '120px', borderRadius: '6px' }} />
                  </div>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="direccion"
                  value={profileData.direccion}
                  onChange={handleProfileChange}
                  required
                />
              </div>
            </div>
            <div className="d-grid gap-2 mt-4">
              <Button variant="success" type="submit">
                Guardar y Continuar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ServiciosProfesionales;