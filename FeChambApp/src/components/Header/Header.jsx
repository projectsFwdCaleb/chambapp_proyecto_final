import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import ServicesServicio from '../../Services/ServicesServicio';
import ServicesLogin from "../../Services/ServicesLogin";
import Dropdown from 'react-bootstrap/Dropdown';

function Header() {
  const [search, setSearch] = useState("");
  const [servicios, setServicios] = useState([]);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState(null);


// Obtener usuario en sesión usando el token
useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await ServicesLogin.getUserSession();
        setUser(data);
      } catch (err) {
        console.error("Error al obtener usuario en sesión:", err);
      }
    };
  fetchUser();
}, []);


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

   {/* PROFILE DROPDOWN */}
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-user">
          {user ? (
            <div className="dropdownProfileMenu">
              <img
                src={user.foto_perfil || "/default.png"}
                alt={user.username}
                className="img-perfil"
              />
              <span>{user.username}</span>
            </div>
          ) : (
            <button>Iniciar sesión</button>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item disabled>
            {user && (
              <div>
                <strong>{user.username}</strong>
                <br />
                <small>{user.email}</small>
              </div>
            )}
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Item href="/perfil">Editar Perfil</Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              window.location.href = "/";
            }}
          >
            Cerrar sesión
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>


    </div>
  )
}

export default Header