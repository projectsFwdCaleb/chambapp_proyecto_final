import React, { useState } from 'react'
import './Register.css'
import { useNavigate, Link } from "react-router-dom";
import ServicesUsuarios from '../../Services/ServicesUsuarios'
import ServicesLogin from '../../Services/ServicesLogin';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Register({ onSwitchToLogin }) {

  /*Las constantes, porque llevamos 5 meses haciendo constantes y no 
  pareses que vallamos a parar en algun momento  */
  const [username, Setusername] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setpassword] = useState('')
  const navigate = useNavigate()

  const ManejarRegistros = async () => {

    /* Aplicar trim a todos los campos */
    const usernameTrimmed = username.trim()
    const correoTrimmed = correo.trim()
    const passwordTrimmed = password.trim()

    /* para que no puedan registrarse con campos en blanco (minimo que los inventen) */
    if (!usernameTrimmed || !correoTrimmed || !passwordTrimmed) {
      toast.error('No has llenado todos los campos, regresa y llenalos', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      return
    }

    /* asegurarse que las passwords tengan mas de 8 carateres(Porque sera el minimo siempre es 8?) */
    if (passwordTrimmed.length < 8) {
      toast.error('La password debe tener un minimo de 8 caracteres (y trata de no olvidarla).', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      return
    }

    try {
      const nuevoUsuario = {
        username: usernameTrimmed,
        email: correoTrimmed,
        password: passwordTrimmed,
      }

      const respuesta = await ServicesUsuarios.postUsuarios(nuevoUsuario)

      if (respuesta && respuesta.id) {

        /*Aqui la funcionalidad Especial, un [AUTOLOGIN]  */
        toast.success("Usuario registrado correctamente. Iniciado sesion.....;)", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })

        const credentials = { username: usernameTrimmed, password: passwordTrimmed }

        /*Y para esto importamos el servicios Login */
        const loginResponse = await ServicesLogin.postLogin(credentials)

        /*Usaremos estas dos lineas para guardar los tokens en el local storage*/
        localStorage.setItem('access_token', loginResponse.access)
        localStorage.setItem('refresh_token', loginResponse.refresh)

        setTimeout(() => {
          navigate('/')
        }, 2000)
          /*validaciones,validaciones y mas validaciones, solo las tipicas nesesarias a la hora de hacer un usuario */
      } else if (respuesta?.username) {
        toast.error("Ese nombre de usuario ya está en uso.", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      } else if (respuesta?.email) {
        toast.error("Ese correo ya está registrado.", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      } else {
        toast.error("No se pudo registrar el usuario.", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      }
      /*el mensaje de error, esta vez mas resposivo que nunca antes */
    } catch (error) {
      console.error('Error al registrar:', error)
      toast.error('Error al conectar con el servidor.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    }
  }

  return (
    <>
    <ToastContainer />
    <div className="register-container">
      {/*con toastify podremos tener notificaciones en estos contenedores */}

      {/*textos bonitos para que la pagina se vea mejor y un boton para ir al loging*/}
      <div className="register-left">
        <div className="register-content">
          <h2>Únete a nosotros</h2>
          <p>Crea tu cuenta para conectar con expertos</p>
          <ul className="register-features">
            <li>✓ Acceso completo a servicios</li>
            <li>✓ Comunidad profesional</li>
          </ul>
          <button className="btn-login-switch" onClick={onSwitchToLogin}>
            ¿Ya tienes cuenta? Iniciar sesión
          </button>
        </div>
      </div>

      {/*aqui esta el logo, quedo muy bien*/}
      <div className="register-right">
        <div className="register-header">
          <img src="/logo.png" alt="ChambApp" className='logo'/>
          <h2>Registro</h2>
        </div>

        <div className="register-form">
          {/*aqui inicia lo que normamente vez en login, inputs*/}
          <div className="form-group">
            {/*para poner el nombre*/}
            <input
              type="text"
              id="inNombre"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => Setusername(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            {/*para poner el correo*/}
            <input
              type="email"
              id="inCorreo"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            {/*para poner la contraseña(no la olvides)*/}
            <input
              type="password"
              id="inpassword"
              placeholder="Contraseña (mín. 8 caracteres)"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="form-control"
            />
          </div>
          <br />
          {/*y el boton al final para llamar la fucion que tanto costo hacer arriba */}
          <button className="btn-register-submit" onClick={ManejarRegistros}>
            Registrar
          </button>
          <Link to='/acerca-de'><small className='text-muted'>*Al usar Chambapp aceptas los terminos y condiciones*</small></Link>
        </div>
      </div>
    </div>
    </>
  )
}

export default Register
