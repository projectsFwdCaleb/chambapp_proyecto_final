async function getPopulares() {
    // No se obtiene ni se usa el token, ya que no se necesita autenticación.
    
    try {
        const response = await fetch("http://localhost:8000/api/usuarios/populares/", {
            method: 'GET',
            headers: {
                // Solo se incluye la cabecera necesaria para el contenido.
                'Content-Type': 'application/json' 
            }
        });

        if (!response.ok) {
            // Manejo de errores estándar para cualquier problema que no sea 401
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const populares = await response.json();

        return { data: populares };

    } catch (error) {
        console.error("Error al obtener la respuesta de populares", error);
        throw error;
    }
}

async function getCercanos(limit = 10) {
    // Esta función mantiene la lógica de autenticación (Token/Bearer)
    const token = localStorage.getItem('access_token'); 
    const url = `http://localhost:8000/api/usuarios/cercanos/?limit=${limit}`;

    const resp = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });

    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Error ${resp.status}: ${text}`);
    }

    const data = await resp.json();
    return { data };
}

export default { getPopulares, getCercanos };