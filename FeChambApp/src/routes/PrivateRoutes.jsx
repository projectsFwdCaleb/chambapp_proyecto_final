import {Navigate} from "react-router-dom"
import React from 'react'

function PrivateRoutes({ children, allowedRoles }) {
  const token = localStorage.getItem("access_token");
  const grupos = JSON.parse(localStorage.getItem("grupos"));

    if(!token ) {
        return <Navigate to="/Loging" replace />;
    }

     if (allowedRoles && !grupos.some(g => allowedRoles.includes(g))) {
    return <Navigate to="/" replace />;
  }


  return children;

}

export default PrivateRoutes
