/*el useStete ya es basicamente fijo, pero tambien ocuparemos useRef para el carrusel que haremos 
y effect es para las peticiones al api*/
import React, { useEffect, useRef, useState } from "react";
/*importamos los servisios del portafolio para traer la informacion de la base*/
import ServicesPortafolio from "../../Services/ServicesPortafolio";
 function CarruselPortafolio({id}) {
    /*constantes para usar.....esperabas algo difente a este punto :/*/
    const [Portafolio, setPortafolio]=useState([]);
    const sliderRef = useRef(null);

    /*una constante que donde traeremos la informacion de la base para montarla(bacicamente una funcion)*/
    useEffect(()=>{ 
        const fetchPortafolio = async() =>{
            /*try para probar por errores*/
            try{
                /*el get para traer la infomacion*/
                const resp = await ServicesPortafolio.getPortafolio(id);
                /*la guardamos en data*/
                const data = Array.isArray(resp) ? resp: [];
                /*y luego ponemos data en portafolio(suena redundante pero es necesario)*/
                setPortafolio(data);
                /*el catch para tomar los errores con un mensaje para saber donde paso*/
            } catch (error) {
                console.error("Error cargando El Portafolio:", error);
            }
        };
        /*ninguna funcion/constante es util si olvidas llamarla*/
        fetchPortafolio();
    },[id]);
     /*funciones/constantes para el movimiento, uno para izquierda y otro para derecha*/
  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };    

  return (
    <div className="container mt-4 carrusel-container">
        {/* aqui inicia el contenedor del carrusel, primero el titulo */}
        <h2 className="titulo-Portafolio">Portafolio de usuario</h2>
        <div className="slider-wrapper">
            {/* BOTÓN IZQUIERDA */}
            <button className="slider-btn left" onClick={scrollLeft}>❮</button>
            {/* CONTENEDOR SCROLLEABLE */}
            <div className="slider" ref={sliderRef}>
                {Portafolio.length === 0 && (
                    <p className="text-center w-100">Cargando....'u'</p>
                )}
                {/* el map para imprimir la infomacion de portafolio en la pagina */}
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