import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import SidebarRender from "../components/SidebarRender/SidebarRender";
import SidebarChats from "../components/SidebarChats/SidebarChats";
import ChatBot3D from "../components/Chatbot3D/ChatBot3D";
import ChatBot from "../components/ChatBot/ChatBot";
import CarruselPortafolio from '../components/CarruselPortafolio/CarruselPortafolio'
import BanerTrabajador from '../components/BanerTrabajador/BanerTrabajador'
import BuzonComentarios from "../components/BuzonComentarios/BuzonComentarios";
import '../pages/PaginaTrabajador.css'
/*Impor muy nesesario, esto toma id de en la pagina 
para usarlo en los componentes del baner y el carrusel */


function PaginaTrabajador() {
  /*aqui es donde se hace la constante id que tomara el valor del useParams..el cual ya tiene el valor
   del id en la pagina....es un poco enredado pero funciona ;)*/
  const { id } = useParams();
  console.log(id);
  const [open, setOpen] = useState(false);
  return (
    <div className="d-flex">
      <div className="col-2">
        <SidebarRender/>
      </div>
      
      <div className="col-10">
        <Header/>
          <div className="d-flex">
            <div className="mainNav col-8">
              <BanerTrabajador id={id} />
              <CarruselPortafolio id={id} />
              <BuzonComentarios id={id}/>
            </div>
            
            <div className="col-4 d-flex flex-column columna-derecha-completa">

              <div className="flex-grow-1 sidebar-chats-container">
                <SidebarChats />
              </div>

              <div className="">
                <ChatBot3D onOpenChat={() => setOpen(true)} />
                {open && <ChatBot onClose={() => setOpen(false)} />}
              </div>
           </div>
          </div>
      </div>
      
      {/* <Footer/> */}
     
    </div>
  )
}

export default PaginaTrabajador
 /* </> */