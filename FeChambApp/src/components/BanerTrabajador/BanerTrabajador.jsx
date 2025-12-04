import React, { useState, useEffect } from "react";
import ServicesPortafolio from "../../Services/ServicesPortafolio";
import ServicesLogin from "../../Services/ServicesLogin";

function BanerTrabajador({ id }) {
  const [userStats, setUserStats] = useState(null);
  const [user, setUser] = useState(null);

  /* llamar las estadísticas */
  const fetchEstadisticas = async () => {
    try {
      const resp = await ServicesPortafolio.getEstadisticas(id);
      setUserStats(resp || null);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

  /* llamar a los usuarios */
  const fetchUser = async () => {
    try {
      const data = await ServicesLogin.getUserSession();
      setUser(data || null);
    } catch (err) {
      console.error("Error al obtener usuario en sesión:", err);
    }
  };

  /* El useEffect que llamara las funciones/constantes */
  useEffect(() => {
    if (!id) return;
    fetchEstadisticas();
    fetchUser();
  }, [id]);

  /* Para que de un mensaje de cargando, es solo un detallito */
  if (!userStats || !user) {
    return <p>Cargando...</p>;
  }

    return (
        <div className="baner-container">
            <img
                src={user?.foto_perfil || "/default.png"}
                alt={user?.username || "perfil"}
                className="baner-img"
            />

            <h3 className="card-nombre">
                {userStats?.Usuario?.first_name || "Usuario"}{" "}
                {userStats?.Usuario?.last_name || ""}
            </h3>

            <p className="card-rating">
                ⭐ {userStats?.promedio ?? 0} / 5
            </p>

            <p className="card-servicios">
                Servicios completados: {userStats?.servicios ?? 0}
            </p>
        </div>
    );
}

export default BanerTrabajador;

