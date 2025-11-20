import React, { useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import ServicesLogin from '../../Services/ServicesLogin'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Login({ onSwitchToRegister }) {

  /* Las constantes, porque si no declaramos 20 useState al día nos da ansiedad */
  const [nombreU, SetNombreU] = useState('')
  const [contraseña, setContraseña] = useState('')
  const navigate = useNavigate()

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

      /*guardando los datos en laugh tale*/
      const grupo = user.grupos[0] // El primer grupo del usuario
      localStorage.setItem("grupo", JSON.stringify(grupo));

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
          navigate("/Trabajador/"+ user.id )
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

  return (
    <>
    <ToastContainer />
    <div className="login-container">

      <div className="login-left">
        <div className="login-content">
          <h2>Conecta con expertos</h2>
          <p>Disfruta de servicios profesionales cerca de ti</p>

          <ul className="login-features">
            <li>✓ Verificación de identidad</li>
            <li>✓ Calificaciones de usuarios</li>
          </ul>

          <button className="btn-register" onClick={onSwitchToRegister}>
            Registro
          </button>
        </div>
      </div>

      <div className="login-right">

        <div className="login-header">
          <img src="/logo.png" alt="ChambApp" />
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
              className="form-control"
            />
            <span className="input-icon">👤</span>
          </div>

          {/* InCon = ingresar contraseña */}
          <div className="form-group">
            <input
              type="password"
              id="InCon"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="form-control"
            />
            <span className="input-icon">🔒</span>
          </div>

          <a href="#" className="forgot-password">
            Forgot Password?
          </a>

          <button className="btn-login" onClick={verificarU}>
            Login
          </button>

          <p className="login-social">or login with social platforms</p>

          <div className="social-icons">
            <a href="#" className="social-icon fb">f</a>
            <a href="#" className="social-icon google">G</a>
            <a href="#" className="social-icon twitter">𝕏</a>
          </div>
        </div>

      </div>
    </div>
    </>
  )
}

export default Login
