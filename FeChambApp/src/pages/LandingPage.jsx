import React from "react";
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import CarruselCercanos from '../components/CarruselCercanos/CarruselCercanos'
import CarruselPopular from '../components/CarruselPopular/CarruselPopular'
import CarruselTrabajo from '../components/CarruselTrabajo/CarruselTrabajo'

function LandingPage() {
  return (
    <div>
      <Header/>
      <CarruselTrabajo/>
      <Footer/>
    </div>
  )
}

export default LandingPage
 /* </> */