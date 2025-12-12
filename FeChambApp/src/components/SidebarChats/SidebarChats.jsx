import React, { useState, useEffect, useRef } from "react";
import { ArrowLeftCircle, MessageSquare } from "lucide-react";
import ServicesMensajes from "../../Services/ServicesMensajes";
import "./SidebarChats.css";
// import ServicesLogin from "../../Services/ServicesLogin"; // Removed
import { useUser } from '../../../Context/UserContext';

function SidebarChats() {
  const [conversaciones, setConversaciones] = useState([]);
  const [chatAbierto, setChatAbierto] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const mensajesEndRef = useRef(null);
  // const [user, setUser] = useState(null); // Removed local state
  const { user } = useUser(); // Use hook

  // Helper para hacer scroll al último mensaje
  const scrollToBottom = () => {
    if (mensajesEndRef.current) {
      mensajesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  /* Removed fetchUser
  /* Obtener usuario en sesión usando el token */
  /*
  useEffect(() => {
      const fetchUser = async () => {
        try {
          const data = await ServicesLogin.getUserSession();
          setUser(data);
        } catch (err) {
          console.error("Error al obtener usuario en sesión:", err);
        }
      };
    fetchUser();
  }, []);
  */


  // Cargar conversaciones al montar o cuando cambie usuario
  useEffect(() => {
    if (!user?.id) return;

    const fetchConversaciones = async () => {
      try {
        const res = await ServicesMensajes.getConversaciones(user.id);
        const data = res?.data ?? res;
        setConversaciones(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando conversaciones:", err);
        setConversaciones([]);
      }
    };

    fetchConversaciones();
  }, [user?.id]);

  // Cuando cambian los mensajes, hacer scroll al final
  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  // Abrir chat y obtener mensajes entre usuario y otherUser
  const abrirChat = async (otherUser) => {
    setChatAbierto(otherUser);
    try {
      const res = await ServicesMensajes.getMensajes(user.id, otherUser.id);
      const data = res?.data ?? res;
      setMensajes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando mensajes:", err);
      setMensajes([]);
    }
  };

  // Enviar mensaje cifrado (el serializer espera 'contenido')
  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !chatAbierto) return;

    const payload = {
      remitente: user.id,
      destinatario: chatAbierto.id,
      contenido: nuevoMensaje.trim(),
    };

    try {
      const res = await ServicesMensajes.enviarMensaje(payload);
      const enviado = res?.data ?? res;

      if (enviado) {
        // Actualizar mensajes en la conversación abierta (optimista)
        setMensajes((prev) => [...prev, enviado]);

        // Actualizar conversaciones: último mensaje y mover a tope
        setConversaciones((prevConvs) => {
          const otherId = chatAbierto.id;
          // Copiamos array y buscamos si ya existe la conversación
          const copy = [...prevConvs];
          const idx = copy.findIndex((c) => c.usuario?.id === otherId);

          const nuevoItem = {
            usuario: chatAbierto,
            ultimo_mensaje: enviado,
            ultima_fecha: enviado.fecha_envio,
          };

          if (idx !== -1) {
            // reemplazar y mover al inicio
            copy.splice(idx, 1);
          }
          copy.unshift(nuevoItem);
          return copy;
        });

        setNuevoMensaje("");
      }
    } catch (err) {
      console.error("Error enviando mensaje:", err);

    }
  };
  console.log("Usuario ID recibido por Sidebar:", user?.id);
  // Tecla Enter para enviar
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      enviarMensaje();
    }
  };


  return (
    <div className="sidebar-chats-container d-flex w-100 h-100 bg-light rounded overflow-hidden">
      {/* Panel de conversaciones (col izquierda) */}
      <div className={`sidebar-chats-panel bg-white border-end ${chatAbierto ? 'chat-abierto' : ''}`}>
        {!chatAbierto && (
          <div className="p-3">
            <h5 className="mb-3 d-flex align-items-center gap-2">
              <MessageSquare /> Chats
            </h5>

            {conversaciones.length === 0 ? (
              <p className="text-muted">No hay conversaciones.</p>
            ) : (
              conversaciones.map((c) => (
                <div
                  key={c.usuario.id}
                  className="conversacion-item p-2 mb-2 border rounded"
                  onClick={() => abrirChat(c.usuario)}
                >
                  <div className="fw-bold">{c.usuario.username}</div>
                  <div className="conversacion-ultimo-mensaje text-muted small text-truncate">
                    {c.ultimo_mensaje?.contenido ?? ""}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Si el chat está abierto, igual mostramos la lista a la izquierda en móviles/pequeñas pantallas,
            pero el diseño principal asume panel derecho para el chat */}
      </div>

      {/* Panel de chat (col derecha) */}
      {chatAbierto && (
        <div className="chat-panel d-flex flex-column flex-grow-1 p-3">
          <button
            className="btn btn-link text-decoration-none mb-2 d-flex align-items-center"
            onClick={() => setChatAbierto(null)}
          >
            <ArrowLeftCircle className="me-2" /> Volver
          </button>

          <h3 className="mb-3 border-bottom pb-2">{chatAbierto.username}</h3>

          <div className="mensajes-container flex-grow-1 mb-3 bg-white border rounded p-3">
            {mensajes.length === 0 ? (
              <p className="text-muted">Sin mensajes aún. Inicia la conversación.</p>
            ) : (
              mensajes.map((m) => {
                const esYo = m.remitente === user.id || (m.remitente?.id === user.id);
                // Algunas respuestas pueden traer remitente como id o objeto; manejamos ambas
                return (
                  <div
                    key={m.id}
                    className={`mensaje d-block mb-2 p-2 rounded ${esYo ? 'mensaje-yo bg-primary text-white ms-auto' : 'mensaje-otro bg-secondary text-dark'}`}
                  >
                    {m.contenido}
                  </div>
                );
              })
            )}
            <div ref={mensajesEndRef} />
          </div>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Escribe un mensaje..."
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="btn-save" onClick={enviarMensaje}>
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SidebarChats;