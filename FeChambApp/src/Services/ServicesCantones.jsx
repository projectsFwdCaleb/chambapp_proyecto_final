async function getCanton() {
    
    try {
        
        const response = await fetch("http://localhost:8000/api/canton_provincia/",{
        method:'GET',
        headers : {
            'Content-Type': 'application/json'
        }
        })
        const canton = await response.json()
        
        return canton

    } catch (error) {
        console.error("Error al obtener el canton",error)
        throw error
    }
}




async function postCanton (consulta) {
    
    try {
        
        const response =await fetch("http://localhost:8000/api/canton_provincia/",{
        method:'POST',
        headers : {
            'Content-Type': 'application/json' },
        body:JSON.stringify(consulta)
        })
        const canton = await response.json()
        
        return canton

    } catch (error) {
        console.error("Error al guardar el canton",error)
        throw error
    }
}



async function deleteCanton (id) {
    
    try {
        
        const response =await fetch("http://localhost:8000/api/canton_provincia/"+ id,{
        method:'DELETE',
        headers : {
            'Content-Type': 'application/json'
        },
        })
        /* const products = await response.json()
        
        return products */
    } catch (error) {
        console.error("Error al eliminar el canton",error)
        throw error
    }
}


async function putCanton (id, consulta) {
    
    try {
        
        const response =await fetch("http://localhost:8000/api/canton_provincia/"+ id,{
        method:'PUT',
        headers : {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(consulta)
        })
        
    } catch (error) {
        console.error("Error al actualizar el canton",error)
        throw error
    }
}

export default {putCanton,deleteCanton,postCanton,getCanton}