import React, { useEffect, useState } from 'react';
import ServicesServicio from '../../Services/ServicesServicio';
import { toast, ToastContainer } from 'react-toastify';
import './ServiciosAdmin.css';
import * as bootstrap from 'bootstrap'

function ServiciosAdmin() {

  // Lista de servicios
  const [servicios, setServicios] = useState([]);

  // Campos del formulario
  const [nombreServicio, setNombreServicio] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Servicio en edición
  const [editId, setEditId] = useState(null);

  // ID a eliminar
  const [idAEliminar, setIdAEliminar] = useState(null);

  // Cargar al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  // Carga servicios
  const cargarDatos = async () => {
    try {
      const dataServicios = await ServicesServicio.getServicio();
      const serviciosArray = Array.isArray(dataServicios)
        ? dataServicios
        : dataServicios.results || dataServicios.data || [];

      setServicios(serviciosArray);

    } catch (error) {
      toast.error("Error cargando servicios");
    }
  };

  // Validación simple
  const validarFormulario = () => {
    if (!nombreServicio.trim()) { toast.warning("Nombre obligatorio"); return false; }
    if (!descripcion.trim()) { toast.warning("Descripción obligatoria"); return false; }
    return true;
  };

  // Guardar o actualizar servicio
  const enviarFormulario = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      // Actualizar
      if (editId) {
        await ServicesServicio.putServicio(editId, {
          nombre_servicio: nombreServicio,
          descripcion
        });

        toast.success("Servicio actualizado");

      } else {
        // Crear no está habilitado en esta vista de admin simplificada
        toast.warning("La creación directa desde admin no está habilitada. Use Editar.");
        return;
      }

      // Limpieza del formulario
      setNombreServicio('');
      setDescripcion('');
      setEditId(null);

      cargarDatos();

    } catch (error) {
      console.error(error);
      toast.error("Error al guardar");
    }
  };

  // Cargar servicio al formulario
  const editarServicio = (servicio) => {
    setNombreServicio(servicio.nombre_servicio);
    setDescripcion(servicio.descripcion);
    setEditId(servicio.id);
  };

  // Abre modal con ID
  const abrirModalEliminar = (id) => {
    setIdAEliminar(id);
    const modal = new bootstrap.Modal(document.getElementById("modalEliminarServicio"));
    modal.show();
  };

  // Elimina servicio
  const confirmarEliminar = async () => {
    try {
      await ServicesServicio.deleteServicio(idAEliminar);
      toast.success("Servicio eliminado");
      cargarDatos();
    } catch {
      toast.error("Error eliminando");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container mt-4 servicios-admin">

        {/* Título */}
        <h2 className="titulo-principal mb-4">Administrar Servicios</h2>

        {/* Formulario */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="card-title mb-3">{editId ? 'Editar Servicio' : 'Moderación de Servicios'}</h3>

            <form onSubmit={enviarFormulario}>

              {/* Nombre Servicio */}
              <div className="mb-3">
                <label className="form-label label-servicio">Nombre del Servicio</label>
                <input type="text" className="form-control input-servicio"
                  value={nombreServicio} onChange={e => setNombreServicio(e.target.value)}
                  disabled={!editId} // Solo permitir editar si se seleccionó uno
                  placeholder="Seleccione un servicio para editar"
                />
              </div>

              {/* Descripción */}
              <div className="mb-3">
                <label className="form-label label-servicio">Descripción</label>
                <textarea className="form-control input-servicio" rows="3"
                  value={descripcion} onChange={e => setDescripcion(e.target.value)}
                  disabled={!editId}
                ></textarea>
              </div>

              {/* Botones */}
              <div className="d-flex gap-2">
                {editId && (
                  <>
                    <button className="btn btn-primary" type="submit">
                      Actualizar Servicio
                    </button>
                    <button className="btn btn-secondary" type="button"
                      onClick={() => { setEditId(null); setNombreServicio(''); setDescripcion(''); }}>
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
            <h3 className="card-title mb-3">Lista de Servicios</h3>

            <div className="table-responsive">
              <table className="table table-hover tabla-servicios">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Descripción</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {servicios.map(s => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.nombre_servicio}</td>
                      {/* Asumiendo que s.usuario es el ID o nombre si el serializer lo expande */}
                      <td>{s.usuario}</td>
                      <td>{s.descripcion ? (s.descripcion.length > 50 ? s.descripcion.substring(0, 50) + '...' : s.descripcion) : ''}</td>

                      <td className="text-center">

                        <button className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => editarServicio(s)}>
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
        <div className="modal fade" id="modalEliminarServicio" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body">
                ¿Seguro que deseas eliminar este servicio?
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

export default ServiciosAdmin;