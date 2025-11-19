import React, { useEffect, useRef, useState } from "react";
import ServicesPortafolio from "../../Services/ServicesPortafolio";
 function CarruselPortafolio() {
    const [Portafolio, setPortafolio]=useState([]);
    const sliderRef = useRef(null);

    useEffect(()=>{ 
        const fetchPortafolio = async() =>{
            try{
                const resp = await ServicesUsuarios.getUsuarios();

                const data = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response)
                    ? response
                    :[];
                setPopulares(data);
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
            <button className="slider-btn left" onClick={() => scrollBy('left')}>❮</button>
            {/* CONTENEDOR SCROLLEABLE */}
            <div className="slider" ref={sliderRef}>
                {Portafolio.length === 0 && (
                    <p className="text-center w-100">Cargando....'u'</p>
                )}

                {Portafolio.map((user)=>(
                    <div className="card-Portafolio" key={user.id}>
                        <h4 className="card-titulo"las>
                            {user.titulo}
                        </h4>
                        
                        <img
                            src={user.imagen || "/default-portafolio.png"}
                            alt="perfil"
                            className="card-img"
                         />
                        <p className="card-fecha">
                            {user.fecha}
                        </p>
                        <p className="card-descricion">
                            {user.descripcion}
                        </p>

                    </div>
                ))}


            </div>

        </div>
      
    </div>
  )
}
export default CarruselPortafolio