import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './Register.css'
import ServicesUsuarios from '../../Services/ServicesUsuarios'
function Register() {
    const [nombreU,SetNombreU] = useState("")
    const [contraseña,setContraseña] = useState("")
    const [correo,setCorreo] = useState("")
    const [error,setError] = useState("")
    const [exito, setExito] = useState("")
    const navigate=useNavigate()

    const ManejarRegistros = async () => {
      /* borrar los mensajes de error y exito anteriores */
      setError("")    
      setExito("")
      /* para que no puedan registrarse con campos en blanco (minimo que los inventen) */
     if (!nombre || !correo || !telefono || !contraseña) {
      setError("No has llenado todos los campos")
      return
     }
     /* asegurarse que las contraseñas tengan mas de 8 carateres(Porque sera el minimo siempre es 8?) */
    if (contraseña.length < 8) {
      setError("La contraseña debe tener un minimo de 8 caracteres (porque no usas el nombre de una cancion).")
      return
    }
    

    }

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
