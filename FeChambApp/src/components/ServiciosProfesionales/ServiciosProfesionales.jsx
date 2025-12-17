import React, { useState, useEffect } from 'react';
import ServicesServicio from '../../Services/ServicesServicio';
import ServicesUsuarios from '../../Services/ServicesUsuarios';
import ServicesCategoria from '../../Services/ServicesCategoria';
import ServicesCantones from '../../Services/ServicesCantones';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ServiciosProfesionales.css';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { useUser } from '../../../Context/UserContext';

function ServiciosProfesionales() {
  const { user, setUser } = useUser();
  const [categorias, setCategorias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Estado para Mis Servicios
  const [showMyServicesModal, setShowMyServicesModal] = useState(false);
  const [myServices, setMyServices] = useState([]);
  const [editingService, setEditingService] = useState(null);

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

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchCategorias();
    fetchCantones();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        direccion: user.direccion || '',
        canton_provincia: user.canton_provincia || '',
        foto_perfil: user.foto_perfil || null
      });
      setImagePreview(user.foto_perfil || null);
    }
  }, [user]);

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

  const fetchMyServices = async () => {
    if (!user) return;
    try {
      const data = await ServicesServicio.getServicio({ usuario: user.id });
      setMyServices(Array.isArray(data) ? data : data.results || []);
      setShowMyServicesModal(true);
    } catch (error) {
      console.error("Error al obtener mis servicios", error);
      toast.error("Error al cargar tus servicios");
    }
  };

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

  const handleServiceSubmit = async (e) => {
    e.preventDefault();

    if (editingService) {
      await handleUpdateService();
      return;
    }

    if (!isProfileComplete()) {
      setShowProfileModal(true);
      toast.info("Por favor completa tu perfil antes de agregar un servicio.");
      return;
    }

    // Verificar límite de 3 servicios
    try {
      const currentServices = await ServicesServicio.getServicio({ usuario: user.id });
      const servicesList = Array.isArray(currentServices) ? currentServices : currentServices.results || [];

      if (servicesList.length >= 3) {
        toast.error("Solo puedes tener un máximo de 3 servicios.");
        return;
      }
    } catch (error) {
      console.error("Error al verificar límite de servicios", error);
      toast.error("Error al verificar tus servicios. Intenta de nuevo.");
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

      await ServicesServicio.postServicio(payload);
      toast.success("Servicio creado exitosamente!");

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

  const handleDeleteService = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      try {
        await ServicesServicio.deleteServicio(id);
        toast.success("Servicio eliminado correctamente");
        const data = await ServicesServicio.getServicio({ usuario: user.id });
        setMyServices(Array.isArray(data) ? data : data.results || []);
      } catch (error) {
        console.error("Error al eliminar servicio", error);
        toast.error("Error al eliminar el servicio");
      }
    }
  };

  const prepareEditService = (service) => {
    setEditingService(service);
    setServiceData({
      nombre_servicio: service.nombre_servicio,
      descripcion: service.descripcion,
      precio_referencial: service.precio_referencial || '',
      categoria: service.categoria
    });
    setShowMyServicesModal(false);
    toast.info("Edita los datos en el formulario y guarda los cambios.");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateService = async () => {
    if (!editingService) return;

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

      await ServicesServicio.putServicio(editingService.id, payload);
      toast.success("Servicio actualizado exitosamente!");

      setEditingService(null);
      setServiceData({
        nombre_servicio: '',
        descripcion: '',
        precio_referencial: '',
        categoria: ''
      });
    } catch (error) {
      console.error("Error al actualizar servicio", error);
      toast.error("Error al actualizar el servicio");
    }
  };

  const cancelEdit = () => {
    setEditingService(null);
    setServiceData({
      nombre_servicio: '',
      descripcion: '',
      precio_referencial: '',
      categoria: ''
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        direccion: profileData.direccion,
        canton_provincia: profileData.canton_provincia
      };

      if (profileData.foto_perfil instanceof File) {
        dataToSend.foto_perfil = profileData.foto_perfil;
      }

      await ServicesUsuarios.putUsuarios(user.id, dataToSend);
      setUser({ ...user, ...dataToSend });

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

  const handleServiceChange = (e) => {
    setServiceData({ ...serviceData, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

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

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Ofrecer mis Servicios</h2>
        {user && (
          <Button variant="outline-primary" onClick={fetchMyServices}>
            Mis servicios
          </Button>
        )}
      </div>

      <div className="add-service-section">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">{editingService ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}</h3>
          {editingService && (
            <Button variant="secondary" size="sm" onClick={cancelEdit}>
              Cancelar Edición
            </Button>
          )}
        </div>

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
              <Form.Label className="form-label">Precio Referencial Estimado (₡)</Form.Label>
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
              {editingService ? 'Guardar Cambios' : 'Publicar Servicio'}
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
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  required
                />
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

      {/* Modal Mis Servicios */}
      <Modal
        show={showMyServicesModal}
        onHide={() => setShowMyServicesModal(false)}
        size="lg"
        centered
      >
        <div className='headerModal'>
          <Modal.Header closeButton >
            <Modal.Title>Mis Servicios</Modal.Title>
          </Modal.Header>
        </div>
        <Modal.Body>
          {myServices.length === 0 ? (
            <p className="text-center">No tienes servicios registrados.</p>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {myServices.map((service) => (
                    <tr key={service.id}>
                      <td>{service.nombre_servicio}</td>
                      <td>
                        {categorias.find(c => c.id === service.categoria)?.nombre || service.categoria}
                      </td>
                      <td>{service.precio_referencial || 'N/A'}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => prepareEditService(service)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMyServicesModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ServiciosProfesionales;