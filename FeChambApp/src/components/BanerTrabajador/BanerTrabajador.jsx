import React, { useState, useEffect } from "react";
import ServicesPortafolio from "../../Services/ServicesPortafolio";
import ServicesUsuarios from "../../Services/ServicesUsuarios";
import ServicesFav from "../../Services/ServicesFav";
import { useUser } from '../../../Context/UserContext';
import '../BanerTrabajador/BanerTrabajador.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faBan, faHeart, faMessage} from '@fortawesome/free-solid-svg-icons'

function BanerTrabajador({ id, section, onChangeSection }) {
  const [userStats, setuserStats] = useState(null);
  const [usuarios, setusuarios] = useState([]);
  const { user } = useUser(); // Use hook
  

  /* llamar las estadísticas */
  const fetchEstadisticas = async () => {
    try {
      const resp = await ServicesPortafolio.getEstadisticas(id);
      setuserStats(resp || null);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

  /* llamar a los usuarios */
  const fetchusuarios = async () => {
    try {
      const data = await ServicesUsuarios.getUsuarios();
      setusuarios(data || null);
    } catch (err) {
      console.error("Error al obtener usuario en sesión:", err);
    }
  };

  /* El useEffect que llamara las funciones/constantes */
  useEffect(() => {
    if (!id) return;
    fetchEstadisticas();
    fetchusuarios();
  }, [id]);

  /* Para que de un mensaje de cargando, es solo un detallito */
  if (!userStats || !usuarios) {
    return <p>Cargando...</p>;
  }
console.log(usuarios);

  const usuarioConEstadistica =(
    usuarios.find(u => u.id === userStats.trabajador_id)
  )
  console.log(usuarioConEstadistica);
  
const handleMensaggeClick = () => {
    
  }

const handleAddFavoriteClick = async() => {
    const nuevoFav = { 
      usuario: user.id,
      trabajador: id
    }
     await ServicesFav.postFavorito(nuevoFav)
  }

    return (
  <div className="container baner-container mt-4 p-3 m-0">

    {/* ROW PRINCIPAL */}
    <div className="row">

      {/* FOTO */}
      <div className="profile-image-container">
        <img
          src={usuarioConEstadistica?.foto_perfil || "/default.png"}
          alt={usuarioConEstadistica?.username || "perfil"}
          className="profile-image"
        />
      </div>

      {/* INFORMACIÓN */}
      <div className="col-12 col-md-9 d-flex flex-column justify-content-start">

        {/* NOMBRE + VERIFICADO */}
        <div className="d-flex align-items-center">
          <h3 className="card-nombre me-3 mb-0">
            {usuarioConEstadistica?.first_name} {usuarioConEstadistica?.last_name}
          </h3>

          <span className="badge bg-success verificar-badge">
            {userStats.verificado == true ? (
              <>Verificado <FontAwesomeIcon icon={faCheck} /></>
            ) : (
              <>No verificado <FontAwesomeIcon icon={faBan} /></>
            )}
          </span>
        </div>

        {/* RATING */}
        <p className="card-rating mt-1">
          ⭐ {userStats?.promedio_calificacion ?? 0} / 5
        </p>

        {/* SERVICIOS */}
        <p className="services text-muted">
          {userStats?.servicios_ofrecidos?.join(", ") || ""}
        </p>

        {/* ESTADÍSTICAS */}
        <p className="card-servicios mb-1">
          Trabajos completados: {userStats?.trabajos_completados ?? 0}
        </p>

        <p className="card-satisfaccion text-muted">
          <small>Satisfacción: {userStats?.tasa_satisfaccion ?? 0}%</small>
        </p>

        {/* BOTONES → ENVIAR MENSAJE / FAVORITOS */}
        <div className="mt-3 d-flex gap-3">
          <button
            className="btnM"
            onClick={handleMensaggeClick}
          >
            <FontAwesomeIcon icon={faMessage} className="me-2" />
            Enviar mensaje
          </button>

          <button
            className="btnFav"
            onClick={handleAddFavoriteClick}
          >
            <FontAwesomeIcon icon={faHeart} className="me-2" />
            Agregar a favoritos
          </button>
        </div>

      </div>
    </div>

    {/* NAV OPCIONES */}
    <div className="row mt-4">
      <div className="col-12">
        <div className="nav-opciones">

          <button className={`nav-btn ${section === "trabajos" ? "active" : ""}`}
            onClick={() => onChangeSection("trabajos")}>
            Trabajos realizados
          </button>

          <button className={`nav-btn ${section === "comentarios" ? "active" : ""}`}
            onClick={() => onChangeSection("comentarios")}id="nav-btn">
            Comentarios
          </button>

        </div>
      </div>
    </div>

  </div>
);
}

export default BanerTrabajador;