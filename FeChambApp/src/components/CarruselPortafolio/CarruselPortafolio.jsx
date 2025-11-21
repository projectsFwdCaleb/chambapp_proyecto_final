/*el useStete ya es basicamente fijo, pero tambien ocuparemos useRef para el carrusel que haremos 
y effect es para las peticiones al api*/
import React, { useEffect, useRef, useState } from "react";
/*importamos los servisios del portafolio para traer la informacion de la base*/
import ServicesPortafolio from "../../Services/ServicesPortafolio";
 function CarruselPortafolio() {
    /*constantes para usar.....esperabas algo difente a este punto :/*/
    const [Portafolio, setPortafolio]=useState([]);
    const sliderRef = useRef(null);

    /*donde se hace la magia, llamamos la informacion de la base con el fetchPortafolio*/
    useEffect(()=>{ 
        const fetchPortafolio = async() =>{
            try{
                /*m*/
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