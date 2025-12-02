import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import LandingPage from '../pages/LandingPage'
import PaginaLogingRegister from '../pages/PaginaLogingRegister'
import PaginaTrabajador from '../pages/PaginaTrabajador'
import Profile from '../pages/Profile'
import PaginaAdministrador from '../pages/PaginaAdministrador'
import Servicio from '../pages/Servicio'
import Categorias from '../pages/Categorias'
import Favorite from '../pages/Favorite'
export default function Routing() {
  return (
      <Router>
        <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/Loging' element={<PaginaLogingRegister/>}/>
        <Route path='/Trabajador/:id' element={<PaginaTrabajador/>}/>
        <Route path='/Perfil' element={<Profile/>}/>
        <Route path='/Administrador' element={<PaginaAdministrador/>}/>
        <Route path='/Nuevo-Servicio' element={<Servicio/>}/>
        <Route path='/categoria/:id' element={<Categorias/>}/>
        <Route path='/favoritos' element={<Favorite/>}/>
        </Routes>
      </Router>
  );
}
