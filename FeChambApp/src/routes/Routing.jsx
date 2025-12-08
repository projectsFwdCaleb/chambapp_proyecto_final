import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import LandingPage from '../pages/LandingPage'
import PaginaLogingRegister from '../pages/PaginaLogingRegister'
import PaginaTrabajador from '../pages/PaginaTrabajador'
import Profile from '../pages/Profile'
import PaginaAdministrador from '../pages/PaginaAdministrador'
import Servicio from '../pages/Servicio'
import PaginaSolicitudes from '../pages/PaginaSolicitudes'
import Categorias from '../pages/Categorias'
import Favorite from '../pages/Favorite'
import About from '../pages/About'
import PrivateRoutes from '../routes/PrivateRoutes'
export default function Routing() {
  return (
      <Router>
        <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/Loging' element={<PaginaLogingRegister/>}/>
        <Route path='/Trabajador/:id' element={<PaginaTrabajador/>}/>
        <Route path='/Perfil' element={<PrivateRoutes> <Profile/> </PrivateRoutes>}/>
        <Route path='/Administrador' element={<PrivateRoutes allowedRoles={["admin"]}> <PaginaAdministrador /> </PrivateRoutes>}/>
        <Route path='/Nuevo-Servicio' element={<PrivateRoutes> <Servicio/> </PrivateRoutes>}/>
        <Route path='/Solicitudes' element={<PrivateRoutes> <PaginaSolicitudes/> </PrivateRoutes>}/>
        <Route path='/categoria/:id' element={<Categorias/>}/>
        <Route path='/favoritos' element={<PrivateRoutes> <Favorite/> </PrivateRoutes>}/>
        <Route path='/acerca-de' element={<About/>}/>
        </Routes>
      </Router>
  );
}
