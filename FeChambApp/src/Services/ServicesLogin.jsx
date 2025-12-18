import { authFetch, refreshAccessToken, clearTokens } from './authFetch';

async function postLogin(consulta) {
  try {
    const response = await fetch("http://localhost:8000/api/login/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consulta)
    });

    if (!response.ok) {
      throw new Error("Error al iniciar sesion :C")
    }
    const login = await response.json()
    return login

  } catch (error) {
    console.error("Error al guardar el Login", error)
    throw error
  }
}

/**
 * Obtiene el usuario en sesión actual
 * Usa authFetch para renovar automáticamente el token si expira
 */
async function getUserSession() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No hay token de acceso");
  }

  // authFetch maneja automáticamente la renovación del token si es necesario
  const response = await authFetch("/api/user/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener usuario en sesión");
  }

  return await response.json();
}

export default { postLogin, getUserSession, refreshAccessToken, clearTokens };

