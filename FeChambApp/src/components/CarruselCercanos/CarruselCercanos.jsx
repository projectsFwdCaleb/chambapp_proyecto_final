import React, { useEffect, useRef, useState } from "react";
import ServicesTop from "../../Services/ServicesTop";
import { useNavigate } from "react-router-dom";
import "../CarruselCercanos/CarruselCercanos.css"

function CarruselCercanos() {
  const [cercanos, setCercanos] = useState([]);
  const sliderRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCercanos = async () => {
      try {
        const resp = await ServicesTop.getCercanos(); // opcional limit
        // adaptarse a respuesta { data: [...] } o a array puro
        const data = Array.isArray(resp) ? resp : resp.data ?? [];
        setCercanos(data);
      } catch (err) {
        console.error("Error cargando cercanos:", err);
      }
    };

    fetchCercanos();
  }, []);

  const scrollBy = (dir = "right") => {
    if (!sliderRef.current) return;
    const amount = sliderRef.current.clientWidth * 0.7;
    sliderRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  const handleCloseClick = (id) => {
    navigate(`/trabajador/${id}`);
  }


  return (
    <div className="container mt-4 carrusel-container">
      <h2 className="titulo-populares">Cercanos en tu cantón</h2>

      <div className="slider-wrapper">
        <button className="slider-btn left" onClick={() => scrollBy('left')}>❮</button>

        <div className="slider" ref={sliderRef}>
          {cercanos.length === 0 && <p className="text-center w-100">No se encontraron usuarios en tu cantón.</p>}

          {cercanos.map(user => (
            <div className="card-popular" key={user.id} onClick={() => handleCloseClick(user.id)}>
              <div className="card-image-container">
                <img src={user.foto_perfil || "/default-profile.png"} alt="perfil" className="card-img" />
                <div className="card-overlay">
                  <span className="view-profile-text">Contactar</span>
                </div>
                <div className="card-rating-badge">
                  <span className="star-icon">⭐</span>
                  <span className="rating-value">{user.promedio_calificacion ?? (user.promedio_calificacion_7_dias ?? '—')}</span>
                </div>
              </div>
              <div className="card-info">
                <h3 className="card-nombre">{user.first_name} {user.last_name}</h3>
                {user.servicios && user.servicios.length > 0 && (
                  <p className="card-servicio">{user.servicios[0]}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="slider-btn right" onClick={() => scrollBy('right')}>❯</button>
      </div>
    </div>
  );
}

export default CarruselCercanos;