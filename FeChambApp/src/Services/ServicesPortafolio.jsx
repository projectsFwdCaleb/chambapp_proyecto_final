async function getPortafolio() {
    try {
        const response = await fetch(`http://localhost:8000/api/portafolio/`, {
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await response.json();

    } catch (error) {
        console.error("Error al obtener el Portafolio", error);
        throw error;
    }
}

async function getEstadisticas(id) {
    try {
        const response = await fetch(`http://localhost:8000/api/estadisticas/trabajador/${id}`, {
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

            const data = await response.json();
            return data;

    } catch (error) {
        console.error("Error al obtener las Estadisticas", error);
        throw error;
    }
}

async function postPortafolio(consulta) {
    try {
        const response = await fetch('http://localhost:8000/api/portafolio/', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(consulta)
        });

        return await response.json();

    } catch (error) {
        console.error("Error al guardar el Portafolio", error);
        throw error;
    }
}

async function deletePortafolio(id) {
    try {
        await fetch(`http://localhost:8000/api/portafolio/${id}`, {
            method:'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error("Error al eliminar el Portafolio", error);
        throw error;
    }
}

async function putPortafolio(id, consulta) {
    try {
        await fetch(`http://localhost:8000/api/portafolio/${id}`, {
            method:'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(consulta)
        });

    } catch (error) {
        console.error("Error al actualizar el Portafolio", error);
        throw error;
    }
}

export default {putPortafolio,deletePortafolio,postPortafolio,getPortafolio,getEstadisticas};
