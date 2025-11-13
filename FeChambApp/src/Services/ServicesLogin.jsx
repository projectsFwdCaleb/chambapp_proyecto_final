async function postLogin (consulta) {
    
    try {
        const response =await fetch("http://localhost:8000/api/login/",{
        method:'POST',
        headers : {
            'Content-Type': 'application/json',
            headers: 'Bearer $(token)'
            },
            body:JSON.stringify(consulta)
        })
        const Login = await response.json()
        
        return await response.json()

    } catch (error) {
        console.error("Error al guardar el Login",error)
        throw error
    }
}
export default {postLogin}
