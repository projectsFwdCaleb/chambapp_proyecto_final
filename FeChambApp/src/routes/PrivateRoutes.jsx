import {Navigate} from "react-router-dom"
import React from 'react'

function PrivateRoutes({ children, allowedRoles }) {
  const grupo = JSON.parse(localStorage.getItem("grupo"))

    if(!grupo ) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(grupo)) {
    return <Navigate to="/" replace />;
  }

  return children;

}

export default PrivateRoutes
