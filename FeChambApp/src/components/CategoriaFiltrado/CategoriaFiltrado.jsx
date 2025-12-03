import React, { useState, useEffect } from 'react';
import ServicesTop from '../../Services/ServicesTop';
import ServicesCantones from '../../Services/ServicesCantones';
import './CategoriaFiltrado.css';
import BoosiMan from '../../assets/BoosiMan.webp'; // Imagen por defecto
import { useNavigate } from 'react-router-dom';

function CategoriaFiltrado({ idCategoria}) {
  // Estados principales
  const [trabajadores, setTrabajadores] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [canton, setCanton] = useState("");
  const [minPrecio, setMinPrecio] = useState("");
  const [maxPrecio, setMaxPrecio] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cargar cantones al iniciar el componente
  useEffect(() => {
    const fetchCantones = async () => {
      try {
        const data = await ServicesCantones.getCanton();
        // Validación básica del formato recibido
        if (Array.isArray(data)) {
          setCantones(data);
        } else if (data.data && Array.isArray(data.data)) {
          setCantones(data.data);
        } else {
          console.error("Formato de cantones desconocido:", data);
        }
      } catch (error) {
        console.error("Error cargando cantones:", error);
      }
    };
    fetchCantones();
  }, []);

  // Cargar trabajadores cada vez que cambien los filtros
  useEffect(() => {
    const fetchTrabajadores = async () => {
      setLoading(true);
      try {
        // Construcción dinámica de filtros
        const filtros = {};
        if (canton) filtros.canton = canton;
        if (minPrecio) filtros.min = minPrecio;
        if (maxPrecio) filtros.max = maxPrecio;
        /* filtros.ordenar = "-precio"; */ // Orden por precio descendente

        const response = await ServicesTop.getTrabajadoresPorCategoria(idCategoria, filtros);

        // Validación del formato de la respuesta
        if (response && response.data) {
          setTrabajadores(response.data);
        } else {
          setTrabajadores([]);
        }

      } catch (error) {
        console.error("Error cargando trabajadores:", error);
        setTrabajadores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrabajadores();
  }, [canton, minPrecio, maxPrecio, idCategoria]);

  const handleContactButton = (id) => {
      navigate(`/trabajador/${id}`);
  }

  return (
    <div className="categoria-filtrado-container">

      {/* Controles de filtros */}
      <div className="filtros-container">
        <div className="filtro-group">
          <label htmlFor="canton">Cantón</label>
          <select
            id="canton"
            className="filtro-select"
            value={canton}
            onChange={(e) => setCanton(e.target.value === "" ? "" : Number(e.target.value))}
          >
            <option value="">Todos</option>
            {cantones.map((c) => (
              <option key={c.id} value={c.id}>
                {c.canton || c.nombre || "Sin nombre"}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label htmlFor="minPrecio">Precio Mínimo</label>
          <input
            type="number"
            id="minPrecio"
            className="filtro-input"
            value={minPrecio}
            onChange={(e) => setMinPrecio(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="filtro-group">
          <label htmlFor="maxPrecio">Precio Máximo</label>
          <input
            type="number"
            id="maxPrecio"
            className="filtro-input"
            value={maxPrecio}
            onChange={(e) => setMaxPrecio(e.target.value)}
            placeholder="100000"
          />
        </div>
      </div>

      {/* Lista de trabajadores */}
      <div className="trabajadores-grid">
        {loading ? (
          <p>Cargando trabajadores...</p>
        ) : trabajadores.length > 0 ? (
          trabajadores.map((trabajador) => (
            <div key={trabajador.id} className="trabajador-card">

              {/* Imagen del trabajador */}
              <div className="card-header">
                <div className="card-avatar-container">
                  <img
                    src={trabajador.foto_perfil || BoosiMan}
                    alt={`${trabajador.first_name || 'Usuario'} ${trabajador.last_name || ''}`}
                    className="card-avatar"
                  />
                </div>
              </div>

              {/* Información principal */}
              <div className="card-body">
                <h3 className="card-name">
                  {trabajador.first_name || "Usuario"} {trabajador.last_name || ""}
                </h3>

                {/* Lista de servicios */}
                <p className="card-profession">
                  {trabajador.servicios && trabajador.servicios.length > 0
                    ? trabajador.servicios.map((s) => s.nombre).join(', ')
                    : "Sin servicios registrados"}
                </p>

                {/* Promedio de calificaciones */}
                <div className="card-stats">
                  <div className="stat-item">
                    <span>⭐ {trabajador.promedio ?? 0}</span>
                  </div>
                </div>

                {/* Precio mínimo entre los servicios */}
                <p className="card-price">
                  ₡ {
                    trabajador.servicios?.length > 0
                      ? Math.min(...trabajador.servicios.map(s => Number(s.precio_referencial))).toLocaleString()
                      : "A convenir"
                  }
                </p>

                <button 
                className="btn-save" 
                onClick={() => handleContactButton(trabajador.id)}>
                  Contactar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No se encontraron trabajadores con estos filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default CategoriaFiltrado;
