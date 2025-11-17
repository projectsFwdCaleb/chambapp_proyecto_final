import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import LandingPage from '../pages/LandingPage'
import PaginaLogingRegister from '../pages/PaginaLogingRegister'
import PaginaTrabajador from '../pages/PaginaTrabajador'
import PaginaPerfil from '../pages/PaginaPerfil'
import PaginaAdministrador from '../pages/PaginaAdministrador'
export default function Routing() {
  return (
      <Router>
        <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/Loging' element={<PaginaLogingRegister/>}/>
        <Route path='/Trabajador' element={<PaginaTrabajador/>}/>
        <Route path='/Perfil' element={<PaginaPerfil/>}/>
        <Route path='/Administrador' element={<PaginaAdministrador/>}/>
        </Routes>
      </Router>
  );
}
