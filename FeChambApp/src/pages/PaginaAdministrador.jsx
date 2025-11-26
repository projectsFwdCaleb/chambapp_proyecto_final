import React from 'react'
import Header from '../components/Header/Header'
import UsuariosAdmin from '../components/UsuariosAdmin/UsuariosAdmin'
import Footer from '../components/Footer/Footer'
import SidebarRender from '../components/SidebarRender/SidebarRender'
import SidebarChats from '../components/SidebarChats/SidebarChats'
import "../pages/LandingPage.css"

function PaginaAdministrador() {
  return (
    <div className='d-flex'>
      <div className='col-2'>
        <SidebarRender />
      </div>

      <div className='col-7'>
        <UsuariosAdmin/>
        <Footer/>
      </div>  

      <div className='col-3'>
        <br />
        <SidebarChats />
      </div>
    </div>
  )
}

export default PaginaAdministrador
 /* </> */