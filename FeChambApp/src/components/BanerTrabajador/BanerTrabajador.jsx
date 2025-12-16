import React, { useState, useEffect } from "react";
import ServicesPortafolio from "../../Services/ServicesPortafolio";
import ServicesUsuarios from "../../Services/ServicesUsuarios";
import ServicesFav from "../../Services/ServicesFav";
import { useUser } from '../../../Context/UserContext';
import '../BanerTrabajador/BanerTrabajador.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faBan, faHeart, faMessage } from '@fortawesome/free-solid-svg-icons'

function BanerTrabajador({ id, section, onChangeSection, onMessageClick }) {
  const [userStats, setuserStats] = useState(null);
  const [usuarios, setusuarios] = useState([]);
  const { user } = useUser(); // Use hook
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);


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
  
 //verificar si ya esta agregado a favoritos
  const checkFavoriteStatus = async () => {
    if (!user || !id) return;
    try {
      const response = await ServicesFav.getFavoritos();
      const favoritos = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);

      const fav = favoritos.find(f => f.usuario === user.id && f.trabajador === parseInt(id));

      if (fav) {
        setIsFavorite(true);
        setFavoriteId(fav.id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  /* El useEffect que llamara las funciones/constantes */
  useEffect(() => {
    if (!id) return;
    fetchEstadisticas();
    fetchusuarios();
    checkFavoriteStatus();
  }, [id, user]);

  /* Para que de un mensaje de cargando, es solo un detallito */
  if (!userStats || !usuarios) {
    return <p>Cargando...</p>;
  }
  console.log(usuarios);

  const usuarioConEstadistica = (
    usuarios.find(u => u.id === userStats.trabajador_id)
  )
  console.log(usuarioConEstadistica);

  const handleMensaggeClick = () => {
    if (onMessageClick && usuarioConEstadistica) {
      onMessageClick(usuarioConEstadistica);
    }
  }

  const handleToggleFavorite = async () => {
    if (isFavorite && favoriteId) {
      // Eliminar de favoritos
      try {
        await ServicesFav.deleteFavorito(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    } else {
      // Agregar a favoritos
      const nuevoFav = {
        usuario: user.id,
        trabajador: id
      }
      try {
        const response = await ServicesFav.postFavorito(nuevoFav);
        if (response && response.id) {
          setFavoriteId(response.id);
        } else {
          await checkFavoriteStatus();
        }
        setIsFavorite(true);
      } catch (error) {
        console.error("Error adding favorite:", error);
      }
    }
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
              className={`btnFav ${isFavorite ? 'btnFav-active' : ''}`}
              onClick={handleToggleFavorite}
            >
              <FontAwesomeIcon icon={faHeart} className={`me-2 ${isFavorite ? 'text-danger' : ''}`} />
              {isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
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
              onClick={() => onChangeSection("comentarios")} id="nav-btn">
              Comentarios
            </button>

          </div>
        </div>
      </div>

    </div>
  );
}

export default BanerTrabajador;