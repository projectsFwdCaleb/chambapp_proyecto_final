import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import CarruselPortafolio from '../components/CarruselPortafolio/CarruselPortafolio'
import BanerTrabajador from '../components/BanerTrabajador/BanerTrabajador'
/*Impor muy nesesario, esto toma id de en la pagina 
para usarlo en los componentes del baner y el carrusel */
import { useParams } from 'react-router-dom'

function PaginaTrabajador() {
  /*aqui es donde se hace la constante id que tomara el valor del useParams..el cual ya tiene el valor
   del id en la pagina....es un poco enredado pero funciona ;)*/
  const { id } = useParams();
  return (
    <div>
      <Header/> 
      <BanerTrabajador id={id}/>
      <CarruselPortafolio id={id}/>
      <Footer/>      
    </div>
  )
}

export default PaginaTrabajador
 /* </> */