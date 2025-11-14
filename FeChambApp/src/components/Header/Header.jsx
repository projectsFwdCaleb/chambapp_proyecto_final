import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import ServicesServicio from '../../Services/ServicesServicio';

function Header() {
  const [search, setSearch] = useState("");
  const [servicios, setServicios] = useState([]);
  const [page, setPage] = useState(1);

useEffect(() => {
// Solo buscar si hay texto en el search
  if (!search.trim()) {
    setServicios([]); // Limpiar resultados si no hay búsqueda
    return;
  }
  const TraerServicios = async () => {
    try {
      const data = await ServicesServicio.getServicio(search, page);
      setServicios(data.results || data);
    } catch (err) {
      console.error("Error al obtener servicios:", err);
    }
  };

  const delay = setTimeout(TraerServicios, 400);
  return () => clearTimeout(delay);
}, [search, page]);

  return (
    <div>
      <div className='searchBar'>
        <input type="text" placeholder='Buscar por trabajador o servicio' value={search}
        onChange={(e) => setSearch(e.target.value)}/>
      
        <ul>
            {servicios.map((servicio) => (
              <li key={servicio.id}>
                <strong>{servicio.nombre_servicio}</strong> – {servicio.descripcion}
              </li>
            ))}
       </ul>
      </div>




    </div>
  )
}

export default Header