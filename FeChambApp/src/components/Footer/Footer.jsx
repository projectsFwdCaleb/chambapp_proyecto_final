import React from "react";
/*trayendo estilos del bootstap y iconos de react-icons/fa */
import { Container, Row, Col } from "react-bootstrap";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from '../../../Context/UserContext';
import "./Footer.css";

function Footer() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/";
  };

  return (
    <footer className="footer mt-5">
      <Container>
        <Row className="text-center text-md-start">
          {/* Columna Branding */}
          <Col md={4} className="mb-4 mb-md-0">
            <h3 className="footer-title">ChambApp</h3>
            <p className="footer-text">
              Conectamos a trabajadores con posibles clientes en todo el país.
              Calidad y confianza en cada servicio.
            </p>
          </Col>

          {/* Columna Enlaces Rápidos */}
          <Col md={4} className="mb-4 mb-md-0 d-flex flex-column align-items-center align-items-md-start">
            <h3 className="footer-subtitle">Enlaces Rápidos</h3>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/acerca-de">Sobre Nosotros</Link></li>
              {/* Lógica Smart: Login/Logout */}
              {user ? (
                <>
                  <li><Link to="/perfil">Mi Perfil</Link></li>
                  <li><button onClick={handleLogout} className="btn-link-footer">Cerrar Sesión</button></li>
                </>
              ) : (
                <li><Link to="/Loging">Iniciar Sesión</Link></li>
              )}
            </ul>
          </Col>

          {/* Columna Contacto */}
          <Col
            md={4}
            className="d-flex flex-column justify-content-center align-items-center align-items-md-end"
          >
            <h3 className="footer-subtitle d-none d-md-block text-end w-100">Contáctanos</h3>
            {/*link para whatsapp*/}
            <a
              href="https://api.whatsapp.com/send?phone=50662071398&text=Hola!%20Me%20gustaría%20más%20información"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-link"
            > {/*el icono de whatsapp*/}
              <FaWhatsapp className="whatsapp-icon" />
              <span className="ms-2">WhatsApp</span>
            </a>
          </Col>
        </Row>

        <Row>
          <Col className="text-center mt-4">
            <div className="divider"></div>
            <small className="footer-copy">
              © {new Date().getFullYear()} ChambApp. Todos los derechos reservados.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;