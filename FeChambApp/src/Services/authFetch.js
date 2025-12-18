/**
 * authFetch: Fetch inteligente con renovación automática de tokens
 * 
 * FLUJO:
 * 1. Intenta la petición con el access_token actual
 * 2. Si responde 401 (Unauthorized):
 *    a. Llama a /api/login/refresh/ con el refresh_token
 *    b. Guarda los nuevos tokens en localStorage
 *    c. Reintenta la petición original con el nuevo access_token
 * 3. Si el refresh también falla → Limpia tokens y lanza error
 */

const API_BASE = "http://localhost:8000";

// Variable para evitar múltiples refreshes simultáneos
let isRefreshing = false;
let refreshPromise = null;

/**
 * Renueva el access token usando el refresh token
 * @returns {Promise<string>} El nuevo access token
 */
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
        throw new Error("No hay refresh token disponible");
    }

    const response = await fetch(`${API_BASE}/api/login/refresh/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken })
    });

    if (!response.ok) {
        // El refresh token también expiró o es inválido
        clearTokens();
        throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
    }

    const tokens = await response.json();

    // Guardar los nuevos tokens
    localStorage.setItem('access_token', tokens.access);
    if (tokens.refresh) {
        // El backend está configurado con ROTATE_REFRESH_TOKENS=True
        // así que recibimos un nuevo refresh token también
        localStorage.setItem('refresh_token', tokens.refresh);
    }

    console.log(" Token renovado exitosamente");
    return tokens.access;
}

/**
 * Limpia los tokens del localStorage
 */
function clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('grupo');
}

/**
 * Obtiene los headers de autorización
 * @returns {Object} Headers con el token Bearer
 */
function getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

/**
 * Fetch con manejo automático de renovación de tokens
 * @param {string} url - URL completa o path relativo (ej: "/api/user/")
 * @param {Object} options - Opciones de fetch (method, body, headers, etc.)
 * @returns {Promise<Response>} Respuesta del fetch
 */
async function authFetch(url, options = {}) {
    // Construir URL completa si es path relativo
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

    // Agregar headers de autorización
    const headers = {
        ...options.headers,
        ...getAuthHeaders()
    };

    // Primera petición
    let response = await fetch(fullUrl, { ...options, headers });

    // Si no es 401, retornar la respuesta directamente
    if (response.status !== 401) {
        return response;
    }

    // Es 401: Intentar renovar el token
    console.log("Token expirado, intentando renovar...");

    try {
        // Evitar múltiples refreshes simultáneos
        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshAccessToken();
        }

        await refreshPromise;
        isRefreshing = false;

        // Reintentar la petición original con el nuevo token
        const newHeaders = {
            ...options.headers,
            ...getAuthHeaders()
        };

        response = await fetch(fullUrl, { ...options, headers: newHeaders });
        return response;

    } catch (error) {
        isRefreshing = false;
        console.error("No se pudo renovar el token:", error.message);

        // Disparar evento para que el contexto de usuario maneje el logout
        window.dispatchEvent(new CustomEvent('session-expired'));

        throw error;
    }
}

export { authFetch, refreshAccessToken, clearTokens, getAuthHeaders };
export default authFetch;
