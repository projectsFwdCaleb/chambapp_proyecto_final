import React, { useEffect, useRef, useState } from "react";
import ServicesPortafolio from "../../Services/ServicesPortafolio";
 function CarruselPortafolio() {
    const [Portafolio, setPortafolio]=useState([]);
    const sliderRef = useRef(null);

    useEffect(()=>{ 
        const fetchPortafolio = async() =>{
            try{
                const resp = await ServicesPortafolio.getPortafolio();

                const data = Array.isArray(resp) ? resp: [];

                setPortafolio(data);
            } catch (error) {
                console.error("Error cargando El Portafolio:", error);
            }
        };

        fetchPortafolio();
    },[]);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };    

  return (
    <div className="container mt-4 carrusel-container">
        <h2 className="titulo-Portafolio">Portafolio de usuario</h2>
        <div className="slider-wrapper">
            {/* BOTÓN IZQUIERDA */}
            <button className="slider-btn left" onClick={scrollLeft}>❮</button>
            {/* CONTENEDOR SCROLLEABLE */}
            <div className="slider" ref={sliderRef}>
                {Portafolio.length === 0 && (
                    <p className="text-center w-100">Cargando....'u'</p>
                )}
                {Portafolio.map((Portafolio)=>(
                    <div className="card-Portafolio" key={Portafolio.id}>
                        <h3 className="card-titulo">
                            {Portafolio.titulo}
                        </h3>
                        <img
                            src={Portafolio.imagen || "/default-portafolio.png"}
                            alt="perfil"
                            className="card-img"
                        />
                        <p className="card-fecha">
                            {Portafolio.fecha}
                        </p>
                        <p className="card-descricion">
                            {Portafolio.descripcion}
                        </p>
                    </div>
                ))}
            </div>
            {/* BOTÓN DERECHA */}
            <button className="slider-btn right" onClick={scrollRight}>❯</button>
        </div>
    </div>
  )
}
export default CarruselPortafolio