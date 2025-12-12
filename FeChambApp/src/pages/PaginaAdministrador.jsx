import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import SidebarRender from '../components/SidebarRender/SidebarRender'
import AdminDashboard from '../components/AdminDashboard/AdminDashboard'

function PaginaAdministrador() {
  return (
    <div className='d-flex'>
      <div className='col-2'>
        <SidebarRender />
      </div>

      <div className='col-10'>
        <AdminDashboard/>
        <Footer/>
      </div>  
    
    </div>
  )
}

export default PaginaAdministrador
 /* </> */