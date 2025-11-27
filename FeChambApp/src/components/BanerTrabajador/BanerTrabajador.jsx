import React, { useState, useEffect } from 'react'
import ServicesPortafolio from '../../Services/ServicesPortafolio'
import BoosiMan from '../../assets/BoosiMan.webp'


/*El parametro id viene de la pagina en la cual pondremos el componente*/
function BanerTrabajador({ id }) {
    const [userStats, setUserStats] = useState(null);


    useEffect(() => {
        const fetchEstadisticas = async () => {
            try {
                const resp = await ServicesPortafolio.getEstadisticas(id);

                console.log(resp);


                const data = resp && typeof resp === "object" ? resp : null;

                console.log(data);


                setUserStats(data);

            } catch (error) {
                console.error("Error cargando El Portafolio:", error);
            }
        };

        console.log(userStats);
        console.log(typeof userStats);


        if (id) fetchEstadisticas();
        /*si se cambia el id de la pagina, el ponerlo como parametro useEfect hara que se recargue*/
    }, [id]);
    if (!userStats) {
        return <p>Cargando...</p>;
    }

    return (
        <div>
            <div>
                <img
                    src={BoosiMan}
                    alt="perfil"
                    className="card-img"
                />
                <h3 className="card-nombre">
                    {userStats?.Usuario?.first_name || "Usuario"} {userStats?.Usuario?.last_name || ""}
                </h3>
                <p className="card-rating">
                    ⭐ {userStats.promedio ?? 0} / 5
                </p>
                <h3>
                    {userStats.servicios ?? 0}
                </h3>

            </div>
        </div>
    )
}

export default BanerTrabajador
