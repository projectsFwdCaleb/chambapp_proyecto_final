import React, { useEffect, useState, useRef } from "react";
import ServicesTop from "../../Services/ServicesTop";
import "./CarruselPopular.css";
import Carousel from 'react-bootstrap/Carousel';

function CarruselPopular() {
  const [populares, setPopulares] = useState([]);

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



  return (
    <div className="container mt-4 carrusel-container">
      <h2 className="titulo-populares">Populares esta semana</h2>

      <Carousel>
        {populares.map((user) => (
          <Carousel.Item key={user.id}>
            <div className="slide-wrapper glass-card">
              <div className="rotating-border"></div>
              <div className="slide-img">
                <img
                  src={user.foto_perfil || "/default-profile.png"}
                  alt="perfil"
                />
              </div>

              <div className="slide-info">
                <h3>{user.first_name} {user.last_name}</h3>

                <p className="rating">⭐ {user.promedio_calificacion_7_dias ?? 0} / 5</p>

                <div className="services-list">
                  {user.servicios?.map(s => (
                    <button key={s.id} className="service-badge">
                      {s.nombre_servicio}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Carousel.Item>

        ))}
      </Carousel>
    </div>
  );
}

export default CarruselPopular;