async function getSolicitud() {
    
    try {
        
        const response = await fetch("http://localhost:8000/api/solicitud/",{
        method:'GET',
        headers : {
            'Content-Type': 'application/json'
        }
        })
        const Solicitud = await response.json()
        
        return Solicitud

    } catch (error) {
        console.error("Error al obtener la Solicitud",error)
        throw error
    }
}




async function postSolicitud (consulta) {
    
    try {
        
        const response =await fetch("http://localhost:8000/api/solicitud/",{
        method:'POST',
        headers : {
            'Content-Type': 'application/json' },
        body:JSON.stringify(consulta)
        })
        const Solicitud = await response.json()
        
        return Solicitud

    } catch (error) {
        console.error("Error al guardar la Solicitud",error)
        throw error
    }
}



async function deleteSolicitud (id) {
    
    try {
        
        const response =await fetch("http://localhost:8000/api/solicitud/"+ id,{
        method:'DELETE',
        headers : {
            'Content-Type': 'application/json'
        },
        })
        
    } catch (error) {
        console.error("Error al eliminar la Solicitud",error)
        throw error
    }
}


async function putSolicitud (id, consulta) {
    
    try {
        
        const response =await fetch("http://localhost:8000/api/solicitud/"+ id,{
        method:'PUT',
        headers : {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(consulta)
        })
        
    } catch (error) {
        console.error("Error al actualizar la Solicitud",error)
        throw error
    }
}

export default {putSolicitud,deleteSolicitud,postSolicitud,getSolicitud}