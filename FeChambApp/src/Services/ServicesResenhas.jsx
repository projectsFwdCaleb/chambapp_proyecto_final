const API_URL = "http://localhost:8000/api/resenha/";

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
// GET: Obtener todas las resenhaes
// ============================
async function getResenha() {    
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error("Error al obtener las resenhaes");

        return await response.json();

    } catch (error) {
        console.error("Error al obtener la resenha", error);
        throw error;
    }
}

async function getResenhaByTrabajador(trabajadorId) {
    try {
        const response = await fetch(`http://localhost:8000/api/resenhas/trabajador/${trabajadorId}/`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error("Error al obtener reseñas del trabajador");

        return await response.json(); // { resenhas: [], promedio: 4.3, total: 10 }

    } catch (error) {
        console.error("Error cargando reseñas:", error);
        throw error;
    }
}

// ============================
// POST: Crear una resenha
// ============================
async function postResenha(consulta) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(consulta)
        });

        if (!response.ok) throw new Error("Error al crear la resenha");

        return await response.json();

    } catch (error) {
        console.error("Error al guardar la resenha", error);
        throw error;
    }
}

// ============================
// DELETE: Eliminar una resenha
// ============================
async function deleteResenha(id) {
    try {
        const response = await fetch(API_URL + id, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error("Error al eliminar la resenha");

        return true;

    } catch (error) {
        console.error("Error al eliminar la resenha", error);
        throw error;
    }
}

// ============================
// PATCH: Actualizar una resenha
// ============================
async function putResenha(id, consulta) {
    try {
        const response = await fetch(API_URL + id, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(consulta)
        });

        if (!response.ok) throw new Error("Error al actualizar la resenha");

        return await response.json();

    } catch (error) {
        console.error("Error al actualizar la resenha", error);
        throw error;
    }
}


export default { getResenha, postResenha, deleteResenha, putResenha, getResenhaByTrabajador };
