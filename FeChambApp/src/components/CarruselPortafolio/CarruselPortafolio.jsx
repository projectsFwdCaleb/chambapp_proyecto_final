import React, { useEffect, useState } from "react";
import ServicesPortafolio from "../../Services/ServicesPortafolio";
import ServicesLogin from "../../Services/ServicesLogin";
import { Carousel } from "react-bootstrap";
import "./CarruselPortafolio.css";

function CarruselPortafolio({ id }) {

  // Estado principal
  const [portafolio, setPortafolio] = useState([]);
  const [user, setUser] = useState(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);

  // Preview imagen
  const [previewImg, setPreviewImg] = useState(null);

  // Formulario
  const [form, setForm] = useState({
    usuario: "",
    titulo: "",
    descripcion: "",
    imagen: "",
  });

  // Formatear fecha (dd/mm/yyyy)
  const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-CR");
  };

  // Usuario en sesión
  const fetchUser = async () => {
    try {
      const data = await ServicesLogin.getUserSession();
      setUser(data);
    } catch (error) {
      console.error("Error obteniendo user:", error);
    }
  };

  // Obtener portafolio del usuario de la página
  const fetchPortafolio = async () => {
    try {
      const data = await ServicesPortafolio.getPortafolio(id);
      setPortafolio(data || []);
    } catch (error) {
      console.error("Error trayendo portafolio:", error);
    }
  };

  // Cargar al montar
  useEffect(() => {
    fetchUser();
    fetchPortafolio();
  }, []);

  // Cuando tengamos user → poner su id en el form para crear
  useEffect(() => {
    if (user && user.id) {
      setForm((prev) => ({ ...prev, usuario: user.id }));
    }
  }, [user]);

  // Abrir modal para agregar
  const abrirModalNuevo = () => {
    setModoEditar(false);
    setForm({
      usuario: user.id,
      titulo: "",
      descripcion: "",
      imagen: "",
    });
    setPreviewImg(null);
    setShowModal(true);
  };

  // Abrir modal para editar
  const abrirModalEditar = (item) => {
    setModoEditar(true);
    setForm({
      usuario: item.usuario,
      titulo: item.titulo,
      descripcion: item.descripcion,
      imagen: item.imagen,
      id: item.id,
    });
    setPreviewImg(item.imagen);
    setShowModal(true);
  };

  // Convertir imagen a Base64
  const handleImagen = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imagen: reader.result }));
      setPreviewImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Guardar (crear o editar)
  const guardarPortafolio = async () => {
    try {
      if (modoEditar) {
        await ServicesPortafolio.putPortafolio(form.id, form);
      } else {
        await ServicesPortafolio.postPortafolio(form);
      }

      setShowModal(false);
      fetchPortafolio();
    } catch (error) {
      console.error("Error guardando portafolio:", error);
    }
  };

  // Eliminar
  const eliminarPortafolio = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este proyecto?")) return;

    try {
      await ServicesPortafolio.deletePortafolio(id);
      fetchPortafolio();
    } catch (error) {
      console.error("Error eliminando portafolio:", error);
    }
  };

  const portafolioFiltrado = portafolio.filter(item => item.usuario === id);

  return (
    <div className="carrusel-container container py-4">

      {/* BOTÓN PARA AGREGAR (solo dueño) */}
      {user?.id == id && (
        <div className="text-end mb-3">
          <button className="btn-portafolio btn-portafolio-add" onClick={abrirModalNuevo}>
            + Agregar Proyecto
          </button>
        </div>
      )}

      {/* CARRUSEL */}
      {portafolioFiltrado.length > 0 ? (
        <Carousel interval={null}>
          {portafolioFiltrado.map((item) => (
            <Carousel.Item key={item.id}>
              <div className="portafolio-slide">

                {/* Imagen */}
                <div className="portafolio-img">
                  <img src={item.imagen} alt="Proyecto" />
                </div>

                {/* Información */}
                <div className="portafolio-info">
                  <h3>{item.titulo}</h3>
                  <div className="fecha">{formatFecha(item.fecha)}</div>
                  <p className="descripcion">{item.descripcion}</p>

                  {/* BOTONES DE EDITAR/ELIMINAR – Solo dueño */}
                  {user?.id == id && (
                    <div className="d-flex gap-3 mt-3">
                      <button
                        className="btn-portafolio btn-portafolio-edit w-50"
                        onClick={() => abrirModalEditar(item)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn-portafolio btn-portafolio-delete w-50"
                        onClick={() => eliminarPortafolio(item.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p className="text-light text-center">No hay proyectos en el portafolio</p>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content modal-portafolio">

              <div className="modal-header">
                <h5 className="modal-title">
                  {modoEditar ? "Editar Proyecto" : "Nuevo Proyecto"}
                </h5>
                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body">

                {/* Imagen */}
                <div className="preview-img-container mb-3">
                  <img
                    src={previewImg || "/default-photo.png"}
                    alt="preview"
                  />

                  <label className="upload-btn" htmlFor="input-imagen-portafolio">
                    📷
                  </label>

                  <input
                    id="input-imagen-portafolio"
                    type="file"
                    accept="image/*"
                    onChange={handleImagen}
                  />
                </div>

                {/* Título */}
                <input
                  type="text"
                  placeholder="Título del proyecto"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="mb-3"
                />

                {/* Descripción */}
                <textarea
                  rows="4"
                  placeholder="Descripción del proyecto"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                ></textarea>

              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>

                <button className="btn btn-primary" onClick={guardarPortafolio}>
                  Guardar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Fondo oscuro del modal */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default CarruselPortafolio;
