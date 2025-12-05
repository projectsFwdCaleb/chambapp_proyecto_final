const API_URL = "http://localhost:8000/api/solicitud/";

// ============================
// Obtener headers con token
// ============================
function getAuthHeaders() {
    const token = localStorage.getItem("access_token");

    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
}

// ============================
// GET: Obtener todas las solicitudes
// ============================
async function getSolicitud() {    
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error("Error al obtener las solicitudes");

        return await response.json();

    } catch (error) {
        console.error("Error al obtener la Solicitud", error);
        throw error;
    }
}

// ============================
// POST: Crear una solicitud
// ============================
async function postSolicitud(consulta) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(consulta)
        });

        if (!response.ok) throw new Error("Error al crear la solicitud");

        return await response.json();

    } catch (error) {
        console.error("Error al guardar la Solicitud", error);
        throw error;
    }
}

// ============================
// DELETE: Eliminar una solicitud
// ============================
async function deleteSolicitud(id) {
    try {
        const response = await fetch(API_URL + id, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error("Error al eliminar la solicitud");

        return true;

    } catch (error) {
        console.error("Error al eliminar la Solicitud", error);
        throw error;
    }
}

// ============================
// PATCH: Actualizar una solicitud
// ============================
async function putSolicitud(id, consulta) {
    try {
        const response = await fetch(API_URL + id, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(consulta)
        });

        if (!response.ok) throw new Error("Error al actualizar la solicitud");

        return await response.json();

    } catch (error) {
        console.error("Error al actualizar la Solicitud", error);
        throw error;
    }
}


export default { getSolicitud, postSolicitud, deleteSolicitud, putSolicitud };
