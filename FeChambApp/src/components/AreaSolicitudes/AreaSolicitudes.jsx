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
    /*aqui manejamos el estado del modal (mostrar,editar y eliminar)*/
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [solicitudEditando, setSolicitudEditando] = useState(null);
    /*y esta constante es traer la in fomacion d elos usuarios(Muy nesesaria)*/
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
             
        } catch (error) {
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
     
        /*Obtener lista de cantones*/ 
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

        try {

            if (modoEdicion){
                await ServicesSolicitudes.putSolicitud(
                    solicitudEditando.id,
                    nuevaSolicitud
                )
            } else {
                await ServicesSolicitudes.postSolicitud(nuevaSolicitud)
            }
            /*tras completar la edicion o posteo cargamos las solicitudes */
            cargarSolicitudes();

            /*para que se vuelva a guardar vacio*/
            setNuevaSolicitud({
                titulo: "",
                descripcion:"",
                categoria: "",
                canton_provincia: "",
                usuario: user.id,
                estado: true
            })
            
            setModoEdicion(false);
            setSolicitudEditando(null);
            setMostrarModal(false)

        }catch(error){
           console.error("Error al crear la solicitud:", error)
        }
    }

    /*usaremos un modal para la edicion y posteo, en esta funcion 
    definimos que se abra en modo edicion*/
    const abrirModalEditar = (sol) => {
        setModoEdicion(true)
        setSolicitudEditando(sol)
        /*para setear los datos que editaremos*/
        setNuevaSolicitud({
            titulo: sol.titulo,
            descripcion: sol.descripcion,
            categoria: sol.categoria,
            canton_provincia: sol.canton_provincia,
            usuario: sol.usuario,
            estado: sol.estado
        })
        setMostrarModal(true);
    }

    /*Una funcion que se llamara para borrar solicitudes*/
    const eliminarSolicitud = async (id) => {
        const confirmar = window.confirm("¿Seguro que deseas eliminar esta solicitud?")
        if (!confirmar) return;

        try {
            await ServicesSolicitudes.deleteSolicitud(id)
            cargarSolicitudes()
        }catch (error) {
            console.error("Error al eliminar solicitud:", error);
        }
    }
    
    return (
        <div className="area-solicitudes-container">

            {/* El boton para abrir el modal de las solicitudes */}
            <button className="btn btn-success mb-3"
                onClick={()=> {
                    setModoEdicion(false)
                    setNuevaSolicitud({
                         titulo: "",
                        descripcion:"",
                        categoria: "",
                        canton_provincia: "",
                        usuario: user.id,
                        estado: true
                    })
                    setMostrarModal(true)
                    }}>
                Crear Solicitud
            </button>
            {/* Formulario/Modal */}
            {mostrarModal && (
                <div className='modal fade show d-block' tabIndex={"-1"}>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h1 className='modal-title'>{modoEdicion ? "Editar Solicitud":
                                "Nueva Solicitud"}</h1>
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

                                    <button type="submit" className="btn btn-primary w-100 mt-3">
                                        {modoEdicion ? "Guardar Cambios" : "Guardar Solicitud"}
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
                            <p>{sol.usuario}</p>
                            <strong>{sol.titulo}</strong>
                            <br />
                            {sol.descripcion}

                            {/*Botones para abrir modal y borrar solicitudes*/}
                            {sol.usuario === user.id && (
                                <div className='mt-2 d-flex gap-2'>
                                    <button className='btn btn-warning btn-sm'
                                    onClick={() => abrirModalEditar(sol)}
                                    >
                                        Editar
                                    </button>

                                    <button className='btn btn-danger btn-sm'
                                    onClick={()=> eliminarSolicitud(sol.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default AreaSolicitudes
