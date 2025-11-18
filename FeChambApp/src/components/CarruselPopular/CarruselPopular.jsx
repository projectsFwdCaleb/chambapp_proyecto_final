import React, { useEffect, useState, useRef } from "react";
import ServicesTop from "../../Services/ServicesTop";
import "./CarruselPopular.css";

function CarruselPopular() {
  const [populares, setPopulares] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchPopulares = async () => {
      try {
        const response = await ServicesTop.getPopulares();
        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        setPopulares(data);
      } catch (error) {
        console.error("Error cargando populares:", error);
      }
    };

    fetchPopulares();
  }, []);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="container mt-4 carrusel-container">
      <h2 className="titulo-populares">Populares esta semana</h2>

      <div className="slider-wrapper">
        <button className="slider-btn left" onClick={scrollLeft}>❮</button>

        <div className="slider" ref={sliderRef}>
          {populares.length === 0 && (
            <p className="text-center w-100">Cargando...</p>
          )}

          {populares.map((user) => (
            <div className="card-popular" key={user.id}>
              <img
                src={user.foto_perfil || "/default-profile.png"}
                alt="perfil"
                className="card-img"
              />

              <div className="card-body">
                <h4 className="card-nombre">
                  {user.first_name} {user.last_name}
                </h4>

                <p className="card-rating">
                  ⭐ {user.promedio_calificacion_7_dias ?? 0} / 5
                </p>

                {/* Servicios como badges/botones */}
                <div className="services-list">
                  {user.servicios && user.servicios.length > 0 ? (
                    user.servicios.map((s) => (
                      <button
                        key={s.id}
                        className="service-badge"
                        onClick={() => {
                          /* opcional: navegar a detalle de servicio o perfil del usuario */
                        }}
                      >
                        {s.nombre_servicio}
                      </button>
                    ))
                  ) : (
                    <small className="text-muted">Sin servicios disponibles</small>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="slider-btn right" onClick={scrollRight}>❯</button>
      </div>
    </div>
  );
}

export default CarruselPopular;