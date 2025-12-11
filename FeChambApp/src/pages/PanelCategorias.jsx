import React from 'react'
import Header from '../components/Header/Header'
import SidebarRender from '../components/SidebarRender/SidebarRender'
import "../pages/LandingPage.css"
import CategoriasAdmin from '../components/CategoriasAdmin/CategoriasAdmin'
import Footer from '../components/Footer/Footer'
function PanelCategorias() {



  return (
    <div className='d-flex'>
      <div className='col-2'>
        <SidebarRender />
      </div>

      <div className='col-10'>
        <CategoriasAdmin/>
        <Footer/>
      </div>  

    </div>
  )
}

export default PanelCategorias