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
<<<<<<< HEAD
          <Route path='/' element={<LandingPage/>} />
          <Route path='/Loging' element={<PaginaLogingRegister/>}/>
          <Route path='/Trabajador' element={<PaginaTrabajador/>}/>
          <Route path='/Perfil' element={<PaginaPerfil/>}/>
          <Route path='/Administrador' element={<PaginaAdministrador/>}/>
=======
        <Route path='/Home' element={<LandingPage/>} />
        <Route path='/Loging' element={<PaginaLogingRegister/>}/>
        <Route path='/Trabajador' element={<PaginaTrabajador/>}/>
        <Route path='/Perfil' element={<PaginaPerfil/>}/>
        <Route path='/Administrador' element={<PaginaAdministrador/>}/>
>>>>>>> 58ef66ae3e6db3db8b48d0cacf0c5472fabc4e5d
        </Routes>
      </Router>
  );
}
