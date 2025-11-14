const API_URL = "http://localhost:8000/api/servicio/";

async function getServicio(search = "", page = 1) {
  try {
    // Construimos la URL dinámicamente con los parámetros opcionales
    let url = `${API_URL}?page=${page}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

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
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    const response = await fetch(`${API_URL}${id}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Error al eliminar servicio");
  } catch (error) {
    console.error("Error al eliminar el servicio:", error);
    throw error;
  }
}

async function putServicio(id, consulta) {
  try {
    const response = await fetch(`${API_URL}${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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