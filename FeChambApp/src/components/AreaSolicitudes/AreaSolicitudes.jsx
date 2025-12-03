import React, {useState,useEffect}from 'react'
/*se trae la hoja de estilos*/
import "../AreaSolicitudes/AreaSolicitudes.css"
/*se trae el services*/
import ServicesSolicitudes from "../../Services/ServicesSolicitudes"
function AreaSolicitudes({usuarioId}) {
    /*la constante que tendra las solicitudes*/
    const [solicitud , setSolicitud ]=useState([]);
    /*aqui manejamos el estado del modal*/
    const [mostrarModal, setMostrarModal] = useState(false);
    /*constante para las nuevas solicitudes */
    const [nuevaSolicitud, setNuevaSolicitud] = useState({
        titulo: "",
        descripcion:"",
        latitud: "",
        longitud: "",
        usuario: usuarioId,
        estado: true

    })
    /*este useEffect cargara las solicitudes al entrar a la pagina */
     useEffect(() => {
        cargarSolicitudes();
     },[])

     const cargarSolicitudes = async () =>{
        try {
            const resp = await ServicesSolicitudes.getSolicitud();
            setSolicitud(resp);
            }catch (error){
                console.error("Error al obtener las solicitudes:", error);
            }
        }

        /*aqui manejamos el cambio */
    const Datos = (e) => {
        setNuevaSolicitud({
            ...nuevaSolicitud,
            [e.Target.name]: e.target.value,
        })
    }

    const enviar = async (e) => {
        e.preventDefault()

        try{
            await ServicesSolicitudes.postSolicitud(nuevaSolicitud)
            /*para que se vuelva a guardar vacio*/
            setNuevaSolicitud({
                titulo: "",
                descripcion:"",
                latitud: "",
                longitud: "",
                usuario: usuarioId,
                estado: true
            })
            cargarSolicitudes();
            /*tras completar una solicitud steamos falso pafra serrar el modal*/
            setMostrarModal(false);
        }catch(error){
           console.error("Error al crear la solicitud:", error)
        }
    }


  return (
<div className="area-solicitudes-container">

            
            {/* El boton para abrir el modal donde van las solicitudes */}
            <button class name="btn btn-success mb-3"
                onClick={()=> setMostrarModal(true)}>
                Crear Solicitud
            </button>
            {/* Formulario/Modal */}
            {mostrarModal && (
                g
            )}

            <form onSubmit={enviar} className="form-solicitud">
                <input
                    type="text"
                    name="titulo"
                    placeholder="Título"
                    value={formData.titulo}
                    onChange={Datos}
                    className="form-control mb-2"
                    required
                />

                <textarea
                    name="descripcion"
                    placeholder="Descripción"
                    value={formData.descripcion}
                    onChange={Datos}
                    className="form-control mb-2"
                    required
                />

                <input
                    type="number"
                    name="latitud"
                    placeholder="Latitud"
                    value={formData.latitud}
                    onChange={Datos}
                    className="form-control mb-2"
                />

                <input
                    type="number"
                    name="longitud"
                    placeholder="Longitud"
                    value={formData.longitud}
                    onChange={Datos}
                    className="form-control mb-2"
                />

                <button type="submit" className="btn btn-primary w-100">
                    Guardar Solicitud
                </button>
            </form>

            <hr />

            {/* LISTA DE SOLICITUDES */}
            <h2>Solicitudes Registradas</h2>

            {solicitud.length === 0 ? (
                <p>No hay solicitudes aún.</p>
            ) : (
                <ul className="lista-solicitudes">
                    {solicitud.map((sol) => (
                        <li key={sol.id} className="solicitud-item">
                            <strong>{sol.titulo}</strong>
                            <br />
                            {sol.descripcion}
                        </li>
                    ))}
                </ul>
            )}

        </div>
  )
}

export default AreaSolicitudes
