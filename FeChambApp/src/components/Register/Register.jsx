import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './Register.css'
import ServicesUsuarios from '../../servers/ServicesUsuarios'
function Register() {
    const [nombreU,SetNombreU] = useState("")
    const [contraseña,setContraseña] = useState("")
    const [correo,setCorreo] = useState("")
    const [error,setError] = useState("")
    const [exito, setExito] = useState("")
    const navigate=useNavigate()

  return (
    <div className="AreaRegister">
      <h1>Registro Para Usuarios</h1>
      
        <label htmlFor="inNombre">Nombre</label><br />
        <input  type="text" id='inNombre' value={nombreU} onChange={(e) => SetNombreU(e.target.value)}/><br />
        <label htmlFor="inCorreo">Correo</label><br />
        <input type="email" id='inCorreo' value={correo} onChange={(e) => setCorreo(e.target.value)}/><br />
        <label htmlFor="inContraseña">Contraseña</label><br />
        <input type="password" id='inContraseña' value={contraseña} onChange={(e) => setContraseña(e.target.value)}/><br />
        
        <button onClick={ManejarRegistros}>Registrar</button>

        {error && <p style={{color: 'red'}}>{error}</p>}
        {exito && <p style={{color: 'green'}}>{exito}</p>}
    </div>
  )
}

export default Register
