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

        {/* BOTÓN IZQUIERDA */}
        <button className="slider-btn left" onClick={scrollLeft}>
          ❮
        </button>

        {/* CONTENEDOR SCROLLEABLE */}
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

              <h4 className="card-nombre">
                {user.first_name} {user.last_name}
              </h4>

              <p className="card-rating">
                ⭐ {user.promedio_calificacion_7_dias ?? 0} / 5
              </p>

            </div>
          ))}
        </div>

        {/* BOTÓN DERECHA */}
        <button className="slider-btn right" onClick={scrollRight}>
          ❯
        </button>
      </div>
    </div>
  );
}

export default CarruselPopular;
