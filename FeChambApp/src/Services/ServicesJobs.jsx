const API_URL = "http://localhost:8000/api/job-suggestions/";

function getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
}

async function getJobSuggestions(query) {
    try {
        const url = `${API_URL}?query=${encodeURIComponent(query)}`;
        const response = await fetch(url, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error("Error al obtener sugerencias de empleo");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener sugerencias:", error);
        throw error;
    }
}

export default { getJobSuggestions };
