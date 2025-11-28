import React, { useEffect, useState } from 'react';
import ServicesUsuarios from '../../Services/ServicesUsuarios';
import ServicesUsuarioGrupos from '../../Services/ServicesUsuarioGrupos';
import { toast, ToastContainer } from 'react-toastify';
import './UsuariosAdmin.css';
import * as bootstrap from 'bootstrap'

function UsuariosAdmin() {

  // Lista de usuarios
  const [usuarios, setUsuarios] = useState([]);

  // Campos del formulario
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');

  // Usuario en edición
  const [editId, setEditId] = useState(null);

  // Datos tabla usuario_groups
  const [usuarioGrupos, setUsuarioGrupos] = useState([]);

  // ID a eliminar
  const [idAEliminar, setIdAEliminar] = useState(null);

  // Cargar al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  // Carga usuarios y grupos
  const cargarDatos = async () => {
    try {
      const dataUsuarios = await ServicesUsuarios.getUsuarios();
      const usuariosArray = Array.isArray(dataUsuarios)
        ? dataUsuarios
        : dataUsuarios.results || dataUsuarios.data || [];

      const dataGrupos = await ServicesUsuarioGrupos.getUsuarioGrupos();
      const gruposArray = Array.isArray(dataGrupos)
        ? dataGrupos
        : dataGrupos.results || dataGrupos.data || [];

      setUsuarioGrupos(gruposArray);

      // Une usuario con su rol
      const usuariosConRol = usuariosArray.map(usuario => {
        const usuarioGrupo = gruposArray.find(ug => ug.id === usuario.id);
        return {
          ...usuario,
          group_id: usuarioGrupo?.group_id || null,
          rol: obtenerNombreRol(usuarioGrupo?.groups)
        };
      });

      setUsuarios(usuariosConRol);

    } catch (error) {
      toast.error("Error cargando datos");
    }
  };

  // Traduce id → nombre
  const obtenerNombreRol = (groupId) => {
    const rolesMap = { 1: 'cliente', 2: 'trabajador', 3: 'admin' };
    return rolesMap[groupId] || 'sin rol';
  };

  // Traduce nombre → id
  const obtenerGroupId = (rolNombre) => {
    const rolesMap = { cliente: 1, trabajador: 2, admin: 3 };
    return rolesMap[rolNombre];
  };

  // Validación simple
  const validarFormulario = () => {
    if (!username.trim()) { toast.warning("Usuario obligatorio"); return false; }
    if (!email.trim()) { toast.warning("Correo obligatorio"); return false; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { toast.warning("Correo inválido"); return false; }
    // Solo validar contraseña al CREAR (cuando NO hay editId)
    if (!editId) {
      if (!password.trim()) { 
        toast.warning("Contraseña obligatoria"); 
        return false; 
      }
      if (password.length < 8) { 
        toast.warning("La contraseña debe tener 8 caracteres o más"); 
        return false; 
      }
    }
      if (!rol) { toast.warning("Seleccione un rol"); return false; }
      return true;
    };

  // Guardar o actualizar usuario
  const enviarFormulario = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      const groupId = obtenerGroupId(rol);

      // Actualizar
      if (editId) {
        await ServicesUsuarios.putUsuarios(editId, { username, email });

        const usuarioGrupo = usuarioGrupos.find(ug => ug.id === editId);
        if (usuarioGrupo) {
          await ServicesUsuarioGrupos.putUsuarioGrupos(usuarioGrupo.id, {
              groups: [groupId]
          });
        }

        toast.success("Usuario actualizado");

      } else {
        // Crear
        const nuevoUsuario = await ServicesUsuarios.postUsuarios({
          username, email, password
        });

        const userId = nuevoUsuario.id || nuevoUsuario.data?.id;

        if (userId) {
          const dataGrupos = await ServicesUsuarioGrupos.getUsuarioGrupos();
          const gruposArray = Array.isArray(dataGrupos)
            ? dataGrupos
            : dataGrupos.results || dataGrupos.data || [];

          const usuarioGrupo = gruposArray.find(ug => ug.id === userId);

          if (usuarioGrupo) {
            await ServicesUsuarioGrupos.putUsuarioGrupos(usuarioGrupo.id, {
              groups: [groupId]
            });
          }
        }

        toast.success("Usuario creado");
      }

      // Limpieza del formulario
      setUsername('');
      setEmail('');
      setPassword('');
      setRol('');
      setEditId(null);

      cargarDatos();

    } catch (error) {
      toast.error("Error al guardar");
    }
  };

  // Cargar usuario al formulario
  const editarUsuario = (usuario) => {
    setUsername(usuario.username);
    setEmail(usuario.email);
    setPassword('');
    setRol(usuario.rol === 'sin rol' ? '' : usuario.rol);
    setEditId(usuario.id);
  };

  // Abre modal con ID
  const abrirModalEliminar = (id) => {
    setIdAEliminar(id);
    const modal = new bootstrap.Modal(document.getElementById("modalEliminar"));
    modal.show();
  };

  // Elimina usuario
  const confirmarEliminar = async () => {
    try {
      const id = idAEliminar;

      const usuarioGrupo = usuarioGrupos.find(ug => ug.user_id === id);
      if (usuarioGrupo) {
        await ServicesUsuarioGrupos.deleteUsuarioGrupos(usuarioGrupo.id);
      }

      await ServicesUsuarios.deleteUsuarios(id);

      toast.success("Usuario eliminado");

      cargarDatos();

    } catch {
      toast.error("Error eliminando");
    }
  };

  return (
    <>
    <ToastContainer />
    <div className="container mt-4 usuarios-admin">

      {/* Título */}
      <h2 className="titulo-principal mb-4">Administrar Usuarios</h2>

      {/* Formulario */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title mb-3">{editId ? 'Editar Usuario' : 'Crear Usuario'}</h3>

          <form onSubmit={enviarFormulario}>

            {/* Usuario */}
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input type="text" className="form-control"
                value={username} onChange={e => setUsername(e.target.value)} />
            </div>

            {/* Correo */}
            <div className="mb-3">
              <label className="form-label">Correo</label>
              <input type="email" className="form-control"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            {/* Contraseña solo al crear */}
            {!editId && (
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input type="password" className="form-control"
                  value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            )}

            {/* Rol */}
            <div className="mb-3">
              <label className="form-label">Rol</label>
              <select className="form-select" value={rol} onChange={e => setRol(e.target.value)}>
                <option value="">Seleccione un rol</option>
                <option value="cliente">Cliente</option>
                <option value="trabajador">Trabajador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {/* Botones */}
            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                {editId ? 'Actualizar Usuario' : 'Crear Usuario'}
              </button>

              {editId && (
                <button className="btn btn-secondary" type="button"
                  onClick={() => { setEditId(null); setUsername(''); setEmail(''); setPassword(''); setRol(''); }}>
                  Cancelar
                </button>
              )}
            </div>

          </form>
        </div>
      </div>

      {/* Tabla */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-3">Lista de Usuarios</h3>

          <div className="table-responsive">
            <table className="table table-hover tabla-usuarios">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>

                    <td>
                      <span className={`badge-rol ${u.rol}`}>{u.rol}</span>
                    </td>

                    <td className="text-center">

                      <button className="btn btn-warning btn-sm me-2"
                        onClick={() => editarUsuario(u)}>
                        Editar
                      </button>

                      <button className="btn btn-danger btn-sm"
                        onClick={() => abrirModalEliminar(u.id)}>
                        Eliminar
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
      <div className="modal fade" id="modalEliminar" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Confirmar eliminación</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              ¿Seguro que deseas eliminar este usuario?
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

export default UsuariosAdmin;
