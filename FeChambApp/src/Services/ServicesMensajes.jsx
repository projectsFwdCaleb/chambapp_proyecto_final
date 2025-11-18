const API = "http://localhost:8000/api";

function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access_token")
    };
}

async function getConversaciones(usuarioId) {
    const res = await fetch(`${API}/mensajes/conversaciones/${usuarioId}/`, {
        method: "GET",
        headers: authHeaders()
    });
    return await res.json();
}

async function getMensajes(usuario1Id, usuario2Id) {
    const res = await fetch(`${API}/mensajes/entre/${usuario1Id}/${usuario2Id}/`, {
        method: "GET",
        headers: authHeaders()
    });
    return await res.json();
}

async function enviarMensaje(payload) {
    const res = await fetch(`${API}/mensaje/`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload)
    });
    return await res.json();
}

export default { getConversaciones, getMensajes, enviarMensaje };
