const API_URL = "http://localhost:8000/api/categoria/";

function getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
}

async function getCategoria() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener la Categoria", error);
        throw error;
    }
}

async function postCategoria(consulta) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(consulta)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al guardar el Categoria", error);
        throw error;
    }
}

async function deleteCategoria(id) {
    try {
        const response = await fetch(API_URL + id, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return true;
    } catch (error) {
        console.error("Error al eliminar el Categoria", error);
        throw error;
    }
}

async function putCategoria(id, consulta) {
    try {
        const response = await fetch(API_URL + id, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(consulta)
        });
        return await response.json();
    } catch (error) {
        console.error("Error al actualizar el Categoria", error);
        throw error;
    }
}

export default { putCategoria, deleteCategoria, postCategoria, getCategoria };