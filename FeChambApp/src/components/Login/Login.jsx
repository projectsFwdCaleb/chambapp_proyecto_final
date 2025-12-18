import React, { useState } from 'react'
import '../Login/Login.css'
import { useNavigate } from 'react-router-dom'
import ServicesLogin from '../../Services/ServicesLogin'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useUser } from '../../../Context/UserContext'

function Login({ onSwitchToRegister }) {

  /* Las constantes, porque si no declaramos 20 useState al día nos da ansiedad */
  const [nombreU, SetNombreU] = useState('')
  const [contraseña, setContraseña] = useState('')
  const navigate = useNavigate()
  const { setUser } = useUser();

  const verificarU = async () => {

    /* Validación de campos vacíos con trim */
    const nombreTrimmed = nombreU.trim()
    const contraseñaTrimmed = contraseña.trim()

    if (!nombreTrimmed) {
      toast.error('Por favor ingresa tu nombre de usuario', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      return
    }

    if (!contraseñaTrimmed) {
      toast.error('Por favor ingresa tu contraseña', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      return
    }

    /* Aquí hacemos la magia del login */
    try {
      const credentials = {
        username: nombreTrimmed,
        password: contraseñaTrimmed
      }

      const response = await ServicesLogin.postLogin(credentials)

      /* Guardando tokens como si fueran tesoros del dragón Smaug */
      localStorage.setItem('access_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)

      /*trallendo los datos de usuario por contrabando dese la base */
      const user = await ServicesLogin.getUserSession()
      setUser(user); // Update context

      /*guardando los datos en laugh tale*/
      /*guardando los datos en laugh tale*/
      const grupo = user.grupos && user.grupos.length > 0 ? user.grupos[0] : null;
      if (grupo) {
        localStorage.setItem("grupo", JSON.stringify(grupo));
      } else {
        localStorage.removeItem("grupo");
      }

      toast.success('¡Login exitoso! Bienvenido', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })

      console.log("Login exitoso :)")

      /* Redirigir según el grupo del usuario */
      setTimeout(() => {
        if (grupo === "clientes") {
          navigate("/")
        } else if (grupo === "trabajadores") {
          navigate("/Trabajador/" + user.id)
        } else if (grupo === "admin") {
          navigate("/Administrador")
        } else {
          navigate("/") // Ruta por defecto si no coincide ningún grupo
        }
      }, 2000)

    } catch (error) {
      console.error("Error al del Login:", error)

      /* Validación de credenciales incorrectas */
      if (error.response && error.response.status === 401) {
        toast.error('Usuario o contraseña incorrectos', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      } else {
        toast.error('Error al iniciar sesión. Intenta nuevamente', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      }
    }
  }

    /*una funcion para entrar con enter, como dios manda */ 
  const enterParaEntrar = (event) => {
    if (event.key === 'Enter') {
      /*yamamos a la fucion verificarU, esa es la que*/
      verificarU(); 
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="login-container">

        <div className="login-left">
          <div className="login-content">
            <h2>Conecta con expertos</h2>
            <p>Disfruta de servicios profesionales cerca de ti</p>

            <ul className="login-features">
              <li>✓ Encuentra en tu zona</li>
              <li>✓ Calificaciones de usuarios</li>
            </ul>
            {/*boton para abrir el complemento de register*/}
            <br />
            <button className="btn-register" onClick={onSwitchToRegister}>
              Registro
            </button>
          </div>
        </div>

        <div className="login-right">

          <div className="login-header">
            <img src="/logo.png" alt="ChambApp" className='logo' />
            <h2>Login</h2>
          </div>

          <div className="login-form">

            {/* InNom = ingresar nombre */}
            <div className="form-group">
              <input
                type="text"
                id="InNom"
                placeholder="Nombre de usuario"
                value={nombreU}
                onChange={(e) => SetNombreU(e.target.value)}
                 onKeyDown={enterParaEntrar}
                className="form-control"
              />
            </div>

            {/* InCon = ingresar contraseña */}
            <div className="form-group">
              <input
                type="password"
                id="InCon"
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                 onKeyDown={enterParaEntrar}
                className="form-control"
              />
            </div>

            <a href="#" className="forgot-password">
              Olvidó su contraseña?
            </a>
            {/*El boton login para llamar la fucion "verificarU"*/}
            <button onKeyDown={enterParaEntrar} className="btn-login" onClick={verificarU}>
              Login
            </button>

            <p className="login-social">O inicia sesión con Google</p>
            {/*un divide para guardar varios iconos a usar*/}
            <div className="social-icons">
              <a href="#" className="social-icon google">G</a>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Login
