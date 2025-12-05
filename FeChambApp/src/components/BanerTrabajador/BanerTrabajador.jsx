import React, { useState, useEffect } from "react";
import ServicesPortafolio from "../../Services/ServicesPortafolio";
import ServicesUsuarios from "../../Services/ServicesUsuarios";
import '../BanerTrabajador/BanerTrabajador.css'

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
      const data = await ServicesUsuarios.getUsuarios();
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
console.log(user);

  const usuarioConEstadistica =(
    user.find(u => u.id === userStats.trabajador_id)
  )
  console.log(usuarioConEstadistica);
  

    return (
        <div className="baner-container">


            <div>
              <img
                src={usuarioConEstadistica?.foto_perfil || "/default.png"}
                alt={usuarioConEstadistica?.username || "perfil"}
                
            />

            <h3 className="card-nombre">
                {usuarioConEstadistica?.first_name || "Usuario"}{" "}
                {usuarioConEstadistica?.last_name || ""}
            </h3>

            <p className="card-rating">
                ⭐ {userStats?.promedio ?? 0} / 5
            </p>

            <p className="services">
                {userStats?.servicios || ""}
            </p>

            <p className="card-servicios">
                Servicios completados: {userStats?.trabajos_completados ?? 0}
            </p>
          </div>

        </div>


    )
}

export default BanerTrabajador;

