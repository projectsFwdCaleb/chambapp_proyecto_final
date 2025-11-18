import React, { useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import ServicesLogin from '../../Services/ServicesLogin'

function Login({ onSwitchToRegister }) {

  /* Las constantes, porque si no declaramos 20 useState al día nos da ansiedad */
  const [nombreU, SetNombreU] = useState('')
  const [contraseña, setContraseña] = useState('')
  const navigate = useNavigate()

  const verificarU = async () => {

    /* Aquí hacemos la magia del login */
    try {
      const credentials = {
        username: nombreU,
        password: contraseña
      }

      const response = await ServicesLogin.postLogin(credentials)

      /* Guardando tokens como si fueran tesoros del dragón Smaug */
      localStorage.setItem('access_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)
      
      /*trallendo los datos de usuario por contrabando dese la base */
      const user = await ServicesLogin.getUserSession()

      /*guardando los datos en laugh tale*/
      localStorage.setItem("grupo", JSON.stringify(user.grupos[0]));

      console.log("Login exitoso :)")
      navigate("/")

    } catch (error) {
      console.error("Error al del Login:", error)
    }
  }

  return (
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
  )
}

export default Login
