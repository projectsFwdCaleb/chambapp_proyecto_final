async function getGrupos() {
    
    try {
        
        const response = await fetch("¿?",{
        method:'GET',
        headers : {
            'Content-Type': 'application/json'
        }
        })
        const Grupos = await response.json()
        
        return Grupos

    } catch (error) {
        console.error("Error al obtener las Grupos",error)
        throw error
    }
}




async function postGrupos (consulta) {
    
    try {
        
        const response =await fetch("¿?",{
        method:'POST',
        headers : {
            'Content-Type': 'application/json' },
        body:JSON.stringify(consulta)
        })
        const Grupos = await response.json()
        
        return Grupos

    } catch (error) {
        console.error("Error al guardar las Grupos",error)
        throw error
    }
}



async function deleteGrupos (id) {
    
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
        console.error("Error al eliminar las Grupos",error)
        throw error
    }
}


async function putGrupos (id, consulta) {
    
    try {
        
        const response =await fetch("¿?/"+ id,{
        method:'PUT',
        headers : {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(consulta)
        })
        
    } catch (error) {
        console.error("Error al actualizar las Grupos",error)
        throw error
    }
}

export default {putGrupos,deleteGrupos,postGrupos,getGrupos}