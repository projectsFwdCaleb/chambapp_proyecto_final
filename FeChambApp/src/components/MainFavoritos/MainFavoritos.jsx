import React, { useState, useEffect } from 'react';
import ServicesFav from '../../Services/ServicesFav';
import './MainFavoritos.css';
import ServicesUsuarios from '../../Services/ServicesUsuarios';
import ServicesServicio from '../../Services/ServicesServicio';
// import ServicesLogin from '../../Services/ServicesLogin'; // Removed
import BoosiMan from '../../assets/BoosiMan.webp';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../Context/UserContext';

function MainFavoritos() {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [usuarios, setUsuarios] = useState([]) // Renamed from user to avoid conflict
    // const [userInSession, setUserInSession] = useState([]) // Removed
    const { user: userInSession } = useUser();
    const [services, SetServices] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        // fetchUserInSession() // Removed
        fetchUsuarios()
        fetchFavoritos()
        fetchServices()
    }, []);

    /* Removed fetchUserInSession
    const fetchUserInSession = async () => {
            try {
              const data = await ServicesLogin.getUserSession();
              setUserInSession(data);
            } catch (err) {
              console.error("Error al obtener usuario en sesión:", err);
            }
          };
    */

    const fetchServices = async () => {
        const response = await ServicesServicio.getServicio();
        const data = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
                ? response
                : [];
        SetServices(data)
    }

    const fetchUsuarios = async () => {
        const response = await ServicesUsuarios.getUsuarios();
        const data = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
                ? response
                : [];
        setUsuarios(data)
    }

    const fetchFavoritos = async () => {
        setLoading(true);
        try {
            const response = await ServicesFav.getFavoritos();
            const data = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response)
                    ? response
                    : [];
            setFavoritos(data)
            console.log(favoritos);

        } catch (error) {
            console.error("Error cargando favoritos:", error);
            setFavoritos([]);
        } finally {
            setLoading(false);
        }
    };



    const agregarServiciosATrabajadores = (trabajadores, services) => {
        return trabajadores.map(trabajador => {
            // servicios que pertenece a este trabajador
            const serviciosTrabajador = services.filter(
                serv => serv.trabajador === trabajador
            );
            console.log(serviciosTrabajador);

            return {
                ...trabajador,
                servicios: serviciosTrabajador
            };
        });
    };

    const favoritosDelUsuario = favoritos.filter(f => f.usuario === userInSession?.id);
    const favoritosIDs = favoritosDelUsuario.map(f => f.trabajador);
    const trabajadoresSinServicio = usuarios.filter(u => favoritosIDs.includes(u.id));
    const trabajadores = agregarServiciosATrabajadores(trabajadoresSinServicio, services);
    console.log(trabajadores);



    const handleContactButton = (id) => {
        navigate(`/trabajador/${id}`);
    }

    const handleDeleteButton = async (trabajadorId) => {
        try {
            const favorito = favoritos.find(f => f.trabajador === trabajadorId);

            if (!favorito) {
                console.warn("No se encontró el favorito");
                return;
            }

            await ServicesFav.deleteFavorito(favorito.id);

            // actualizar lista
            fetchFavoritos();
        } catch (error) {
            console.error("Error eliminando favorito:", error);
        }
    };

    return (
        <div className="categoria-filtrado-container">
            <h2>Mis Favoritos</h2>
            <div className="trabajadores-grid">
                {loading ? (
                    <p>Cargando favoritos...</p>
                ) : trabajadores.length > 0 ? (
                    trabajadores.map((trabajador) => (
                        <div key={trabajador.id} className="trabajador-card">
                            <div className="card-header">
                                <button onClick={() => handleDeleteButton(trabajador.id)}><h3>X</h3></button>
                                <div className="card-avatar-container">
                                    <img
                                        src={trabajador.foto_perfil || BoosiMan}
                                        alt={`${trabajador.first_name || 'Usuario'} ${trabajador.last_name || ''}`}
                                        className="card-avatar"
                                    />
                                </div>
                            </div>

                            <div className="card-body">
                                <h3 className="card-name">
                                    {trabajador.first_name || "Usuario"} {trabajador.last_name || ""}
                                </h3>

                                <p className="card-profession">
                                    {trabajador.servicios && trabajador.servicios.length > 0
                                        ? trabajador.servicios.map((s) => s.nombre_servicio).join(', ')
                                        : "Sin servicios registrados"}
                                </p>

                                <div className="card-stats">
                                    <div className="stat-item">
                                        <span>⭐ {trabajador.promedio ?? 0}</span>
                                    </div>
                                </div>

                                <p className="card-price">
                                    ₡ {
                                        trabajador.servicios?.length > 0
                                            ? Math.min(...trabajador.servicios.map(s => Number(s.precio_referencial))).toLocaleString()
                                            : "A convenir"
                                    }
                                </p>

                                <button
                                    className="btn-save"
                                    onClick={() => handleContactButton(trabajador.id)}>
                                    Contactar
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No tienes trabajadores favoritos aún.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MainFavoritos;