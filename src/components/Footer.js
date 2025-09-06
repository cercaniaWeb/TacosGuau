// src/components/Footer.js
import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">Tacos Guau & Don Panda Birria</div>
        <div className="footer-info">
          <p>Calle Guanajuato Lt 33 Mz 1a, a un costado de la tienda y frente al templo de los Testigos de Jehová</p>
          <p>Tel: 7447 632914</p>
        </div>
        <div className="social-links">
          <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
          <a href="#" className="social-link"><i className="fab fa-whatsapp"></i></a>
        </div>
        <div className="copyright">
          &copy; 2023 Tacos Guau y Don Panda Birria. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;