/*traer useState de reac y no hay mas que decir del señor */
import React, { useState } from "react";
/*traer los estilos que si que van a hacer falta aqui*/
import "./ChatBot.css";

/*iniciamos con la funcionalidad para el chat y ponemos el onClose para poder cerrarlo */
function ChatBot({ onClose }) {
  /*la constante esta ves seran para ver los mensajes, tener un mensaje de carga 
  y los input(texto) que el usuario escriba*/
  const [messages, setMessages] = useState([
    /*se inicia con un saludo :)*/
    { role: "assistant", content: "¡Hola! 👋 ¿En qué puedo ayudarte hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  /*aqui la conste/funcion para enviar mensajes*/
  const sendMessage = async () => {
    /*y toda funcion con implique inpu ocupa su validacion */
    if (!input.trim()) return;
    /*aqui es donde se van a guardar el inpu del usuari y se va volver a vasiar el inpu
    para que pueda volver a escribir otro mensaje  */
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    /*try para probar por errores*/
    try {
      /*aqui llamamo a la AI que usaremos para responder los mensajes de los usuarios*/
      const response = await fetch("http://localhost:8000/api/chat/", { 
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        messages: newMessages
        })
    });
      /*aqui vamos a imprimir la respuesta del IA o un mensaje de error en caso de que todo falle */
      const data = await response.json();

      const reply = data.reply || "Lo siento, hubo un error"

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    /*el catch para tomar los errores con un mensaje para saber donde paso*/
    } catch (err) {
      setMessages([
        /*el error tendra mensaje en el chat */
        ...newMessages,
        { role: "assistant", content: "Error al conectar con el servidor 😓" }
      ]);
      /*y ttras todo eso de arriba, termina la carga*/
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* inicia contenedor */}
      <div className="chatbot-header">
        <span>Asistente Virtual 🤖</span>
        {/* el boton para cerrar */}
        <button onClick={onClose}>✖</button>
      </div>
       {/* aqui apareseran todos los mensajes  */}
      <div className="chatbot-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.content}
          </div>
        ))}
        {/* otra carga */}
        {loading && <div className="msg assistant">Escribiendo...</div>}
      </div>
        {/* el area del input donde se escribiran los mensajes y se mandaran  */}
      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}
export default ChatBot