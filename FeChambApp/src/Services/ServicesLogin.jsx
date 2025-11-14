async function postLogin (consulta) {
    
    try {
        const response =await fetch("http://localhost:8000/api/login/",{
        method:'POST',
        headers : {
            'Content-Type': 'application/json',
            },
            body:JSON.stringify(consulta)
        });

        if(!response.ok){
            throw new Error("Error al iniciar sesion :C")
        }
        const login = await response.json()
        return login

    } catch (error) {
        console.error("Error al guardar el Login",error)
        throw error
    }
}

async function getUserSession() {
  const token = localStorage.getItem("access_token");

  const response = await fetch("http://localhost:8000/auth/user/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener usuario en sesión");
  }

  return await response.json();
}

export default { postLogin, getUserSession };
