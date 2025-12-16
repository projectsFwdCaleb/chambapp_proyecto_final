const API_URL = "http://localhost:8000/api/servicio/";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : ""
  };
}

async function getServicio(search = "", page = 1) {
  try {
    let url = `${API_URL}?page=${page}`;

    // Refactorizando para ser más limpio:
    // Si 'search' es un objeto, lo usamos como filtros. Si es string, es búsqueda de texto.
    let queryParams = new URLSearchParams();
    queryParams.append('page', page);

    if (typeof search === 'string' && search) {
      queryParams.append('search', search);
    } else if (typeof search === 'object' && search) {
      Object.keys(search).forEach(key => {
        if (search[key] !== null && search[key] !== undefined) {
          queryParams.append(key, search[key]);
        }
      });
    }

    url = `${API_URL}?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error al obtener servicios");
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error al obtener los servicios:", error);
    throw error;
  }
}

async function postServicio(consulta) {
  console.log(consulta);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(consulta),
    });

    if (!response.ok) throw new Error("Error al crear servicio");
    return await response.json();
  } catch (error) {
    console.error("Error al guardar el servicio:", error);
    throw error;
  }
}

async function deleteServicio(id) {
  try {
    const response = await fetch(`${API_URL}${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Error al eliminar servicio");
  } catch (error) {
    console.error("Error al eliminar el servicio:", error);
    throw error;
  }
}

async function putServicio(id, consulta) {
  try {
    const response = await fetch(`${API_URL}${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(consulta),
    });

    if (!response.ok) throw new Error("Error al actualizar servicio");
    return await response.json();
  } catch (error) {
    console.error("Error al actualizar el servicio:", error);
    throw error;
  }
}

export default { getServicio, postServicio, deleteServicio, putServicio };