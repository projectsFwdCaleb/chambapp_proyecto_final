import { Navigate } from "react-router-dom"
import React from 'react'
/*private routes, donde validamos si puedes proseguir o si te tiramos al login*/
function PrivateRoutes({ children, allowedRoles }) {
  const token = localStorage.getItem("access_token");
  const grupoStr = localStorage.getItem("grupo");
  let grupos = [];
  try {
    const parsed = JSON.parse(grupoStr);
    grupos = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
  } catch (error) {
    console.error("Error parsing grupo:", error);
    grupos = [];
  }
  /*Validacion de usuario*/
  if (!token) {
    return <Navigate to="/Loging" replace />;
  }
  /*Y la Validacion de grupos*/
  if (allowedRoles && !grupos.some(g => allowedRoles.includes(g))) {
    return <Navigate to="/" replace />;
  }

  /*si pasaste las validaciones el usuario es libre de proseguir...
  ..Por ahora*/
  return children;

}

export default PrivateRoutes
