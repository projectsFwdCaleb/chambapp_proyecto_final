import React, { useEffect, useState } from 'react';
import ServicesSolicitudes from '../../Services/ServicesSolicitudes';
import { toast, ToastContainer } from 'react-toastify';
import './SolicitudesAdmin.css';
import * as bootstrap from 'bootstrap'

function SolicitudesAdmin() {

  // Lista de solicitudes
  const [solicitudes, setSolicitudes] = useState([]);

  // Campos del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState(true); // true = Activa, false = Cerrada

  // Solicitud en edición
  const [editId, setEditId] = useState(null);

  // ID a eliminar
  const [idAEliminar, setIdAEliminar] = useState(null);

  // Cargar al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  // Carga solicitudes
  const cargarDatos = async () => {
    try {
      const dataSolicitudes = await ServicesSolicitudes.getSolicitudes();
      const solicitudesArray = Array.isArray(dataSolicitudes)
        ? dataSolicitudes
        : dataSolicitudes.results || dataSolicitudes.data || [];

      setSolicitudes(solicitudesArray);

    } catch (error) {
      toast.error("Error cargando solicitudes");
    }
  };

  // Validación simple
  const validarFormulario = () => {
    if (!titulo.trim()) { toast.warning("Título obligatorio"); return false; }
    if (!descripcion.trim()) { toast.warning("Descripción obligatoria"); return false; }
    return true;
  };

  // Guardar o actualizar solicitud
  const enviarFormulario = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      // Actualizar
      if (editId) {
        await ServicesSolicitudes.putSolicitud(editId, {
          titulo,
          descripcion,
          estado
        });

        toast.success("Solicitud actualizada");

      } else {
        // Crear (Nota: Crear solicitud requiere usuario, categoria, etc. 
        // Como es admin, quizás falten datos si no se seleccionan. 
        // Por ahora asumimos que es moderación y edición principalmente, 
        // pero si se crea, el backend podría requerir campos obligatorios que no estamos enviando.
        // Si falla, el usuario verá el error. Para "moderar", editar y eliminar es lo clave.)

        // Para crear necesitaríamos el ID del usuario actual o seleccionarlo.
        // Como no tenemos select de usuarios, esto podría fallar si el backend requiere 'usuario'.
        // Dejaremos la lógica pero advertiremos si falla.

        // await ServicesSolicitudes.postSolicitud({
        //   titulo, descripcion, estado
        // });
        // toast.success("Solicitud creada");

        toast.warning("La creación directa desde admin requiere asignar usuario (pendiente de implementación). Use Editar.");
        return;
      }

      // Limpieza del formulario
      setTitulo('');
      setDescripcion('');
      setEstado(true);
      setEditId(null);

      cargarDatos();

    } catch (error) {
      console.error(error);
      toast.error("Error al guardar");
    }
  };

  // Cargar solicitud al formulario
  const editarSolicitud = (solicitud) => {
    setTitulo(solicitud.titulo);
    setDescripcion(solicitud.descripcion);
    setEstado(solicitud.estado);
    setEditId(solicitud.id);
  };

  // Abre modal con ID
  const abrirModalEliminar = (id) => {
    setIdAEliminar(id);
    const modal = new bootstrap.Modal(document.getElementById("modalEliminarSolicitud"));
    modal.show();
  };

  // Elimina solicitud
  const confirmarEliminar = async () => {
    try {
      await ServicesSolicitudes.deleteSolicitud(idAEliminar);
      toast.success("Solicitud eliminada");
      cargarDatos();
    } catch {
      toast.error("Error eliminando");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container mt-4 solicitudes-admin">

        {/* Título */}
        <h2 className="titulo-principal mb-4">Administrar Solicitudes</h2>

        {/* Formulario */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="card-title mb-3">{editId ? 'Editar Solicitud' : 'Moderación de Solicitudes'}</h3>

            <form onSubmit={enviarFormulario}>

              {/* Título */}
              <div className="mb-3">
                <label className="form-label label-solicitud">Título</label>
                <input type="text" className="form-control input-solicitud"
                  value={titulo} onChange={e => setTitulo(e.target.value)}
                  disabled={!editId} // Solo permitir editar si se seleccionó una
                  placeholder="Seleccione una solicitud para editar"
                />
              </div>

              {/* Descripción */}
              <div className="mb-3">
                <label className="form-label label-solicitud">Descripción</label>
                <textarea className="form-control input-solicitud" rows="3"
                  value={descripcion} onChange={e => setDescripcion(e.target.value)}
                  disabled={!editId}
                ></textarea>
              </div>

              {/* Estado */}
              <div className="mb-3">
                <label className="form-label label-solicitud">Estado</label>
                <select className="form-select select-solicitud"
                  value={estado ? 'true' : 'false'}
                  onChange={e => setEstado(e.target.value === 'true')}
                  disabled={!editId}
                >
                  <option value="true">Activa</option>
                  <option value="false">Cerrada</option>
                </select>
              </div>

              {/* Botones */}
              <div className="d-flex gap-2">
                {editId && (
                  <>
                    <button className="btn btn-primary" type="submit">
                      Actualizar Solicitud
                    </button>
                    <button className="btn btn-secondary" type="button"
                      onClick={() => { setEditId(null); setTitulo(''); setDescripcion(''); setEstado(true); }}>
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
            <h3 className="card-title mb-3">Lista de Solicitudes</h3>

            <div className="table-responsive">
              <table className="table table-hover tabla-solicitudes">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Usuario</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {solicitudes.map(s => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.titulo}</td>
                      {/* Asumiendo que s.usuario es el ID, si el backend devuelve objeto usar s.usuario.username */}
                      <td>{s.usuario}</td>
                      <td>
                        <span className={`badge-estado ${s.estado ? 'activa' : 'cerrada'}`}>
                          {s.estado ? 'Activa' : 'Cerrada'}
                        </span>
                      </td>
                      <td>{new Date(s.fecha_publicacion).toLocaleDateString()}</td>

                      <td className="text-center">

                        <button className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => editarSolicitud(s)}>
                          <i className="bi bi-pencil-fill me-1"></i> Editar
                        </button>

                        <button className="btn btn-outline-danger btn-sm"
                          onClick={() => abrirModalEliminar(s.id)}>
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
        <div className="modal fade" id="modalEliminarSolicitud" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body">
                ¿Seguro que deseas eliminar esta solicitud?
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

export default SolicitudesAdmin;