import React, { useEffect, useState } from 'react';
import ServicesUsuarios from '../../Services/ServicesUsuarios';
import ServicesUsuarioGrupos from '../../Services/ServicesUsuarioGrupos';
import './UsuariosAdmin.css';

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ username: '', email: '', rol: '' });
  const [editId, setEditId] = useState(null);
  const [usuarioGrupos, setUsuarioGrupos] = useState([]);
  const [grupos, setGrupos] = useState([]);

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
      console.log(usuarioGrupos);
      
      
      // Mapear usuarios con sus roles
      const usuariosConRol = usuariosArray.map(usuario => {
        // Buscar el grupo del usuario
        const usuarioGrupo = gruposArray.find(ug => ug.usuario_id === usuario.id);
        
        return {
          ...usuario,
          group_id: usuarioGrupo?.group_id || null,
          rol: obtenerNombreRol(usuarioGrupo?.group_id)
        };
      });
      
      setUsuarios(usuariosConRol);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  // Función auxiliar para obtener el nombre del rol según el group_id
  const obtenerNombreRol = (groupId) => {
    // Ajusta estos IDs según tu base de datos
    const rolesMap = {
      1: 'cliente',
      2: 'trabajador',
      3: 'admin'
    };
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

  const manejarCambios = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    try {
      const groupId = obtenerGroupId(form.rol);
      
      if (editId) {
        // Actualizar usuario
        await ServicesUsuarios.putUsuarios(editId, {
          username: form.username,
          email: form.email
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
          username: form.username,
          email: form.email
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
      
      setForm({ username: '', email: '', rol: '' });
      setEditId(null);
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert('Error al guardar el usuario. Por favor, intenta de nuevo.');
    }
  };

  const editarUsuario = (usuario) => {
    setForm({ 
      username: usuario.username, 
      email: usuario.email, 
      rol: usuario.rol === 'sin rol' ? '' : usuario.rol
    });
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
      
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title mb-3">
            {editId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </h3>
          <form onSubmit={enviarFormulario}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Nombre de Usuario</label>
                <input 
                  name="username" 
                  placeholder="Ingrese nombre" 
                  className="form-control" 
                  onChange={manejarCambios} 
                  value={form.username}
                  required
                />
              </div>
              
              <div className="col-md-4 mb-3">
                <label className="form-label">Email</label>
                <input 
                  name="email" 
                  placeholder="ejemplo@correo.com" 
                  type="email"
                  className="form-control" 
                  onChange={manejarCambios} 
                  value={form.email}
                  required
                />
              </div>
              
              <div className="col-md-4 mb-3">
                <label className="form-label">Rol</label>
                <select 
                  name="rol" 
                  className="form-select" 
                  onChange={manejarCambios} 
                  value={form.rol}
                  required
                >
                  <option value="">Seleccione un rol</option>
                  <option value="admin">Administrador</option>
                  <option value="trabajador">Trabajador</option>
                  <option value="cliente">Cliente</option>
                </select>
              </div>
            </div>
            
            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                <i className="bi bi-check-circle me-1"></i>
                {editId ? 'Actualizar Usuario' : 'Crear Usuario'}
              </button>
              {editId && (
                <button 
                  className="btn btn-secondary" 
                  type="button"
                  onClick={() => {
                    setForm({ username: '', email: '', rol: '' });
                    setEditId(null);
                  }}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

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
                      <td className="align-middle">{u.id}</td>
                      <td className="align-middle fw-bold">{u.username}</td>
                      <td className="align-middle">{u.email}</td>
                      <td className="align-middle">
                        <span className={`badge-rol ${u.rol}`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="text-center align-middle">
                        <button 
                          className="btn btn-warning btn-sm me-2 btn-accion" 
                          onClick={() => editarUsuario(u)}
                          title="Editar usuario"
                        >
                          <i className="bi bi-pencil-square"></i> Editar
                        </button>
                        <button 
                          className="btn btn-danger btn-sm btn-accion" 
                          onClick={() => eliminarUsuario(u.id)}
                          title="Eliminar usuario"
                        >
                          <i className="bi bi-trash"></i> Eliminar
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