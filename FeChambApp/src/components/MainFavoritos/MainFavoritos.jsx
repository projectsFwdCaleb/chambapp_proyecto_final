import React, { useState, useEffect } from 'react';
import ServicesTop from '../../Services/ServicesTop';
import './MainFavoritos.css';
import BoosiMan from '../../assets/BoosiMan.webp';
import { useNavigate } from 'react-router-dom';

function MainFavoritos() {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavoritos = async () => {
            setLoading(true);
            try {
                const response = await ServicesTop.getFavoritos();
                if (response && response.data) {
                    setFavoritos(response.data);
                } else {
                    setFavoritos([]);
                }
            } catch (error) {
                console.error("Error cargando favoritos:", error);
                setFavoritos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoritos();
    }, []);

    const handleContactButton = (id) => {
        navigate(`/trabajador/${id}`);
    }

    return (
        <div className="categoria-filtrado-container">
            <h2>Mis Favoritos</h2>
            <div className="trabajadores-grid">
                {loading ? (
                    <p>Cargando favoritos...</p>
                ) : favoritos.length > 0 ? (
                    favoritos.map((trabajador) => (
                        <div key={trabajador.id} className="trabajador-card">
                            <div className="card-header">
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
                                        ? trabajador.servicios.map((s) => s.nombre).join(', ')
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
                                    className="card-button"
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
