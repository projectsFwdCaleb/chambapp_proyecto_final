import { authFetch, getAuthHeaders } from './authFetch';

const API_BASE = "http://localhost:8000";

async function getUsuarios() {
    try {
        const response = await fetch(`${API_BASE}/api/usuario/`, {
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
        const response = await fetch(`${API_BASE}/api/usuario/`, {
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
        // Usar authFetch para manejo automático de renovación de token
        const response = await authFetch(`/api/usuario/${id}`, {
            method: 'DELETE'
        })

        if (!response.ok) {
            throw new Error("Error al eliminar usuario")
        }

    } catch (error) {
        console.error("Error al eliminar los Usuarios", error)
        throw error
    }
}

async function putUsuarios(id, consulta) {
    try {
        // Siempre usar FormData - funciona para archivos Y texto
        // El backend ya soporta MultiPartParser
        const bodyToSend = new FormData();
        Object.keys(consulta).forEach(key => {
            // Solo agregar valores que no sean null/undefined
            if (consulta[key] !== null && consulta[key] !== undefined) {
                bodyToSend.append(key, consulta[key]);
            }
        });
        // No establecer Content-Type - el navegador lo hace automáticamente para FormData

        // Usar authFetch para manejo automático de renovación de token
        const response = await authFetch(`/api/usuario/${id}/`, {
            method: "PATCH",
            body: bodyToSend
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
