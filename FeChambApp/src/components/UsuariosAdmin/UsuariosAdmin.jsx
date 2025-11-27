import React, { useEffect, useState } from 'react';
import ServicesUsuarios from '../../Services/ServicesUsuarios';
import ServicesUsuarioGrupos from '../../Services/ServicesUsuarioGrupos';
import './UsuariosAdmin.css';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');
  const [editId, setEditId] = useState(null);
  const [usuarioGrupos, setUsuarioGrupos] = useState([]);

  // Cargar usuarios y sus grupos
  useEffect(() => {
    cargarDatos();
  }, []);

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
      console.error('Error al cargar datos:', error);
      toast.error("Error cargando datos");
    }
  };

  const obtenerNombreRol = (groupId) => {
    const rolesMap = {
      1: 'cliente',
      2: 'trabajador',
      3: 'admin'
    };
    return rolesMap[groupId] || 'sin rol';
  };

  const obtenerGroupId = (rolNombre) => {
    const rolesMap = {
      'cliente': 1,
      'trabajador': 2,
      'admin': 3
    };
    return rolesMap[rolNombre];
  };

  // VALIDACIONES SIMPLES
  const validarFormulario = () => {
    if (username.trim().length < 3) {
      toast.warn("El usuario debe tener al menos 3 caracteres");
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      toast.warn("Ingrese un email válido");
      return false;
    }

    if (!rol) {
      toast.warn("Debe seleccionar un rol");
      return false;
    }

    // Contraseña obligatoria solo si es un nuevo usuario
    if (!editId && password.trim().length < 4) {
      toast.warn("La contraseña debe tener mínimo 4 caracteres");
      return false;
    }

    return true;
  };

  const enviarFormulario = async (e) => {
    if (e) e.preventDefault();

    if (!validarFormulario()) return;

    try {
      const groupId = obtenerGroupId(rol);

      if (editId) {
        // Actualizar usuario
        await ServicesUsuarios.putUsuarios(editId, {
          username,
          email
        });

        const usuarioGrupo = usuarioGrupos.find(ug => ug.id === editId);

        if (usuarioGrupo) {
          await ServicesUsuarioGrupos.putUsuarioGrupos(usuarioGrupo.id, {
            user_id: editId,
            group_id: groupId
          });
        }

        toast.success("Usuario actualizado correctamente");

      } else {
        // Crear usuario
        const nuevoUsuario = await ServicesUsuarios.postUsuarios({
          username,
          email,
          password
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

        toast.success("Usuario creado correctamente");
      }

      setUsername('');
      setEmail('');
      setPassword('');
      setRol('');
      setEditId(null);
      cargarDatos();

    } catch (error) {
      console.error('Error al guardar usuario:', error);
      toast.error('Error al guardar el usuario.');
    }
  };

  const editarUsuario = (usuario) => {
    setUsername(usuario.username);
    setEmail(usuario.email);
    setRol(usuario.rol === 'sin rol' ? '' : usuario.rol);
    setPassword(''); // no se muestra la contraseña
    setEditId(usuario.id);

    toast.info("Editando usuario...");
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const usuarioGrupo = usuarioGrupos.find(ug => ug.user_id === id);
      
      if (usuarioGrupo) {
        await ServicesUsuarioGrupos.deleteUsuarioGrupos(usuarioGrupo.id);
      }

      await ServicesUsuarios.deleteUsuarios(id);

      toast.success("Usuario eliminado");
      cargarDatos();

    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      toast.error("Error al eliminar el usuario");
    }
  };

  return (
    <div className="container mt-4 usuarios-admin">

      <h2 className="titulo-principal mb-4">Administrar Usuarios</h2>

      {/* FORMULARIO */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title mb-3">{editId ? 'Editar Usuario' : 'Crear Usuario'}</h3>

          <form onSubmit={enviarFormulario}>
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required />
            </div>

            <div className="mb-3">
              <label className="form-label">Correo</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña {editId ? "(opcional)" : ""}</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Rol</label>
              <select
                className="form-select"
                value={rol}
                onChange={(e) => setRol(e.target.value)}>
                <option value="">Seleccione un rol</option>
                <option value="cliente">Cliente</option>
                <option value="trabajador">Trabajador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                {editId ? 'Actualizar Usuario' : 'Crear Usuario'}
              </button>

              {editId && (
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => {
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    setRol('');
                    setEditId(null);
                    toast.info("Modo creación activado");
                  }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* TABLA */}
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
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No hay usuarios registrados
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge-rol ${u.rol}`}>{u.rol}</span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => editarUsuario(u)}>
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarUsuario(u.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsuariosAdmin;
