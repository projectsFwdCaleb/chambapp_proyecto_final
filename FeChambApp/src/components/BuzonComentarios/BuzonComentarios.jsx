import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import ReactStars from "react-stars";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServicesLogin from '../../Services/ServicesLogin';
import ServicesResenhas from '../../Services/ServicesResenhas';
import ServicesServicio from '../../Services/ServicesServicio';
import '../BuzonComentarios/BuzonComentarios.css'

const ConfirmToast = ({ message, onConfirm, onCancel }) => (
  <div className="toast align-items-center show" role="alert">
    <div className="d-flex">
      <div className="toast-body">{message}</div>
      <div className="ms-auto me-2">
        <button className="btn btn-danger btn-sm me-2" onClick={onConfirm}>
          Eliminar
        </button>
        <button className="btn btn-secondary btn-sm" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
);

function BuzonComentarios({ id }) {
  const [Resenhas, setResenhas] = useState([]);
  const [NuevoComentario, setNuevoComentario] = useState("");
  const [user, setUser] = useState(null);
  const [ServicioElegido, setServicioElegido] = useState("");
  const [services, SetServices] = useState([]);
  const [todosServicios, setTodosServicios] = useState([]);
  const [calificacion, setCalificacion] = useState(0);
  const [confirm, setConfirm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const navegar = useNavigate();

  useEffect(() => {
    traerResenhas();
    traerUser();
    fetchServices();
  }, [id]);

  const traerResenhas = async () => {
    try {
      // el endpoint devuelve { resenhas: [], promedio: X, total: Y }
      const data = await ServicesResenhas.getResenhaByTrabajador(id);
      console.log("Reseñas cargadas:", data.resenhas);
      setResenhas(data.resenhas || []);
    } catch (error) {
      console.error("Error cargando reseñas:", error);
      toast.error("Error al cargar reseñas");
    }
  };

  const traerUser = async () => {
    try {
      const datosU = await ServicesLogin.getUserSession();
      console.log("Usuario en sesión:", datosU);
      setUser(datosU);
    } catch (error) {
      console.error("Error cargando usuario:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await ServicesServicio.getServicio();
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response) ? response : [];

      console.log("Todos los servicios:", data);
      
      //Guardamos TODOS los servicios para poder buscar nombres después
      setTodosServicios(data);

      // Filtrar servicios del trabajador actual (solo para el dropdown)
      const serviciosTrabajador = data.filter((s) => s.usuario === parseInt(id));
      console.log("Servicios del trabajador:", serviciosTrabajador);
      SetServices(serviciosTrabajador);
    } catch (error) {
      console.error("Error cargando servicios:", error);
      toast.error("Error al cargar servicios");
    }
  };

  const editarComentario = (comentario) => {
    setEditingId(comentario.id);
    setNuevoComentario(comentario.comentario);
    setServicioElegido(comentario.servicio);
    setCalificacion(comentario.puntuacion);

    document.querySelector('.buzon_form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setNuevoComentario("");
    setServicioElegido("");
    setCalificacion(0);
  };

  const guardarComentario = async () => {
    if (!user) {
      toast.error("Debe iniciar sesión");
      setTimeout(() => navegar("/loging"), 1500);
      return;
    }

    if (!ServicioElegido) {
      toast.error("Seleccione un servicio");
      return;
    }

    if (calificacion === 0) {
      toast.error("Seleccione una calificación");
      return;
    }

    const opinion = {
      autor: user.id,
      comentario: NuevoComentario,
      servicio: ServicioElegido,
      puntuacion: calificacion,
      trabajador: id
    };

    try {
      if (editingId) {
        const updatedOpinion = await ServicesResenhas.putResenha(editingId, opinion);
        console.log("Reseña actualizada:", updatedOpinion);
        
        // Recargar reseñas para obtener datos completos del servidor
        await traerResenhas();
        toast.success("Comentario actualizado");
        cancelarEdicion();
      } else {
        await ServicesResenhas.postResenha(opinion);
        
        // Recargar reseñas para obtener datos completos del servidor
        await traerResenhas();
        
        setNuevoComentario("");
        setServicioElegido("");
        setCalificacion(0);
        toast.success("Comentario agregado");
      }
    } catch (error) {
      console.error("Error al guardar comentario:", error);
      toast.error(error.message || "Error al guardar el comentario");
    }
  };

  const eliminarComentario = async (idComentario) => {
    setConfirm({
      message: "¿Eliminar este comentario?",
      onConfirm: async () => {
        try {
          await ServicesResenhas.deleteResenha(idComentario);
          setResenhas(Resenhas.filter((c) => c.id !== idComentario));
          toast.success("Comentario eliminado");
        } catch (error) {
          console.error("Error al eliminar:", error);
          toast.error("Error al eliminar");
        }
        setConfirm(null);
      },
      onCancel: () => setConfirm(null),
    });
  };

  // Busca en TODOS los servicios, no solo los del trabajador
  const getNombreServicio = (servicioId) => {
    if (!servicioId) return 'Sin servicio especificado';
    
    const serv = todosServicios.find(s => s.id === servicioId);
    console.log(`Buscando servicio ${servicioId}:`, serv);
    return serv ? serv.nombre_servicio : 'Servicio no disponible';
  };

  return (
    <div className="container mt-4 mb-5">
      <ToastContainer position="top-right" autoClose={3000} />

      {confirm && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
          <ConfirmToast
            message={confirm.message}
            onConfirm={confirm.onConfirm}
            onCancel={confirm.onCancel}
          />
        </div>
      )}

      <h2 className="mb-4 text-center">Opiniones de los usuarios</h2>

      <div className="row">
        {Resenhas.length > 0 ? (
          Resenhas.map((comentario) => (
            <div key={comentario.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm border-0 comentario_card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <img
                       src={comentario.autor_detalle?.foto_perfil || BoosiMan}
                       className="card-avatar-comentario" />
                    <strong className="card-title fw-bold text-primary">
                      {comentario.autor_detalle?.username || `Usuario #${comentario.autor}`}
                    </strong>
                    <div className="d-flex align-items-center">
                      <span className="me-1 fw-bold">{comentario.puntuacion}</span>
                      <span style={{ color: "#ffd700" }}>★</span>
                    </div>
                  </div>

                  <strong className="card-subtitle mb-2 text-muted fst-italic">
                    {getNombreServicio(comentario.servicio)}
                  </strong>

                  <p className="card-text mt-3">"{comentario.comentario}"</p>

                  {user && comentario.autor === user.id && (
                    <div className="mt-3 d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => editarComentario(comentario)}
                      >
                        <i className="bi bi-pencil-square"></i> Editar
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => eliminarComentario(comentario.id)}
                      >
                        <i className="bi bi-trash"></i> Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted">Aún no hay comentarios para este trabajador.</p>
          </div>
        )}
      </div>

      <div className="row justify-content-center mt-5">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow buzon_form p-4">
            <strong className="text-center mb-4">
              {editingId ? "Editar tu comentario" : "Deja tu comentario"}
            </strong>

            <div className="mb-3">
              <label className="form-label">Servicio recibido</label>
              <select
                className="form-select"
                value={ServicioElegido}
                onChange={(e) => setServicioElegido(e.target.value)}
              >
                <option value="">Selecciona un servicio...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre_servicio}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Tu opinión</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Escribe tu experiencia..."
                value={NuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-4 d-flex align-items-center justify-content-between">
              <span className="fw-bold">Calificación:</span>
              <ReactStars
                count={5}
                value={calificacion}
                onChange={(newRating) => setCalificacion(newRating)}
                size={36}
                activeColor="#ffd700"
              />
            </div>

            <div className="d-grid gap-2">
              <button onClick={guardarComentario} className="btn btn-save">
                {editingId ? "Actualizar Comentario" : "Enviar Comentario"}
              </button>
              {editingId && (
                <button onClick={cancelarEdicion} className="btn btn-secondary">
                  Cancelar Edición
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuzonComentarios;