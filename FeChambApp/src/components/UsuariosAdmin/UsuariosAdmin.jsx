import React, { useEffect, useState } from 'react';
import ServicesUsuarios from '../../Services/ServicesUsuarios';
import ServicesUsuarioGrupos from '../../Services/ServicesUsuarioGrupos';
import './UsuariosAdmin.css';

export default function UsuariosAdmin() {
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
      // Cargar usuarios
      const dataUsuarios = await ServicesUsuarios.getUsuarios();
      const usuariosArray = Array.isArray(dataUsuarios)
        ? dataUsuarios
        : dataUsuarios.results || dataUsuarios.data || [];

      // Cargar relación usuario-grupos
      const dataGrupos = await ServicesUsuarioGrupos.getUsuarioGrupos();
      const gruposArray = Array.isArray(dataGrupos)
        ? dataGrupos
        : dataGrupos.results || dataGrupos.data || [];

      setUsuarioGrupos(gruposArray);
      console.log(gruposArray);


      // Mapear usuarios con sus roles
      const usuariosConRol = usuariosArray.map(usuario => {
        // Buscar el grupo del usuario

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
    }
  };

  // Función auxiliar para obtener el nombre del rol según el group_id
  const obtenerNombreRol = (groupId) => {
    console.log(groupId);

    const rolesMap = {
      1: 'cliente',
      2: 'trabajador',
      3: 'admin'
    };
    console.log(rolesMap[groupId]);

    return rolesMap[groupId] || 'sin rol';
  };

  // Función auxiliar para obtener el group_id según el nombre del rol
  const obtenerGroupId = (rolNombre) => {
    const rolesMap = {
      'cliente': 1,
      'trabajador': 2,
      'admin': 3
    };
    return rolesMap[rolNombre];
  };

  const enviarFormulario = async (e) => {
    if (e) e.preventDefault();
    try {
      const groupId = obtenerGroupId(rol);

      if (editId) {
        // Actualizar usuario
        await ServicesUsuarios.putUsuarios(editId, {
          username: username,
          email: email
        });

        // Actualizar o crear relación con grupo
        const usuarioGrupo = usuarioGrupos.find(ug => ug.user_id === editId);

        if (usuarioGrupo) {
          // Si existe, actualizar
          await ServicesUsuarioGrupos.putUsuarioGrupos(usuarioGrupo.id, {
            user_id: editId,
            group_id: groupId
          });
        } else {
          // Si no existe, crear
          await ServicesUsuarioGrupos.postUsuarioGrupos({
            user_id: editId,
            group_id: groupId
          });
        }
      } else {
        // Crear nuevo usuario
        const nuevoUsuario = await ServicesUsuarios.postUsuarios({
          username: username,
          email: email,
          password: password
        });

        // Crear relación con grupo
        const userId = nuevoUsuario.id || nuevoUsuario.data?.id;
        if (userId) {
          await ServicesUsuarioGrupos.postUsuarioGrupos({
            user_id: userId,
            group_id: groupId
          });
        }
      }

      setUsername('');
      setEmail('');
      setRol('');
      setEditId(null);
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert('Error al guardar el usuario. Por favor, intenta de nuevo.');
    }
  };

  const editarUsuario = (usuario) => {
    setUsername(usuario.username);
    setEmail(usuario.email);
    setRol(usuario.rol === 'sin rol' ? '' : usuario.rol);
    setEditId(usuario.id);
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        // Eliminar relación usuario-grupo
        const usuarioGrupo = usuarioGrupos.find(ug => ug.user_id === id);
        if (usuarioGrupo) {
          await ServicesUsuarioGrupos.deleteUsuarioGrupos(usuarioGrupo.id);
        }

        // Eliminar usuario
        await ServicesUsuarios.deleteUsuarios(id);
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario.');
      }
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
                required/>
            </div>

            <div className="mb-3">
              <label className="form-label">Correo</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required/>
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
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