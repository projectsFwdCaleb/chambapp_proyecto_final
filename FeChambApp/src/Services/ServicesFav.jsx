const API_URL = "http://localhost:8000/api/favorito/";

async function getFavoritos() {
    // Esta función mantiene la lógica de autenticación (Token/Bearer)
    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        });

        if (!response.ok) {
            // Manejo de errores estándar para cualquier problema que no sea 401
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const favoritos = await response.json();

        return { data: favoritos };

    } catch (error) {
        console.error("Error al obtener la respuesta de favoritos", error);
        throw error;
    }
}

async function postFavorito(consulta) {
  console.log(consulta);
  
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(consulta),
    });

    if (!response.ok) throw new Error("Error al crear Favorito");
    return await response.json();
  } catch (error) {
    console.error("Error al guardar el Favorito:", error);
    throw error;
  }
}

async function deleteFavorito(id) {
  try {
    const response = await fetch(`${API_URL}${id}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Error al eliminar Favorito");
  } catch (error) {
    console.error("Error al eliminar el Favorito:", error);
    throw error;
  }
}

export default {getFavoritos, postFavorito, deleteFavorito}