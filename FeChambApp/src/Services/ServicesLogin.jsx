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
export default {postLogin}
