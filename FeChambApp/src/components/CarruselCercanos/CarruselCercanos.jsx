import React, { useEffect, useRef, useState } from "react";
import ServicesTop from "../../Services/ServicesTop";


function CarruselCercanos() {
  const [cercanos, setCercanos] = useState([]);
  const sliderRef = useRef(null);

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

  return (
    <div className="container mt-4 carrusel-container">
      <h2 className="titulo-populares">Cercanos en tu cantón</h2>

      <div className="slider-wrapper">
        <button className="slider-btn left" onClick={() => scrollBy('left')}>❮</button>

        <div className="slider" ref={sliderRef}>
          {cercanos.length === 0 && <p className="text-center w-100">No se encontraron usuarios en tu cantón.</p>}

          {cercanos.map(user => (
            <div className="card-popular" key={user.id} onClick={() => {/* navega a perfil si quieres */}}>
              <img src={user.foto_perfil || "/default-profile.png"} alt="perfil" className="card-img" />
              <h3 className="card-nombre">{user.first_name} {user.last_name}</h3>
              <p className="card-rating">⭐ {user.promedio_calificacion ?? (user.promedio_calificacion_7_dias ?? '—')} / 5</p>
            </div>
          ))}
        </div>

        <button className="slider-btn right" onClick={() => scrollBy('right')}>❯</button>
      </div>
    </div>
  );
}

export default CarruselCercanos;