import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './Login.css'
import ServicesUsuarios from '../../servers/ServicesUsuarios'
function Login() {
    const [nombreU,SetNombreU] = useState("")
    const [contraseña,setContraseña] = useState("")
    const navigate=useNavigate("")

    const verificarU = async () => {
        try {
          const usuarios = await ServicesUsuarios.getUsuarios()

          console.log(usuarios);

          const usuarioEncontrado = usuarios.find(
        user => user.nombre === nombre && user.contraseña === contraseña
      )

      if (!usuarioEncontrado) {
        /*console.log("Tus credenciales no son correctas ")*/
        navigate("/")
        return
      }

      if (usuarioEncontrado.grupo=== "?") {
        /*localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado))
        console.log("Tus credenciales son correctas",usuarioEncontrado)*/
        navigate("/")
      } else {
        /*console.log("Tipo de usuario no reconocido")*/
      }

        } catch (error) {
      console.error("Error al obtener usuarios:", error)
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
        <button onClick={VerificarUser}>Entrar</button>
    </div>
  )
}
export default Login