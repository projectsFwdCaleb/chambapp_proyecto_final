import React from 'react'
import Header from '../components/Header/Header'
import SidebarRender from '../components/SidebarRender/SidebarRender'
import "../pages/LandingPage.css"
import ResenhasAdmin from '../components/ResenhasAdmin/ResenhasAdmin'
import Footer from '../components/Footer/Footer'

function PanelResenhas() {



  return (
  <div>
    <div className='d-flex'>
      <div className='col-2'>
        <SidebarRender />
      </div>

      <div className='col-10'>
        <ResenhasAdmin/>
      </div>  

    </div>
      <Footer/>
  </div>  
  )
}

export default PanelResenhas