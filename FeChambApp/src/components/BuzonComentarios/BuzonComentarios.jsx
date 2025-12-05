import React, { useState, useEffect, useRef } from 'react'
import '../BuzonComentarios/BuzonComentarios.css'
import ServicesComentarios from '../../services/ServicesComentarios';
import { useNavigate } from "react-router-dom";
import ReactStars from "react-stars";

function BuzonComentario() {
  const [Comentarios, setComentarios] = useState([])
  const [NuevoComentario, setNuevoComentario] = useState("")
  const [usuarios, setUsuarios] = useState([])
  const [usuarioElegido, setUsuarioElegido] = useState("");
  const [calificacion, setCalificacion] = useState(0);

  const navegar = useNavigate()
  
const animacionRef = useRef(null)
const isInView = useInView(animacionRef, { once: true, margin: "-100px" }) 
// margin es para que se active un poco antes de estar en encima

  useEffect(() => {
    const traerComentarios = async () => {
      const datosC = await ServicesComentarios.getComentarios()
      setComentarios(datosC)
    }

    const traerTours = async () => {
      const datosT = await ServicesTours.getTours()
      setUsuarios(datosT) //setear tours
    }

    traerComentarios()
    traerTours()
  }, [])


// funcion para caulcular calificacion dek tour
const actualizarCalificacionTour = async (tourId, nuevaCalificacion, comentariosActuales, toursActuales) => {
  const comentariosTour = comentariosActuales
    .filter(c =>String(c.tour) ===String(tourId))
    .map(c => Number(c.calificacion)); // OJO number suma, string concatena, siempre poner numer para las sumas

  const todasLasCalificaciones = [...comentariosTour, nuevaCalificacion];
  const suma = todasLasCalificaciones.reduce((acc, curr) => acc + curr, 0); //acumulador de calfi. + califi. axctual
  const nuevoPromedio = suma / todasLasCalificaciones.length;

  const tourAActualizar = toursActuales.find(t =>String(t.id) ===String(tourId));

  if (tourAActualizar) {
    const tourActualizado = {
      ...tourAActualizar,
      calificacion: nuevoPromedio.toFixed(1) + "/5" // añadir /5 despues de la calificacion
    };
    await ServicesTours.putTour(tourActualizado, tourId); //actualizar
    return tourActualizado;
  }

  return null;
};

// funcion para caulcular calificacion delk pyme
const actualizarCalificacionPyme = async (pymeId, toursActualizados) => {
  const toursDePyme = toursActualizados.filter(t =>String(t.pymeId) ===String(pymeId));

  if (toursDePyme.length > 0) {
    const calificacionesDeTours = toursDePyme.map(t =>
      parseFloat(String(t.calificacion).split('/')[0]) //convertir a texto y quitar el /5
    );

    const sumaCalificaciones = calificacionesDeTours.reduce((acc, curr) => acc + curr, 0);
    const nuevoPromedioPyme = sumaCalificaciones / calificacionesDeTours.length;

    const pymeData = await ServicesPymes.getPymes();
    const pymeAActualizar = pymeData.find(p =>String(p.id) ===String(pymeId));

    if (pymeAActualizar) {
      const pymeActualizada = {
        ...pymeAActualizar,
        calificacion: nuevoPromedioPyme.toFixed(1) + "/5" // añadir /5 despues de la calificacion
      };
      await ServicesPymes.putPymes(pymeActualizada, pymeId); // actualizar
    }
  }
};

  // función para buscar el nombre del tour por id
  const obtenerNombreTour = (id) => {
    const tour = usurios.find((t) =>String(t.id) ===String(id))
    return tour ? tour.nombre : "Tour no encontrado"
  }

  //función para guardar comentarios
  const guardarComentario = async () =>{
    const fechaActual = new Date();
    if (!usuarioEnSesion) {
        const result = await Swal.fire({
        title: "Inicie sesion",
        text: "Necesita iniciar sesion para agregar comentarios",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ir a Iniciar Sesión",
        cancelButtonText: "Cancelar"
        });
        if (result.isConfirmed) {
            navegar("/SessionManager")
        } return
    }else if (!NuevoComentario.trim()) {  // Validar comentario vacío
    Swal.fire("Error", "Ingrese un comentario válido", "error");
    return;
  }

    if (!usuarioElegido) { // Validar selección de tour
        Swal.fire("Error", "Seleccione un tour", "error");
        return;
    }

    if (calificacion === 0) {
      Swal.fire("Error", "Debe seleccionar una calificación", "error");
      return;
    }
        const opinion = {
        usuario: usuarioEnSesion.Nombre,
        contenido: NuevoComentario,
        fecha: fechaActual.toLocaleString(),
        tour:String(usuarioElegido),
        calificacion: String(calificacion)
    };

    
    
      //guardar el nuevo comentario en la base de datos
      const savedOpinion = await ServicesComentarios.postComentarios(opinion);

      //obtener ids necesarios
      const tourId = String(usuarioElegido);
      const tourOriginal = usurios.find(t => String(t.id) === tourId);
      const pymeId = tourOriginal ? tourOriginal.pymeId : null;

      // actualizar calificación del tour
      const updatedTour = await actualizarCalificacionTour(
        tourId,
        calificacion,
        Comentarios,
        usurios
      );

      // actualizar calificación de la pyme
      if (pymeId && updatedTour) {
        const nuevosTours = usurios.map(t =>
          String(t.id) === tourId ? updatedTour : t
        );
        await actualizarCalificacionPyme(pymeId, nuevosTours);
        setUsuarios(nuevosTours);
      }

      //Actualizar estado de comentarios y limpiar formulario
      setComentarios([...Comentarios, savedOpinion]);
      setNuevoComentario("");
      setUsuarioElegido("");
      setCalificacion(0);

      Swal.fire("¡Listo!", "Comentario agregado y calificaciones actualizadas.", "success");
      }

      // función para eliminar comentario
      const eliminarComentario = async (id) => {
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: "Eliminarás tu comentario permanentemente",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
          try {
            await ServicesComentarios.deleteComentarios(id);
            setComentarios(Comentarios.filter(c => c.id !== id));
            Swal.fire("Eliminado", "Tu comentario ha sido eliminado", "success");
          } catch (error) {
            Swal.fire("Error", "No se pudo eliminar el comentario", "error");
          }
        }
      };
  
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  return (
      <div className="container mt-4">
         <motion.div
                ref={animacionRef}
                className="animacion"
                initial={{ opacity: 0, x: -100 }}  // empieza oculto y desplazado a la izquierda
                animate={isInView ? { opacity: 1, x: 0 } : {}} // cuando entra en vista, aparece
                transition={{ duration: 0.8, ease: "easeOut" }} // suavidad
              >
                <h1>Experiencias de viajeros</h1>
              </motion.div>

        <div className="row">
          {Comentarios.map((comentario) => (
            <div key={comentario.id} className="col-md-4 col-sm-6 mb-4">
             <div className="comentario_card">
                <h3 className="comentario_titulo">{comentario.usuario}</h3>
                <p className="comentario_desc">{comentario.contenido}</p>
                <p className="comentario_desc">
                  <strong>Tour: </strong>{obtenerNombreTour(comentario.tour)}
                </p>
                <p className="comentario_desc">Calificación 🌟{comentario.calificacion}</p>

                {/* Botón solo si el comentario es del usuario logueado */}
                {usuarioEnSesion && comentario.usuario === usuarioEnSesion.Nombre && (
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => eliminarComentario(comentario.id)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="buzon_form">
              <h3>Deja tu comentario</h3>
              <input
                className="form-control mb-3"
                type="text"
                placeholder="Escribe tu comentario..."
                value={NuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
              />
              <select
                className="form-select mb-3"
                value={usuarioElegido}
                onChange={(e) => setUsuarioElegido(e.target.value)}
              >
                <option value="">Selecciona un tour</option>
                {usurios.map((tour) => (
                  <option key={tour.id} value={tour.id}>
                    {tour.nombre}
                  </option>
                ))}
              </select>

              <div className="mb-3 d-flex align-items-center">
                <span className="me-2">Tu calificación:</span>
                <ReactStars
                  count={5}
                  value={calificacion}
                  onChange={(newRating) => setCalificacion(newRating)}
                  size={30}
                  activeColor="#ffd700"
                />
              </div>

              <button
                onClick={guardarComentario}
                className="btn-standard btn btn-primary"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>


  )
}

export default BuzonComentario
