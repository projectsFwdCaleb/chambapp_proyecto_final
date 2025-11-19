import React, { useState,useEffect  } from 'react'
import ServicesPortafolio from '../../Services/ServicesPortafolio'

function BanerTrabajador() {
    const [userStats, setUserStats]=useState(null); 
    
    useEffect(()=>{ 
        const fetchEstadisticas = async() =>{
            try{
                const resp = await ServicesPortafolio.getEstadisticas();

                 const data = (resp && typeof resp === "object") ? resp : null;

                 setUserStats(data);
            } catch (error) {
                console.error("Error cargando El Portafolio:", error);
            }
        };

        fetchEstadisticas();
    },[]);
    if (!userStats) {
        return <p>Cargando...</p>;
    }

  return (
    <div>
        <div>
            <img
                src={userStats.Usuario.foto_perfil || "/default-profile.png"}
                alt="perfil"
                className="card-img"
            />    
            <h3 className="card-nombre">
                {userStats.Usuario.first_name} {userStats.Usuario.last_name}
            </h3>     
            <p className="card-rating">
                ⭐ {userStats.promedio ?? 0 } / 5
            </p>
            <h3>
                {userStats.servicios ?? 0}
            </h3>
        </div>
    </div>
  )
}

export default BanerTrabajador
