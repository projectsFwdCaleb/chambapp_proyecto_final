import React, {useState} from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import SidebarRender from "../components/SidebarRender/SidebarRender";
import SidebarChats from "../components/SidebarChats/SidebarChats";
import ChatBot3D from "../components/Chatbot3D/ChatBot3D";
import ChatBot from "../components/ChatBot/ChatBot";
import VerPerfil from '../components/VerPerfil/VerPerfil';

function Profile() {
    const [open, setOpen] = useState(false);
  return (
  <div>
    <div className="d-flex">
      <div className="col-2">
        <SidebarRender/>
      </div>
      
      <div className="col-10">
        <Header/>
          <div className="d-flex">
            <div className="mainNav col-8">
              <VerPerfil />
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
    </div>
      <Footer/>
  </div>  
  )
}

export default Profile