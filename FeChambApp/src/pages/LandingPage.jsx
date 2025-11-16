import React from "react";
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import CarruselCercanos from '../components/CarruselCercanos/CarruselCercanos'
import CarruselPopular from '../components/CarruselPopular/CarruselPopular'
import CarruselTrabajo from '../components/CarruselTrabajo/CarruselTrabajo'
import SidebarRender from "../components/SidebarRender/SidebarRender";

function LandingPage() {
  return (
    <div className="d-flex">
      <div className="col-2">
        <SidebarRender/>
      </div>
      
      <div className="col-6">
        <Header/>
      </div>
      <div className="col-2">

      </div>
     
    </div>
  )
}

export default LandingPage