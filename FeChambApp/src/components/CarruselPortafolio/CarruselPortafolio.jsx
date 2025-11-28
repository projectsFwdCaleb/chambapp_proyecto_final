/*el useStete ya es basicamente fijo, pero tambien ocuparemos useRef para el carrusel que haremos 
y effect es para las peticiones al api*/
import React, { useEffect, useRef, useState } from "react";
/*importamos los servisios del portafolio para traer la informacion de la base*/
import ServicesPortafolio from "../../Services/ServicesPortafolio";
/*aqui importamos desde bootstrap carousel para el carrusel, digo ese es el punto de este componente :| */
import Carousel from 'react-bootstrap/Carousel';
/*Tambien se llaman los estilos, ocupare eso*/
import "../CarruselPortafolio/CarruselPortafolio.css"
 function CarruselPortafolio({id}) {
    /*constantes para usar.....esperabas algo difente a este punto :/*/
    const [Portafolio, setPortafolio]=useState([]);

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

  return (
    <div className="container mt-4 carrusel-container">
      <h2 className="titulo-Portafolio">Portafolio del usuario</h2>

      <Carousel interval={4000} indicators={true}>
        {Portafolio.map((item) => (
          <Carousel.Item key={item.id}>
            <div className="portafolio-slide glass-card">
              <div className="portafolio-img">
                <img
                  src={item.imagen || "/default-portafolio.png"}
                  alt="imagen"
                />
              </div>

              <div className="portafolio-info">
                <h3>{item.titulo}</h3>

                <p className="fecha">{item.fecha}</p>

                <p className="descripcion">{item.descripcion}</p>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
export default CarruselPortafolio