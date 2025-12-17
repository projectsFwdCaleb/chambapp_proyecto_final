import React, { useEffect, useState } from 'react';
import ServicesResenhas from '../../Services/ServicesResenhas';
import { toast, ToastContainer } from 'react-toastify';
import './ResenhasAdmin.css';
import * as bootstrap from 'bootstrap'

function ResenhasAdmin() {

  // Lista de reseñas
  const [resenhas, setResenhas] = useState([]);

  // Campos del formulario
  const [comentario, setComentario] = useState('');
  const [puntuacion, setPuntuacion] = useState(5);

  // Reseña en edición
  const [editId, setEditId] = useState(null);

  // ID a eliminar
  const [idAEliminar, setIdAEliminar] = useState(null);

  // Cargar al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  // Carga reseñas
  const cargarDatos = async () => {
    try {
      const dataResenhas = await ServicesResenhas.getResenha();
      const resenhasArray = Array.isArray(dataResenhas)
        ? dataResenhas
        : dataResenhas.results || dataResenhas.data || [];

      setResenhas(resenhasArray);

    } catch (error) {
      toast.error("Error cargando reseñas");
    }
  };

  // Validación simple
  const validarFormulario = () => {
    if (!comentario.trim()) { toast.warning("Comentario obligatorio"); return false; }
    if (puntuacion < 1 || puntuacion > 5) { toast.warning("Puntuación inválida (1-5)"); return false; }
    return true;
  };

  // Guardar o actualizar reseña
  const enviarFormulario = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      // Actualizar
      if (editId) {
        await ServicesResenhas.putResenha(editId, {
          comentario,
          puntuacion
        });

        toast.success("Reseña actualizada");

      } else {
        // Crear no está habilitado en esta vista de admin simplificada
        toast.warning("La creación directa desde admin no está habilitada. Use Editar.");
        return;
      }

      // Limpieza del formulario
      setComentario('');
      setPuntuacion(5);
      setEditId(null);

      cargarDatos();

    } catch (error) {
      console.error(error);
      toast.error("Error al guardar");
    }
  };

  // Cargar reseña al formulario
  const editarResenha = (resenha) => {
    setComentario(resenha.comentario);
    setPuntuacion(resenha.puntuacion);
    setEditId(resenha.id);
  };

  // Abre modal con ID
  const abrirModalEliminar = (id) => {
    setIdAEliminar(id);
    const modal = new bootstrap.Modal(document.getElementById("modalEliminarResenha"));
    modal.show();
  };

  // Elimina reseña
  const confirmarEliminar = async () => {
    try {
      await ServicesResenhas.deleteResenha(idAEliminar);
      toast.success("Reseña eliminada");
      cargarDatos();
    } catch {
      toast.error("Error eliminando");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container mt-4 resenhas-admin">

        {/* Título */}
        <h2 className="titulo-principal mb-4">Administrar Reseñas</h2>

        {/* Formulario */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="card-title mb-3">{editId ? 'Editar Reseña' : 'Moderación de Reseñas'}</h3>

            <form onSubmit={enviarFormulario}>

              {/* Comentario */}
              <div className="mb-3">
                <label className="form-label label-resenha">Comentario</label>
                <textarea className="form-control input-resenha" rows="3"
                  value={comentario} onChange={e => setComentario(e.target.value)}
                  disabled={!editId}
                  placeholder="Seleccione una reseña para editar"
                ></textarea>
              </div>

              {/* Puntuación */}
              <div className="mb-3">
                <label className="form-label label-resenha">Puntuación (1-5)</label>
                <input type="number" className="form-control input-resenha"
                  value={puntuacion} onChange={e => setPuntuacion(parseInt(e.target.value))}
                  min="1" max="5"
                  disabled={!editId}
                />
              </div>

              {/* Botones */}
              <div className="d-flex gap-2">
                {editId && (
                  <>
                    <button className="btn btn-primary" type="submit">
                      Actualizar Reseña
                    </button>
                    <button className="btn btn-secondary" type="button"
                      onClick={() => { setEditId(null); setComentario(''); setPuntuacion(5); }}>
                      Cancelar
                    </button>
                  </>
                )}
              </div>

            </form>
          </div>
        </div>

        {/* Tabla */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title mb-3">Lista de Reseñas</h3>

            <div className="table-responsive">
              <table className="table table-hover tabla-resenhas">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Autor</th>
                    <th>Trabajador</th>
                    <th>Puntuación</th>
                    <th>Comentario</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {resenhas.map(r => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      {/* Asumiendo que r.autor y r.trabajador son IDs o nombres */}
                      <td>{r.autor}</td>
                      <td>{r.trabajador}</td>
                      <td>{r.puntuacion} ⭐</td>
                      <td>{r.comentario ? (r.comentario.length > 50 ? r.comentario.substring(0, 50) + '...' : r.comentario) : ''}</td>

                      <td className="text-center">

                        <button className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => editarResenha(r)}>
                          <i className="bi bi-pencil-fill me-1"></i> Editar
                        </button>

                        <button className="btn btn-outline-danger btn-sm"
                          onClick={() => abrirModalEliminar(r.id)}>
                          <i className="bi bi-trash-fill me-1"></i> Eliminar
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>

        {/* Modal eliminar */}
        <div className="modal fade" id="modalEliminarResenha" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h3 className="modal-title">Confirmar eliminación</h3>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body">
                ¿Seguro que deseas eliminar esta reseña?
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>

                <button className="btn btn-danger" data-bs-dismiss="modal"
                  onClick={confirmarEliminar}>
                  Eliminar
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default ResenhasAdmin;