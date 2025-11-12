async function getServicio() {
    
    try {
        
        const response = await fetch("¿?",{
        method:'GET',
        headers : {
            'Content-Type': 'application/json'
        }
        })
        const Servicio = await response.json()
        
        return Servicio

    } catch (error) {
        console.error("Error al obtener las Servicio",error)
        throw error
    }
}




async function postServicio (consulta) {
    
    try {
        
        const response =await fetch("¿?",{
        method:'POST',
        headers : {
            'Content-Type': 'application/json' },
        body:JSON.stringify(consulta)
        })
        const Servicio = await response.json()
        
        return Servicio

    } catch (error) {
        console.error("Error al guardar las Servicio",error)
        throw error
    }
}



async function deleteServicio (id) {
    
    try {
        
        const response =await fetch("¿?/"+ id,{
        method:'DELETE',
        headers : {
            'Content-Type': 'application/json'
        },
        })
        /* const products = await response.json()
        
        return products
 */
    } catch (error) {
        console.error("Error al eliminar las Servicio",error)
        throw error
    }
}


async function putServicio (id, consulta) {
    
    try {
        
        const response =await fetch("¿?/"+ id,{
        method:'PUT',
        headers : {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(consulta)
        })
        
    } catch (error) {
        console.error("Error al actualizar las Servicio",error)
        throw error
    }
}

export default {putServicio,deleteServicio,postServicio,getServicio}