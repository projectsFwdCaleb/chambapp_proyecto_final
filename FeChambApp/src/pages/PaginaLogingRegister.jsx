import React, { useState } from 'react'
import './PaginaLogingRegister.css'
import Register from '../components/Register/Register'
import Login from '../components/Login/Login'
import Footer from '../components/Footer/Footer'

function PaginaLogingRegister() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {isLogin ? (
          <Login onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <Register onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}

export default PaginaLogingRegister
/* </> */