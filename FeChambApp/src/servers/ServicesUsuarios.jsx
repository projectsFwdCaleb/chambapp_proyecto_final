async function getUsuarios() {
    
    try {
        
        const response = await fetch("http://localhost:3001/Usuarios",{
        method:'GET',
        headers : {
            'Content-Type': 'application/json'
        }
        })
        const Usuarios = await response.json()
        
        return Usuarios

    } catch (error) {
        console.error("Error al obtener las Usuarios",error)
        throw error
    }
}




async function postUsuarios (consulta) {
    
    try {
        
        const response =await fetch("http://localhost:3001/Usuarios",{
        method:'POST',
        headers : {
            'Content-Type': 'application/json' },
        body:JSON.stringify(consulta)
        })
        const Usuarios = await response.json()
        
        return Usuarios

    } catch (error) {
        console.error("Error al guardar las Usuarios",error)
        throw error
    }
}



async function deleteUsuarios (id) {
    
    try {
        
        const response =await fetch("¿?"+ id,{
        method:'DELETE',
        headers : {
            'Content-Type': 'application/json'
        },
        })
        /* const products = await response.json()
        
        return products
 */
    } catch (error) {
        console.error("Error al eliminar las Usuarios",error)
        throw error
    }
}


async function putUsuarios (id, consulta) {
    
    try {
        
        const response =await fetch("¿?"+ id,{
        method:'PUT',
        headers : {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(consulta)
        })
        
    } catch (error) {
        console.error("Error al actualizar las Usuarios",error)
        throw error
    }
}

export default {putUsuarios,deleteUsuarios,postUsuarios,getUsuarios}