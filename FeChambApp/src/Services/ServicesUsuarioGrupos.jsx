function getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
}

async function getUsuarioGrupos() {

    try {

        const response = await fetch("http://localhost:8000/api/usuario_group/", {
            method: 'GET',
            headers: getAuthHeaders()
        })
        const Grupos = await response.json()

        return Grupos

    } catch (error) {
        console.error("Error al obtener las Grupos", error)
        throw error
    }
}




async function postUsuarioGrupos(consulta) {

    try {

        const response = await fetch("http://localhost:8000/api/usuario_group/", {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(consulta)
        })
        const Grupos = await response.json()

        return Grupos

    } catch (error) {
        console.error("Error al guardar las Grupos", error)
        throw error
    }
}



async function deleteUsuarioGrupos(id) {

    try {

        const response = await fetch("http://localhost:8000/api/usuario_group/" + id, {
            method: 'DELETE',
            headers: getAuthHeaders()
        })
        /* const products = await response.json()
        
        return products
 
 */
    } catch (error) {
        console.error("Error al eliminar las Grupos", error)
        throw error
    }
}


async function putUsuarioGrupos(id, consulta) {

    try {

        const response = await fetch(`http://localhost:8000/api/usuario_group/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(consulta)
        })

    } catch (error) {
        console.error("Error al actualizar las Grupos", error)
        throw error
    }
}

export default {
    putUsuarioGrupos, deleteUsuarioGrupos, postUsuarioGrupos, getUsuarioGrupos

}