import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './Login.css'
import ServicesLogin from '../../Services/ServicesLogin'
function Login() {
    const [nombreU,SetNombreU] = useState("")
    const [contraseña,setContraseña] = useState("")
    const navigate=useNavigate("")

    const verificarU = async () => {
        try {
          const credentials = {
            username: nombreU,
            password: contraseña
          }
          const response = await ServicesLogin.postLogin(credentials)

          localStorage.setItem('access_token', response.access)
          localStorage.setItem('refresh_token', response.refresh)
          console.log("Login exitoso :)")
          navigate("/dashboard")

        } catch (error) {
          console.error("Error al del Login:", error)
        }         
    }

  return (
    <div className="AreaLogin">
       <h1>Loging De Acceso</h1>
        {/* InNom = ingresar nombre*/}
        <label htmlFor="InNom">Nombre</label><br />
        <input  type="text" id='InNom' value={nombreU} onChange={(e) => SetNombreU(e.target.value)}/><br />
        {/* InCon = ingresar contraseña */}
        <label htmlFor="InCon">Contraseña</label><br />
        <input type="password" id='InCon' value={contraseña} onChange={(e) => setContraseña(e.target.value)}/><br />
        <button onClick={verificarU}>Entrar</button>
    </div>
  )
}
export default Login