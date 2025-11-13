async function getCategoria() {
    
    try {
        
        const response = await fetch("http://localhost:8000/api/categoria/",{
        method:'GET',
        headers : {
            'Content-Type': 'application/json'
        }
        })
        const Categoria = await response.json()
        
        return Categoria

    } catch (error) {
        console.error("Error al obtener el Categoria",error)
        throw error
    }
}




async function postCategoria (consulta) {
    
    try {
        
        const response =await fetch("http://localhost:8000/api/categoria/",{
        method:'POST',
        headers : {
            'Content-Type': 'application/json' },
        body:JSON.stringify(consulta)
        })
        const Categoria = await response.json()
        
        return Categoria

    } catch (error) {
        console.error("Error al guardar el Categoria",error)
        throw error
    }
}



async function deleteCategoria (id) {
    
    try {
        
        const response =await fetch("http://localhost:8000/api/categoria/"+ id,{
        method:'DELETE',
        headers : {
            'Content-Type': 'application/json'
        },
        })
        /* const products = await response.json()
        
        return products */
    } catch (error) {
        console.error("Error al eliminar el Categoria",error)
        throw error
    }
}


async function putCategoria (id, consulta) {
    
    try {
        
        const response =await fetch("http://localhost:8000/api/categoria/"+ id,{
        method:'PUT',
        headers : {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(consulta)
        })
        
    } catch (error) {
        console.error("Error al actualizar el Categoria",error)
        throw error
    }
}

export default {putCategoria,deleteCategoria,postCategoria,getCategoria}