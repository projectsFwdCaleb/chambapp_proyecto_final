import React from "react";
/*trayendo estilos del bootstap y iconos de react-icons/fa */
import { Container, Row, Col } from "react-bootstrap";
import { FaWhatsapp } from "react-icons/fa";
import "./Footer.css";
function Footer() {
  /*y este es un componente 100% visual*/
  return (
    <footer className="footer mt-5">
      <Container>
        <Row className="text-center text-md-start">
          {/* Columna izquierda */}
          <Col md={6} className="mb-3">
            <h3 className="footer-title">ChambApp</h3>
            <p className="footer-text">
              Conectamos a trabajadores con posibles clientes en todo el pais
            </p>
          </Col>
          {/* Columna derecha */}
          <Col
            md={6}
            className="d-flex justify-content-center justify-content-md-end align-items-center"
          >
            {/*link para whatsapp*/}
            <a
              href="https://api.whatsapp.com/send?phone=50662071398&text=Hola!%20Me%20gustaría%20más%20información"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-link"
            > {/*el icono de whatsapp*/}
              <FaWhatsapp className="whatsapp-icon" />
              <span className="ms-2">Contáctanos</span>
            </a>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-3">
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