async function getPopulares() {
  try {
    const response = await fetch("http://localhost:8000/api/usuarios/populares/", {
      method:'GET',
      headers : {
          'Content-Type': 'application/json'
      }
    });
    
    const populares = await response.json();

    return { data: populares };  // <<< AQUÍ EL FIX

  } catch (error) {
    console.error("Error al obtener la respuesta", error);
    throw error;
  }
}

async function getCercanos(limit = 10) {
  const token = localStorage.getItem('token'); // ajusta clave si usas otra
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
  // para consistencia con getPopulares (si en tu app devuelves {data: [...]})
  return { data };
}

export default { getPopulares, getCercanos};