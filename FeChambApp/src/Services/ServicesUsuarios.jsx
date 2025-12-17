function getAuthHeaders() {
    const token = localStorage.getItem("access_token");

    return {
        "Authorization": token ? `Bearer ${token}` : ""
    };
}

async function getUsuarios() {

    try {

        const response = await fetch("http://localhost:8000/api/usuario/", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const Usuarios = await response.json()

        return Usuarios

    } catch (error) {
        console.error("Error al obtener los Usuarios", error)
        throw error
    }
}




async function postUsuarios(consulta) {

    try {

        const response = await fetch("http://localhost:8000/api/usuario/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(consulta)
        })
        const Usuarios = await response.json()

        return Usuarios

    } catch (error) {
        console.error("Error al guardar los Usuarios", error)
        throw error
    }
}



async function deleteUsuarios(id) {

    try {

        const response = await fetch("http://localhost:8000/api/usuario/" + id, {
            method: 'DELETE',
            headers: getAuthHeaders()
        })
        /* const products = await response.json()
        
        return products
 */
    } catch (error) {
        console.error("Error al eliminar los Usuarios", error)
        throw error
    }
}


async function putUsuarios(id, bodyToSend) {
    try {
        const headers = {
            ...getAuthHeaders()
            // ❌ NO Content-Type
        };

        const response = await fetch(`http://localhost:8000/api/usuario/${id}/`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(bodyToSend)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text);
        }

        return await response.json();

    } catch (error) {
        console.error("Error al actualizar los Usuarios", error);
        throw error;
    }
}

export default { putUsuarios, deleteUsuarios, postUsuarios, getUsuarios }