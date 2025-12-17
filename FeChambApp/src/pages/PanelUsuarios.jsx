import React from 'react'
import Header from '../components/Header/Header'
import SidebarRender from '../components/SidebarRender/SidebarRender'
import "../pages/LandingPage.css"
import UsuariosAdmin from '../components/UsuariosAdmin/UsuariosAdmin'
import Footer from '../components/Footer/Footer'

function PanelUsuarios() {



  return (
  <div>
    <div className='d-flex'>
      <div className='col-2'>
        <SidebarRender />
      </div>

      <div className='col-10'>
        <UsuariosAdmin/>
      </div>  

    </div>
      <Footer/>
  </div>
  )
}

export default PanelUsuarios