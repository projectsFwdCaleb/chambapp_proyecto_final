async function getFavoritos() {
    // Esta función mantiene la lógica de autenticación (Token/Bearer)
    const token = localStorage.getItem('access_token');

    try {
        const response = await fetch("http://localhost:8000/api/favorito/", {
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

export default {getFavoritos }