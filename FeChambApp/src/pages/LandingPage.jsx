import React, { useState } from "react";
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import CarruselCercanos from '../components/CarruselCercanos/CarruselCercanos'
import CarruselPopular from '../components/CarruselPopular/CarruselPopular'
import SidebarRender from "../components/SidebarRender/SidebarRender";
import SidebarChats from "../components/SidebarChats/SidebarChats";
import ChatBot3D from "../components/Chatbot3D/ChatBot3D";
import ChatBot from "../components/ChatBot/ChatBot";

function LandingPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="d-flex">
      <div className="col-2">
        <SidebarRender/>
      </div>
      
      <div className="col-7">
        <Header/>
          <div className="mainNav">
            <CarruselPopular/>
            <br />
            <br />
            <CarruselCercanos/>
          </div>
      </div>
      <div className="col-3 d-flex flex-column columna-derecha-completa">

        <div className="flex-grow-1 sidebar-chats-container">
          <SidebarChats />
        </div>

        <div className="">
          <ChatBot3D onOpenChat={() => setOpen(true)} />
          {open && <ChatBot onClose={() => setOpen(false)} />}
        </div>

      </div>

     
    </div>
  )
}

export default LandingPage
 /* </> */