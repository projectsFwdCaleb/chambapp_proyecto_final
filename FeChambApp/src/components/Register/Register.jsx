import React, { useState } from 'react'
import './Register.css'
import { useNavigate } from "react-router-dom";
import ServicesUsuarios from '../../Services/ServicesUsuarios'
import ServicesLogin from '../../Services/ServicesLogin';

function Register({ onSwitchToLogin }) {

  /*Las constantes, porque llevamos 5 meses haciendo constantes y no 
  pareses que vallamos a parar en algun momento  */
  const [username, Setusername] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setpassword] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const navigate = useNavigate()

  const ManejarRegistros = async () => {

    /* borrar los mensajes de error y exito anteriores (no queremos que se acumulen) */
    setError('')
    setExito('')

    /* para que no puedan registrarse con campos en blanco (minimo que los inventen) */
    if (!username || !correo || !password) {
      setError('No has llenado todos los campos, regresa y llenalos')
      return
    }

    /* asegurarse que las passwords tengan mas de 8 carateres(Porque sera el minimo siempre es 8?) */
    if (password.length < 8) {
      setError('La password debe tener un minimo de 8 caracteres (y trata de no olvidarla).')
      return
    }

    try {
      const nuevoUsuario = {
        username: username,
        email: correo,
        password: password,
      }

      const respuesta = await ServicesUsuarios.postUsuarios(nuevoUsuario)

      if (respuesta && respuesta.id) {

        /*Aqui la funcionalidad Especial, un [AUTOLOGIN]  */
        setExito("Usuario registrado correctamente. Iniciado sesion.....;)")
        const credentials = { username, password }

        /*Y para esto importamos el servicios Login */
        const loginResponse = await ServicesLogin.postLogin(credentials)

        /*Usaremos estas dos lineas para guardar los tokens en el local storage*/
        localStorage.setItem('access_token', loginResponse.access)
        localStorage.setItem('refresh_token', loginResponse.refresh)

        navigate('/')

      } else if (respuesta?.username) {
        setError("Ese nombre de usuario ya está en uso.")
      } else if (respuesta?.email) {
        setError("Ese correo ya está registrado.")
      } else {
        setError("No se pudo registrar el usuario.")
      }

    } catch (error) {
      console.error('Error al registrar:', error)
      setError('Error al conectar con el servidor.')
    }
  }

  return (
    <div className="register-container">

      {/* Left side - Blue section */}
      <div className="register-left">
        <div className="register-content">
          <h2>Únete a nosotros</h2>
          <p>Crea tu cuenta para conectar con expertos</p>
          <ul className="register-features">
            <li>✓ Acceso completo a servicios</li>
            <li>✓ Comunidad profesional</li>
            <li>✓ Soporte 24/7</li>
          </ul>
          <button className="btn-login-switch" onClick={onSwitchToLogin}>
            ¿Ya tienes cuenta? Login
          </button>
        </div>
      </div>

      {/* Right side - Gray section with form */}
      <div className="register-right">
        <div className="register-header">
          <img src="/logo.png" alt="ChambApp" />
          <h2>Registro</h2>
        </div>

        <div className="register-form">

          <div className="form-group">
            <input
              type="text"
              id="inNombre"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => Setusername(e.target.value)}
              className="form-control"
            />
            <span className="input-icon">👤</span>
          </div>

          <div className="form-group">
            <input
              type="email"
              id="inCorreo"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="form-control"
            />
            <span className="input-icon">✉️</span>
          </div>

          <div className="form-group">
            <input
              type="password"
              id="inpassword"
              placeholder="Contraseña (mín. 8 caracteres)"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="form-control"
            />
            <span className="input-icon">🔒</span>
          </div>

          <button className="btn-register-submit" onClick={ManejarRegistros}>
            Registrar
          </button>

          {error && <p className="error-message">{error}</p>}
          {exito && <p className="success-message">{exito}</p>}
        </div>
      </div>
    </div>
  )
}

export default Register
