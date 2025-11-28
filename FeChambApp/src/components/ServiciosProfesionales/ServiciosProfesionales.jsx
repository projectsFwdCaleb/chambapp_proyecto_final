import React, { useState, useEffect } from 'react';
import ServicesServicio from '../../Services/ServicesServicio';
import ServicesUsuarios from '../../Services/ServicesUsuarios';
import ServicesLogin from '../../Services/ServicesLogin';
import ServicesCategoria from '../../Services/ServicesCategoria';
import ServicesCantones from '../../Services/ServicesCantones';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ServiciosProfesionales.css';
import { Modal, Button, Form } from 'react-bootstrap';

function ServiciosProfesionales() {
  const [user, setUser] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Service Form State
  const [serviceData, setServiceData] = useState({
    nombre_servicio: '',
    descripcion: '',
    precio: '',
    categoria: ''
  });

  // Profile Form State
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    telefono: '',
    direccion: '',
    foto_perfil: null
  });


// seccion de gets
  useEffect(() => {
    fetchUserData();
    fetchCategorias();
    fetchCantones();
  }, []);

  const fetchUserData = async () => {
    try {
      const sessionUser = await ServicesLogin.getUserSession();
      if (sessionUser) {
        setUser(sessionUser);

        // Pre-fill profile form
        setProfileData({
          first_name: sessionUser.first_name || '',
          last_name: sessionUser.last_name || '',
          email: sessionUser.email || '',
          telefono: sessionUser.telefono || '',
          direccion: sessionUser.direccion || '',
          canton_provincia: sessionUser.canton_provincia || '',
          foto_perfil: sessionUser.foto_perfil || null
        });
      }
    } catch (error) {
      console.error("Error al obtener sesión de usuario", error);
      toast.error("Error al obtener sesión de usuario");
    }
  };

  const fetchCategorias = async () => {
    try {
      const data = await ServicesCategoria.getCategoria();
      setCategorias(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error al obtener categorias", error);
    }
  };

  const fetchCantones = async () => {
    try {
      const data = await ServicesCantones.getCanton();
      setCantones(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error al obtener cantones", error);
    }
  };
  


//Validar si el perfil esta completo y luego registrar el servicio
  const isProfileComplete = () => {
    if (!user) return false;
    // Check required fields. Adjust based on actual model requirements.
    // The user mentioned "first_name" specifically caused the error.
    return (
      user.first_name &&
      user.last_name &&
      user.email &&
      user.telefono &&
      user.direccion &&
      user.foto_perfil &&
      user.canton_provincia
    );
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();

    if (!isProfileComplete()) {
      setShowProfileModal(true);
      toast.info("Por favor completa tu perfil antes de agregar un servicio.");
      return;
    }

    try {
      const payload = {
        ...serviceData,
        usuario: user.id // Associate service with current user
      };

      await ServicesServicio.postServicio(payload);
      toast.success("Servicio creado exitosamente!");

      // Reset form
      setServiceData({
        nombre_servicio: '',
        descripcion: '',
        precio: '',
        categoria: ''
      });

    } catch (error) {
      console.error("Error al crear el servicio:", error);
      toast.error("Error al crear el servicio");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      // Update user profile
      await ServicesUsuarios.putUsuarios(user.id, profileData);

      // Update local user state
      setUser({ ...user, ...profileData });

      setShowProfileModal(false);
      toast.success("Perfil actualizado correctamente. Ahora puedes agregar tu servicio.");

    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar perfil");
    }
  };

  const handleServiceChange = (e) => {
    setServiceData({ ...serviceData, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
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
              <Form.Label className="form-label">Precio Estimado (₡)</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={serviceData.precio}
                onChange={handleServiceChange}
                placeholder="0.00 (opcional)"
              />
            </div>
          </div>

          <div className="text-end mt-3">
            <Button variant="primary" type="submit" size="lg">
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
                <Form.Control
                  type="file"
                  name="foto_perfil"
                  value={profileData.foto_perfil}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={profileData.telefono}
                  onChange={handleProfileChange}
                  required
                />
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