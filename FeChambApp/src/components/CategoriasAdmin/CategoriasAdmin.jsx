import React, { useEffect, useState } from 'react';
import ServicesCategoria from '../../Services/ServicesCategoria';
import { toast, ToastContainer } from 'react-toastify';
import './CategoriasAdmin.css';

function CategoriasAdmin() {

  // Lista de categorias
  const [categorias, setCategorias] = useState([]);

  // Campos del formulario
  const [nombre, setNombre] = useState('');

  // Categoria en edición
  const [editId, setEditId] = useState(null);

  // Cargar al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  // Carga categorias
  const cargarDatos = async () => {
    try {
      const dataCategorias = await ServicesCategoria.getCategoria();
      const categoriasArray = Array.isArray(dataCategorias)
        ? dataCategorias
        : dataCategorias.results || dataCategorias.data || [];

      setCategorias(categoriasArray);

    } catch (error) {
      toast.error("Error cargando categorias");
    }
  };

  // Validación simple
  const validarFormulario = () => {
    if (!nombre.trim()) { toast.warning("Nombre obligatorio"); return false; }
    return true;
  };

  // Guardar o actualizar categoria
  const enviarFormulario = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      // Actualizar
      if (editId) {
        await ServicesCategoria.putCategoria(editId, {
          nombre
        });

        toast.success("Categoría actualizada");

      } else {
        // Crear
        await ServicesCategoria.postCategoria({
          nombre
        });
        toast.success("Categoría creada");
      }

      // Limpieza del formulario
      setNombre('');
      setEditId(null);

      cargarDatos();

    } catch (error) {
      console.error(error);
      toast.error("Error al guardar");
    }
  };

  // Cargar categoria al formulario
  const editarCategoria = (categoria) => {
    setNombre(categoria.nombre);
    setEditId(categoria.id);
  };

  return (
    <>
      <ToastContainer />
      <div className="container mt-4 categorias-admin">

        {/* Título */}
        <h2 className="titulo-principal mb-4">Administrar Categorías</h2>

        {/* Formulario */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="card-title mb-3">{editId ? 'Editar Categoría' : 'Crear Categoría'}</h3>

            <form onSubmit={enviarFormulario}>

              {/* Nombre */}
              <div className="mb-3">
                <label className="form-label label-categoria">Nombre de la Categoría</label>
                <input type="text" className="form-control input-categoria"
                  value={nombre} onChange={e => setNombre(e.target.value)}
                  placeholder="Nombre de la categoría"
                />
              </div>

              {/* Botones */}
              <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit">
                  {editId ? 'Actualizar Categoría' : 'Crear Categoría'}
                </button>

                {editId && (
                  <button className="btn btn-secondary" type="button"
                    onClick={() => { setEditId(null); setNombre(''); }}>
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
            <h3 className="card-title mb-3">Lista de Categorías</h3>

            <div className="table-responsive">
              <table className="table table-hover tabla-categorias">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {categorias.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.nombre}</td>

                      <td className="text-center">

                        <button className="btn btn-outline-primary btn-sm"
                          onClick={() => editarCategoria(c)}>
                          <i className="bi bi-pencil-fill me-1"></i> Editar
                        </button>

                        {/* No delete button as requested */}

                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default CategoriasAdmin;