import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './Register.css'
import ServicesUsuarios from '../../Services/ServicesUsuarios'
/*Traeremos los servicios del login para una funcion especial ;) */
import ServicesLogin from '../../Services/ServicesLogin';
function Register() {
    /*Las constantes, porque llevamos 5 meses haciendo constantes y no 
    pareses que vallamos a parar en algun momento  */
    const [username,Setusername] = useState("")
    const [email, setEmail] = useState("");
    const [password,setpassword] = useState("")
    const [correo,setCorreo] = useState("")
    const [error,setError] = useState("")
    const [exito, setExito] = useState("")
    const navigate=useNavigate()

    const ManejarRegistros = async () => {
      /* borrar los mensajes de error y exito anteriores (no queremos que se acumulen) */
      setError("")    
      setExito("")
      /* para que no puedan registrarse con campos en blanco (minimo que los inventen) */
     if (!username  || !correo || !password) {
      setError("No has llenado todos los campos, regresa y llenalos ")
      return
     }
     /* asegurarse que las passwords tengan mas de 8 carateres(Porque sera el minimo siempre es 8?) */
    if (password.length < 8) {
      setError("La password debe tener un minimo de 8 caracteres (y trata de no olvidarla).")
      return
    }
    
    try{
        const nuevoUsario={
          username: username,
          email: email,
          password: password
        };
        const respuesta = await ServicesUsuarios.postUsuarios(nuevoUsario);

        if (respuesta && respuesta.id) {
          /*Aqui la funcionalidad Especial, un [AUTOLOGIN]  */
          setExito("Usuario registrado correctamente. Iniciado sesion.....;)")
          const credentials = {username,password};
          /*Y para esto importamos el servicios Login */
          const loginResponse= await ServicesLogin.postLogin(credentials);
          /*Usaremos estas dos lineas para guardar los tokens en el local storage*/
          localStorage.setItem('access_token', loginResponse.access);
          localStorage.setItem('refresh_token', loginResponse.refresh);

        } else if(respuesta.username) {
          setError("Ese nombre de usuario ya está en uso.");
        } else if (respuesta.email) {
          setError("Ese correo ya está registrado.");
        } else {
          setError("No se pudo registrar el usuario.");
        }
    }catch (error) {
      console.error("Error al registrar:", error);
      setError("Error al conectar con el servidor.");
    }

    }

  return (
    <div className="AreaRegister">
      <h1>Registro Para Usuarios</h1>
      
        <label htmlFor="inNombre">Nombre</label><br />
        <input  type="text" id='inNombre' value={username} onChange={(e) => Setusername(e.target.value)}/><br />
        <label htmlFor="inCorreo">Correo</label><br />
        <input type="email" id='inCorreo' value={correo} onChange={(e) => setCorreo(e.target.value)}/><br />
        <label htmlFor="inpassword">password</label><br />
        <input type="password" id='inpassword' value={password} onChange={(e) => setpassword(e.target.value)}/><br />
        
        <button onClick={ManejarRegistros}>Registrar</button>

        {error && <p style={{color: 'red'}}>{error}</p>}
        {exito && <p style={{color: 'green'}}>{exito}</p>}
    </div>
  )
}

export default Register
