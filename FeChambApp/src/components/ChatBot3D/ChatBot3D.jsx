import React, { useState } from "react";
import Spline from "@splinetool/react-spline";
import "./ChatBot3D.css";

function ChatBot3D({ onOpenChat }) {
  return (
    <div>
    <div className="chatbot-showcase-container">

      {/* Fondo 3D */}
      <div className="spline-wrapper">
        <Spline scene="https://prod.spline.design/3YvYuy7vpGXK43cJ/scene.splinecode" />
        
      </div>

      {/* Overlay con texto */}
      <div className="showcase-overlay">
        <button className="chatbot-btn" onClick={onOpenChat}>
          <small>💬 Abrir Chat Asistente</small>
        </button>
      </div>

    </div>
    </div>
  );
}

export default ChatBot3D;