import React, { useState, useEffect } from 'react';

/* se trae la hoja de estilos */
import "../AreaSolicitudes/AreaSolicitudes.css";

/* se traen los Services */
import ServicesSolicitudes from "../../Services/ServicesSolicitudes";
import ServicesCategoria from '../../Services/ServicesCategoria';
import ServicesCantones from '../../Services/ServicesCantones';
import ServicesLogin from '../../Services/ServicesLogin';
import ServicesUsuarios from '../../Services/ServicesUsuarios';

function AreaSolicitudes() {

    /* la constante que tendrá las solicitudes */
    const [solicitud, setSolicitud] = useState([]);

    /* las constantes para traer cantones y categorías */
    const [categorias, setCategorias] = useState([]);
    const [cantones, setCantones] = useState([]);

    /* estados del modal (mostrar, editar, eliminar) */
    const [mostrarModalA, setMostrarModalA] = useState(false);
    const [mostrarModalB, setMostrarModalB] = useState(false);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [solicitudEditando, setSolicitudEditando] = useState(null);

    /* información del usuario */
    const [user, setUser] = useState("");
    const [usuarios, setUsuarios] = useState([]);

    /* constante para las nuevas solicitudes */
    const [nuevaSolicitud, setNuevaSolicitud] = useState({
        titulo: "",
        descripcion: "",
        categoria: "",
        canton_provincia: "",
        usuario: "",
        estado: true,
    });

    /* se cargan solicitudes, categorías, cantones y user */
    useEffect(() => {
        cargarSolicitudes();
        fetchCategorias();
        fetchCantones();
        fetchUser();
        fetchUsuarios()
    }, []);

    /*Para las nuevas solicitudes */
    useEffect(() => {
        if (user && user.id) {
            setNuevaSolicitud(prev => ({
                ...prev,
                usuario: user.id
            }));
        }
    }, [user]);

    /*Para evitar que se pueda mover la pagina al abrir el modadal,
     es por estilo y ya */
    useEffect(() => {
        if (mostrarModalA || mostrarModalB) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [mostrarModalA, mostrarModalB]);

    
    /*el fetch para traer los usuarios, es importante tenerlos
     para saber de quien es cada solicitud */
    const fetchUser = async () => {
        try {
            const data = await ServicesLogin.getUserSession();
            setUser(data);
        } catch (error) {
            console.error("Error al obtener usuario en sesión:", error);
        }
    };
    /*la funcion que carga las solicides en la pagia, 
    la llamaremos por ahi de la linea 165 y la 217 */
    const cargarSolicitudes = async () => {
        try {
            const resp = await ServicesSolicitudes.getSolicitudes();
            setSolicitud(resp);
        } catch (error) {
            console.error("Error al obtener las solicitudes:", error);
        }
    };
    /* Obtener lista de categorias */
    const fetchCategorias = async () => {
        try {
            const data = await ServicesCategoria.getCategoria();
            setCategorias(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Error al obtener categorias", error);
        }
    };

    /* Obtener lista de cantones */
    const fetchCantones = async () => {
        try {
            const data = await ServicesCantones.getCanton();
            setCantones(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Error al obtener cantones", error);
        }
    };

    /*esto trae los usuario en general(principalmente para usar el id)*/
    const fetchUsuarios = async () => {
        try {
            const data = await ServicesUsuarios.getUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al obtener usuario en sesión:", error);
        }
    };

    /*traer los nombres de usuario de la base (asi se sabre quien esta pidiendo) */
    const getNombreUsuarios = (usuarioId) => {
    if (!usuarioId) return 'Sin nombre especificado';

    const uNombre = usuarios.find(us => us.id === usuarioId);
    return uNombre ? uNombre.username : 'nombre no disponible';
    };

    /*para traer las imagenes de perfil de la base
    (cuantos goku habra una ves que pongamos esto en lienea)*/
    const getFotoUsuario = (usuarioId) => {
    const usuario = usuarios.find(u => u.id === usuarioId);

    if (usuario && usuario.foto_perfil) {
        return usuario.foto_perfil;  
    }

     /*Imagen por defecto si no tienen foto de perfil, pero si van a tener que poner para ser
     travajadores*/
    return "/default.png"; 
    };


    /* manejar cambios */
    const Datos = (e) => {
        const { name, value } = e.target;

        setNuevaSolicitud(prev => ({
            ...prev,
            [name]: value
        }));
    };
    /*La constante/funcion se llama ENVIAR.....no creo que tenga que explicar que hace en el componete
    que te deja hacer solicitudes y ENVIARLAS a la base*/
    const enviar = async (e) => {
        e.preventDefault();
        /*tecnicamente nucan deveria entrar un usuario sin estar logeado por 
        el ajuste en privateRoute...pero dejo esto aqui por si acaso*/
        if (!nuevaSolicitud.usuario) {
            console.error("El usuario aún no está cargado");
            return;
        }

        try {
            /*vienbenido al modo edicion, aqui te dejamos arreglar
            los horores ortograficos que hiciste en tu solicitud*/
            if (modoEdicion) {
                await ServicesSolicitudes.putSolicitud(
                    solicitudEditando.id,
                    nuevaSolicitud
                );
            } else {
                await ServicesSolicitudes.postSolicitud(nuevaSolicitud);
            }

            /*llamar a la funcion para cargar las solicitudes */ 
            cargarSolicitudes();

            /*limpiar el area para la siguientes solicitudes */ 
            setNuevaSolicitud({
                titulo: "",
                descripcion: "",
                categoria: "",
                canton_provincia: "",
                usuario: user.id,
                estado: true
            });
            /*poniendo falsos para que nada se active asntes de tiempo */
            setModoEdicion(false);
            setSolicitudEditando(null);
            setMostrarModalA(false);
            setMostrarModalB(false);

        } catch (error) {
            console.error("Error al crear la solicitud:", error);
        }
    };

    /* abrir modal en modo edición */
    const abrirModalEditar = (sol) => {
        setModoEdicion(true);
        setSolicitudEditando(sol);

        setNuevaSolicitud({
            titulo: sol.titulo,
            descripcion: sol.descripcion,
            categoria: sol.categoria,
            canton_provincia: sol.canton_provincia,
            usuario: sol.usuario,
            estado: sol.estado
        });

        setMostrarModalA(true);
    };

    /* abrir el modal B */
    const abrirModalB = (sol) => {
    setSolicitudSeleccionada(sol);
    setMostrarModalB(true);
    };

    /* borrar solicitud */
    const eliminarSolicitud = async (id) => {
        const confirmar = window.confirm("¿Seguro que deseas eliminar esta solicitud?");
        if (!confirmar) return;

        try {
            await ServicesSolicitudes.deleteSolicitud(id);
            cargarSolicitudes();
        } catch (error) {
            console.error("Error al eliminar solicitud:", error);
        }
    };

    return (
        <div className="area-solicitudes-container">

            {/* Botón para abrir modal */}
            <button
                className="btn btn-success mb-3"
                onClick={() => {
                    setModoEdicion(false);
                    setNuevaSolicitud({
                        titulo: "",
                        descripcion: "",
                        categoria: "",
                        canton_provincia: "",
                        usuario: user.id,
                        estado: true
                    });
                    setMostrarModalA(true);
                }}
            >
                Crear Solicitud
            </button>

            {/* ModalA */}
            {mostrarModalA && (
                <div className='modal fade show d-block' tabIndex="-1">
                    <div className='modal-dialog'>
                        <div className='modal-content modal-custom'>

                            <div className='modal-header'>
                                <h1 className='modal-title'>
                                    {modoEdicion ? "Editar Solicitud" : "Nueva Solicitud"}
                                </h1>

                                <button
                                    type='button'
                                    className='btn-close'
                                    onClick={() => setMostrarModalA(false)}
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
                                        className="form-control mb-2"
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {categorias.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.nombre}
                                            </option>
                                        ))}
                                    </select>

                                    <label className="form-label">Cantón</label>
                                    <select
                                        name="canton_provincia"
                                        value={nuevaSolicitud.canton_provincia}
                                        onChange={Datos}
                                        required
                                        className="form-control mb-2"
                                    >
                                        <option value="">Selecciona un cantón</option>
                                        {cantones.map(can => (
                                            <option key={can.id} value={can.id}>
                                                {can.nombre}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 mt-3"
                                    >
                                        {modoEdicion ? "Guardar Cambios" : "Guardar Solicitud"}
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            <hr />

            {/* Lista de solicitudes */}
            <h2>Solicitudes Registradas</h2>

            {solicitud.length === 0 ? (
                <p>No hay solicitudes en estos momentos.</p>
            ) : (
                <ul className="lista-solicitudes row">
                    {solicitud.map(sol => (
                        <li key={sol.id} className="solicitud-item col-md-4">
                            <div 
                                className="card shadow-sm p-3 solicitud-card"
                                onClick={() => abrirModalB(sol)}
                                style={{ cursor: "pointer" }} 
                            >

                                {/* el cuerpo de las solicitudes  */}
                                <div className="d-flex align-items-center gap-3 mb-3">

                                    {/* la imagen de perfil */}
                                    <img
                                        src={getFotoUsuario(sol.usuario)}
                                        alt={getNombreUsuarios(sol.usuario)}
                                        className="img-perfil-card"
                                    />

                                    {/* Nombre de usuario y título de la solicitud */}
                                    <div>
                                        <h6 className="m-0 fw-bold">
                                            {getNombreUsuarios(sol.usuario)}
                                        </h6>
                                        <p className="text-muted m-0 small">
                                            {sol.titulo}
                                        </p>
                                    </div>
                                </div>

                                {/* Botones del dueño */}
                                {sol.usuario === user.id && (
                                    <div className='mt-3 d-flex gap-2'>
                                        <button 
                                            className='btn btn-warning btn-sm w-50'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                abrirModalEditar(sol);
                                            }}
                                        >
                                            Editar
                                        </button>

                                        <button 
                                            className='btn btn-danger btn-sm w-50'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                eliminarSolicitud(sol.id);
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal B (fuera del map — AHORA SOLO SE RENDERIZA UNA VEZ) */}
            {mostrarModalB && solicitudSeleccionada && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content modal-custom">

                            <div className="modal-header">
                                <h1 className="modal-title">
                                    Detalle de Solicitud
                                </h1>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => setMostrarModalB(false)}
                                ></button>
                            </div>

                            <div className="modal-body">

                                {/* la foto y nombre */}
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <img
                                        src={getFotoUsuario(solicitudSeleccionada.usuario)}
                                        className="img-perfil-card"
                                        alt="perfil"
                                    />
                                    <div>
                                        <h1 className="m-0 fw-bold">
                                            {getNombreUsuarios(solicitudSeleccionada.usuario)}
                                        </h1>
                                        <p className="text-muted m-0">
                                            {solicitudSeleccionada.titulo}
                                        </p>
                                    </div>
                                </div>

                                {/* Información completa */}
                                <p><strong>Descripción:</strong></p>
                                <p>{solicitudSeleccionada.descripcion}</p>

                                <p><strong>Categoría:</strong> {
                                    categorias.find(c => c.id === solicitudSeleccionada.categoria)?.nombre
                                    || "No disponible"
                                }</p>

                                <p><strong>Cantón:</strong> {
                                    cantones.find(c => c.id === solicitudSeleccionada.canton_provincia)?.nombre
                                    || "No disponible"
                                }</p>

                            </div>

                            <div className="modal-footer">
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => setMostrarModalB(false)}
                                >
                                    Cerrar
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AreaSolicitudes;
