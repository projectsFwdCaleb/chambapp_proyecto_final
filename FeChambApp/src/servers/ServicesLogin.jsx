async function getLogin() {
    
    try {
        
        const response = await fetch("http://localhost:3001/api/login/",{
        method:'GET',
        headers : {
            'Content-Type': 'application/json'
        }
        })
        const Login = await response.json()
        
        return Login

    } catch (error) {
        console.error("Error al obtener el Login",error)
        throw error
    }
}




async function postLogin (consulta) {
    
    try {
        
        const response =await fetch("http://localhost:3001/api/login/",{
        method:'POST',
        headers : {
            'Content-Type': 'application/json' },
        body:JSON.stringify(consulta)
        })
        const Login = await response.json()
        
        return Login

    } catch (error) {
        console.error("Error al guardar el Login",error)
        throw error
    }
}



async function deleteLogin (id) {
    
    try {
        
        const response =await fetch("http://localhost:3001/api/login/"+ id,{
        method:'DELETE',
        headers : {
            'Content-Type': 'application/json'
        },
        })
        /* const products = await response.json()
        
        return products
 */
    } catch (error) {
        console.error("Error al eliminar el Login",error)
        throw error
    }
}


async function putLogin (id, consulta) {
    
    try {
        
        const response =await fetch("http://localhost:3001/api/login/"+ id,{
        method:'PUT',
        headers : {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(consulta)
        })
        
    } catch (error) {
        console.error("Error al actualizar el Login",error)
        throw error
    }
}

export default {putLogin,deleteLogin,postLogin,getLogin}