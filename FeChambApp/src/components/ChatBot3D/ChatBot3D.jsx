import React, { useState } from "react";
/*la parte mas importante para tener una imagen 3d es traer la libreria que manejara la imagen
les presento a Spine, la libreria en cuestion*/
import Spline from "@splinetool/react-spline";
import "./ChatBot3D.css";
/* ponemos el onOpenChat para poder abrir el chat */
function ChatBot3D({ onOpenChat }) {
  /*si....este componete es 100% visual y ya */
  return (
    <div>
    <div className="chatbot-showcase-container">

      {/* Fondo 3D */}
      <div className="spline-wrapper">
        {/*hay que traer el fondo desde spline usando este link*/}
        <Spline scene="https://prod.spline.design/3YvYuy7vpGXK43cJ/scene.splinecode" />
        
      </div>

      {/* Overlay con texto arriba del modelo 3d(con un boton) */}
      <div className="showcase-overlay">
        <button className="btn-save" onClick={onOpenChat}>
          <small>💬 Abrir Chat Asistente</small>
        </button>
      </div>

    </div>
    </div>
  );
}

export default ChatBot3D;