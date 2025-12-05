import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import SidebarRender from "../components/SidebarRender/SidebarRender";
import SidebarChats from "../components/SidebarChats/SidebarChats";
import ChatBot3D from "../components/Chatbot3D/ChatBot3D";
import ChatBot from "../components/ChatBot/ChatBot";
import MainFavoritos from '../components/MainFavoritos/MainFavoritos'

function Favorite() {
const { id } = useParams();
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
              <MainFavoritos />
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

export default Favorite