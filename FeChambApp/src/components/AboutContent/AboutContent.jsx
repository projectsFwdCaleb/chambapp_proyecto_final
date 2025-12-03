import React, { useState, useEffect } from "react";
import "../AboutContent/AboutContent.css";

function AboutContent() {
  const [page, setPage] = useState(0);
  const [flipState, setFlipState] = useState({ direction: null, active: false });
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation duration matches CSS (1.2s)
  const ANIM_DURATION = 1200;

  // Trigger CSS animation after mount
  useEffect(() => {
    if (flipState.active && !isAnimating) {
      // Small delay to ensure DOM is ready, then trigger animation
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else if (!flipState.active) {
      setIsAnimating(false);
    }
  }, [flipState.active]);

  const next = () => {
    if (flipState.active || page >= pages.length - 2) return;

    setFlipState({ direction: "forward", active: true });

    setTimeout(() => {
      setPage((p) => p + 2);
      setFlipState({ direction: null, active: false });
    }, ANIM_DURATION);
  };

  const prev = () => {
    if (flipState.active || page <= 0) return;

    setFlipState({ direction: "backward", active: true });

    setTimeout(() => {
      setPage((p) => p - 2);
      setFlipState({ direction: null, active: false });
    }, ANIM_DURATION);
  };

  const pages = [
    // PORTADA
    `
    <h2>Chambapp</h2>
    <p>Información, Términos y Políticas</p>
    <div style="margin-top: 50px; text-align: center; opacity: 0.8;">
      <p>Desliza o usa los botones para navegar</p>
    </div>
    `,

    // QUIÉNES SOMOS 1
    `
    <h2>Quiénes Somos</h2>
    <p>Chambapp es una plataforma digital diseñada para conectar a personas
    que buscan servicios con trabajadores independientes dispuestos a
    ofrecerlos.</p>

    <p>Nuestro objetivo es facilitar el encuentro mediante una experiencia
    rápida, sencilla y segura.</p>
    `,

    // QUIÉNES SOMOS 2
    `
    <p>Creemos en el talento local y en brindar herramientas para que los
    trabajadores accedan a mejores oportunidades.</p>

    <p>Ayudamos a los usuarios a encontrar profesionales confiables dentro de
    su cantón, con perfiles verificados y precios referenciales.</p>

    <p>Chambapp no presta servicios por sí misma; es un punto de encuentro.</p>
    `,

    // QUIÉNES SOMOS 3
    `
    <p>Nos comprometemos a mejorar el acceso a oportunidades laborales y a
    facilitar cómo las personas encuentran ayuda para sus necesidades.</p>
    `,

    // TÉRMINOS Y CONDICIONES (Página 1)
    `
    <h2>Términos y Condiciones</h2>
    <h3>1. Aceptación</h3>
    <p>Al usar Chambapp, el usuario acepta estos términos.</p>

    <h3>2. Naturaleza del Servicio</h3>
    <p>Chambapp es solo un intermediario digital.</p>
    `,

    // TÉRMINOS Y CONDICIONES (Página 2)
    `
    <h3>3. Registro</h3>
    <p>El usuario debe proporcionar información real.</p>

    <h3>4. Responsabilidad del Trabajador</h3>
    <p>Es responsable de precios, calidad y cumplimiento legal.</p>

    <h3>5. Responsabilidad del Cliente</h3>
    <p>Debe verificar reputación y condiciones del trabajador.</p>
    `,

    // DISCLAIMER
    `
    <h2>Descargo de Responsabilidad</h2>
    <p>Chambapp no presta servicios, no contrata trabajadores y no garantiza
    la calidad o cumplimiento de los usuarios.</p>

    <p>Todas las negociaciones, pagos y acuerdos se hacen directamente entre
    los usuarios bajo su propia responsabilidad.</p>
    `,

    // POLÍTICA DE PRIVACIDAD (Página 1)
    `
    <h2>Política de Privacidad</h2>
    <h3>1. Información que recopilamos</h3>
    <p>Datos de perfil, ubicación general, servicios publicados, imágenes y
    actividad básica del usuario.</p>
    `,

    // POLÍTICA DE PRIVACIDAD (Página 2)
    `
    <h3>2. Cómo usamos la información</h3>
    <p>Para administrar la cuenta, mostrar servicios y mejorar la seguridad.</p>

    <h3>3. Con quién compartimos la información</h3>
    <p>Solo con otros usuarios, servicios tecnológicos o autoridades.</p>
    `,

    // POLÍTICA DE PUBLICACIÓN
    `
    <h2>Política de Publicación de Servicios</h2>
    <h3>1. Normas de publicación</h3>
    <p>El servicio debe ser claro, honesto y estar en la categoría correcta.</p>

    <h3>2. Contenido prohibido</h3>
    <p>Servicios ilegales, engañosos, riesgosos o con imágenes robadas.</p>

    <h3>3. Comportamiento del trabajador</h3>
    <p>Debe cumplir acuerdos, ser profesional y mantener información actualizada.</p>

    <strong>Fin del documento</strong>
    <small>Gracias por usar Chambapp.</small>
    `,
  ];

  // Logic to determine what to show on the 3 layers
  let staticLeftContent = "";
  let staticRightContent = "";
  let flipperFrontContent = "";
  let flipperBackContent = "";
  let flipperClass = "";

  if (!flipState.active) {
    // IDLE STATE
    staticLeftContent = pages[page] || "";
    staticRightContent = pages[page + 1] || "";
  } else if (flipState.direction === "forward") {
    // FLIPPING FORWARD (Next)
    staticLeftContent = pages[page] || "";
    staticRightContent = pages[page + 3] || "";
    flipperFrontContent = pages[page + 1] || "";
    flipperBackContent = pages[page + 2] || "";
    // Only apply flip class when animation should start
    flipperClass = isAnimating ? "flipping-forward" : "";
  } else if (flipState.direction === "backward") {
    // FLIPPING BACKWARD (Prev)
    staticLeftContent = pages[page - 2] || "";
    staticRightContent = pages[page + 1] || "";
    flipperFrontContent = pages[page - 1] || "";
    flipperBackContent = pages[page] || "";
    // Only apply flip class when animation should start
    flipperClass = isAnimating ? "start-left flipping-backward" : "start-left";
  }

  return (
    <div className="book-wrapper">
      <div className="book-container">
        <div className="book-3d">

          {/* STATIC LEFT PAGE */}
          <div className="page static-left">
            <div
              className="page-inner"
              dangerouslySetInnerHTML={{ __html: staticLeftContent }}
            ></div>
          </div>

          {/* STATIC RIGHT PAGE */}
          <div className="page static-right">
            <div
              className="page-inner"
              dangerouslySetInnerHTML={{ __html: staticRightContent }}
            ></div>
          </div>

          {/* FLIPPING PAGE */}
          {flipState.active && (
            <div className={`page-flipper ${flipperClass}`}>
              <div className="flipper-front">
                <div
                  className="page-inner"
                  dangerouslySetInnerHTML={{ __html: flipperFrontContent }}
                ></div>
              </div>
              <div className="flipper-back">
                <div
                  className="page-inner"
                  dangerouslySetInnerHTML={{ __html: flipperBackContent }}
                ></div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* CONTROLS */}
      <div className="controls">
        <button onClick={prev} disabled={page === 0 || flipState.active}>
          ◀ Atrás
        </button>

        <span className="page-indicator">
          {page + 1} - {Math.min(page + 2, pages.length)} / {pages.length}
        </span>

        <button onClick={next} disabled={page >= pages.length - 2 || flipState.active}>
          Siguiente ▶
        </button>
      </div>

      <button
        onClick={() => document.body.classList.toggle("dark")}
        className="dark-toggle"
      >
        Modo oscuro
      </button>
    </div>
  );
}

export default AboutContent;
