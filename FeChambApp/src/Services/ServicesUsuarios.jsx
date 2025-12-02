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
            headers: {
                'Content-Type': 'application/json'
            },
        })
        /* const products = await response.json()
        
        return products
 */
    } catch (error) {
        console.error("Error al eliminar los Usuarios", error)
        throw error
    }
}


async function putUsuarios(id, consulta) {
    try {
        let bodyToSend;
        let headers = {};

        // Si viene un archivo ⇒ usar FormData
        if (consulta.foto_perfil instanceof File) {
            bodyToSend = new FormData();
            Object.keys(consulta).forEach(key => {
                bodyToSend.append(key, consulta[key]);
            });
        }
        // Si NO viene archivo ⇒ JSON normal
        else {
            headers['Content-Type'] = 'application/json';
            bodyToSend = JSON.stringify(consulta);
        }

        const response = await fetch(`http://localhost:8000/api/usuario/${id}/`, {
            method: "PATCH",
            headers,
            body: bodyToSend
        });

        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Server returned non-JSON:", text);
            throw new Error("Server error: " + text.substring(0, 100));
        }
    } catch (error) {
        console.error("Error al actualizar los Usuarios", error);
        throw error;
    }
}

export default { putUsuarios, deleteUsuarios, postUsuarios, getUsuarios }