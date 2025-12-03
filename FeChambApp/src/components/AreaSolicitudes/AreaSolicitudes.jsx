import React, {useState,useEffect}from 'react'
/*se trae la hoja de estilos*/
import "../AreaSolicitudes/AreaSolicitudes.css"
/*se trae los services*/
import ServicesSolicitudes from "../../Services/ServicesSolicitudes"
import ServicesCategoria from '../../Services/ServicesCategoria';
import ServicesCantones from '../../Services/ServicesCantones';
import ServicesLogin from '../../Services/ServicesLogin';
import { Prev } from 'react-bootstrap/esm/PageItem';
function AreaSolicitudes() {
    /*la constante que tendra las solicitudes*/
    const [solicitud , setSolicitud ]=useState([]);
    /*las constante para traer los cantones y categorias*/
    const [categorias, setCategorias] = useState([]);
    const [cantones, setCantones] = useState([]);
    /*aqui manejamos el estado del modal*/
    const [mostrarModal, setMostrarModal] = useState(false);
    const [user, setUser]  = useState("");
    /*constante para las nuevas solicitudes */
    const [nuevaSolicitud, setNuevaSolicitud] = useState({
        titulo: "",
        descripcion:"",
        categoria: "",
        canton_provincia: "",
        usuario: "",
        estado: true
        })
    
    /*este useEffect cargara las funciones necesarias al entrar a la pagina
    (solicitudes,categorias,provincias y usuarios) */
     useEffect(() => {
        cargarSolicitudes();
        fetchCategorias()
        fetchCantones()
        fetchUser()
     },[])

     useEffect(() => {
        if (user && user.id) {
        setNuevaSolicitud(prev => ({
            ...prev,
            usuario: user.id
        }));
         }
    }, [user]);

     const fetchUser = async () => {
           try {
             const data = await ServicesLogin.getUserSession();
             
             setUser(data);
             
           } catch (err) {
             console.error("Error al obtener usuario en sesión:", err);
           }
         };


     const cargarSolicitudes = async () =>{
        try {
            const resp = await ServicesSolicitudes.getSolicitud();
            setSolicitud(resp);
            }catch (error){
                console.error("Error al obtener las solicitudes:", error);
            }
        }

     const fetchCategorias = async () => {
         try {
           const data = await ServicesCategoria.getCategoria();
           setCategorias(Array.isArray(data) ? data : data.results || []);
         } catch (error) {
           console.error("Error al obtener categorias", error);
         }
       };
     
       // Obtener lista de cantones
       const fetchCantones = async () => {
         try {
           const data = await ServicesCantones.getCanton();
           setCantones(Array.isArray(data) ? data : data.results || []);
         } catch (error) {
           console.error("Error al obtener cantones", error);
         }
       };   

     /*aqui manejamos el cambio */
    const Datos = (e) => {
        const{name, value} = e.target;
        setNuevaSolicitud((prev) => ({
            ...prev,
            [name]:value,
        }))
    }

    const enviar = async (e) => {
        e.preventDefault()

        if (!nuevaSolicitud.usuario) {
        console.error("El usuario aún no está cargado");
        return;
        }

        try{
            
            await ServicesSolicitudes.postSolicitud(nuevaSolicitud)

            /*para que se vuelva a guardar vacio*/
            setNuevaSolicitud({
                titulo: "",
                descripcion:"",
                categoria: "",
                canton_provincia: "",
                usuario: user.id,
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
            <button className="btn btn-success mb-3"
                onClick={()=> setMostrarModal(true)}>
                Crear Solicitud
            </button>
            {/* Formulario/Modal */}
            {mostrarModal && (
                <div className='modal fade show d-block' tabIndex={"-1"}>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h1 className='modal-title'>Nueva Solicitud</h1>
                                <button type='button'
                                className='btn-close'
                                onClick={()=> setMostrarModal(false)}
                                ></button>
                            </div>
                            <div className='modal-body'>
                                <form onSubmit={enviar}>
                                    <input
                                        type="text"
                                        name="titulo"
                                        placeholder="Título"
                                        value={nuevaSolicitud.titulo}
                                        onChange={Datos}
                                        className="form-control mb-2"
                                        required
                                    />

                                    <textarea
                                        name="descripcion"
                                        placeholder="Descripción"
                                        value={nuevaSolicitud.descripcion}
                                        onChange={Datos}
                                        className="form-control mb-2"
                                        required
                                    />

                                    <label className="form-label">Categoría</label>
                                    <select
                                        name="categoria"
                                        value={nuevaSolicitud.categoria}
                                        onChange={Datos}
                                        required
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                        ))}
                                    </select>

                                    <label className="form-label">Cantón</label>
                                    <select
                                        name="canton_provincia"
                                        value={nuevaSolicitud.canton_provincia}
                                        onChange={Datos}
                                        required
                                    >
                                    <option value="">Selecciona un cantón</option>
                                        {cantones.map(can => (
                                            <option key={can.id} value={can.id}>{can.nombre}</option>
                                        ))} 
                                    </select>

                                    <button type="submit" className="btn btn-primary w-100">
                                        Guardar Solicitud
                                    </button> {/* comienso de de la bajada */}
                                </form> {/* ya vamos en cammino */}
                            </div> {/* 4 divides segudis :( */}
                        </div> 
                    </div> {/* esto es demaciado */}
                </div>  
            )} {/* solo un poco mas..... */}
            {/* Aqui termina el modal y si que fue un lago camino */}
           
            <hr />

            {/* Lista de solisitudes hechas */}
            <h2>Solicitudes Registradas</h2>

            {solicitud.length === 0 ? (
                <p>No hay solicitudes en estos momentos.</p>
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
