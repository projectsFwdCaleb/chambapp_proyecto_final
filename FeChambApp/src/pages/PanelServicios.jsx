import React from 'react'
import Header from '../components/Header/Header'
import SidebarRender from '../components/SidebarRender/SidebarRender'
import "../pages/LandingPage.css"
import ServiciosAdmin from '../components/ServiciosAdmin/ServiciosAdmin'
import Footer from '../components/Footer/Footer'

function PanelServicios() {



  return (
  <div>
    <div className='d-flex'>
      <div className='col-2'>
        <SidebarRender />
      </div>

      <div className='col-10'>
        <ServiciosAdmin/>
      </div>  

    </div>
      <Footer/>
  </div>
  )
}

export default PanelServicios