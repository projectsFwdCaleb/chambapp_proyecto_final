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
import PanelUsuarios from '../pages/PanelUsuarios'
import PanelSolicitudes from '../pages/PanelSolicitudes'
import PanelServicios from '../pages/PanelServicios'
import PanelResenhas from '../pages/PanelResenhas'
import PanelCategorias from '../pages/PanelCategorias'
export default function Routing() {
  return (
      <Router>
        <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/Loging' element={<PaginaLogingRegister/>}/>
        <Route path='/Trabajador/:id' element={<PaginaTrabajador/>}/>
        <Route path='/Administrador' element={<PrivateRoutes allowedRoles={["admin"]}> <PaginaAdministrador/> </PrivateRoutes>}/>
        <Route path='/Perfil' element={<PrivateRoutes> <Profile/> </PrivateRoutes>}/>
        <Route path='/Administrador/usuarios' element={<PrivateRoutes allowedRoles={["admin"]}> <PanelUsuarios/> </PrivateRoutes>}/>
        <Route path='/Administrador/solicitudes' element={<PrivateRoutes allowedRoles={["admin"]}> <PanelSolicitudes /> </PrivateRoutes>}/>
        <Route path='/Administrador/servicios' element={<PrivateRoutes allowedRoles={["admin"]}> <PanelServicios /> </PrivateRoutes>}/>
        <Route path='/Administrador/resenhas' element={<PrivateRoutes allowedRoles={["admin"]}> <PanelResenhas /> </PrivateRoutes>}/>
        <Route path='/Administrador/categorias' element={<PrivateRoutes allowedRoles={["admin"]}> <PanelCategorias /> </PrivateRoutes>}/>
        <Route path='/Nuevo-Servicio' element={<PrivateRoutes> <Servicio/> </PrivateRoutes>}/>
        <Route path='/Solicitudes' element={<PrivateRoutes> <PaginaSolicitudes/> </PrivateRoutes>}/>
        <Route path='/categoria/:id' element={<Categorias/>}/>
        <Route path='/favoritos' element={<PrivateRoutes> <Favorite/> </PrivateRoutes>}/>
        <Route path='/acerca-de' element={<About/>}/>
        </Routes>
      </Router>
  );
}
