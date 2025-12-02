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

async function getTrabajadoresPorCategoria(categoria_id, filtros = {}) {
    try {
        const params = new URLSearchParams();

        // Añadir filtros solo si existen
        if (filtros.canton) params.append("canton", filtros.canton);
        if (filtros.min) params.append("min", filtros.min);
        if (filtros.max) params.append("max", filtros.max);
        if (filtros.ordenar) params.append("ordenar", filtros.ordenar);

        const url = `http://localhost:8000/api/trabajadores/categoria/${categoria_id}/?${params.toString()}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return { data };

    } catch (error) {
        console.error("Error al obtener trabajadores por categoría", error);
        throw error;
    }
}

export default { getPopulares, getCercanos, getTrabajadoresPorCategoria };