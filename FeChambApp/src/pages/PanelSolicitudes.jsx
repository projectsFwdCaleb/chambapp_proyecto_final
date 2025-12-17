import React from 'react'
import Header from '../components/Header/Header'
import SidebarRender from '../components/SidebarRender/SidebarRender'
import "../pages/LandingPage.css"
import SolicitudesAdmin from '../components/SolicitudesAdmin/SolicitudesAdmin'
import Footer from '../components/Footer/Footer'

function PanelSolicitudes() {


  return (
  <div>
    <div className='d-flex'>
      <div className='col-2'>
        <SidebarRender />
      </div>

      <div className='col-10'>
        <SolicitudesAdmin/>
      </div>  

    </div>
      <Footer/>
  </div>
  )
}

export default PanelSolicitudes