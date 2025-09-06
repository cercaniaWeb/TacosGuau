// src/components/BusinessInfo.js
import React from 'react';
import '../styles/BusinessInfo.css';

const BusinessInfo = () => {
  return (
    <section className="business-info container">
      <div className="info-card">
        <h3><i className="fas fa-map-marker-alt"></i> Ubicación</h3>
        <p>Guanajuato 33, Ejidos de San Agustin 2da Secc, 56344 Cdad. Nezahualcóyotl, Méx.</p>
        <iframe src="https://maps.google.com/maps?q=19.378513547653935,-98.97365919394099&hl=es;z=14&amp;output=embed" width="100%" height="300" style={{border:0}} allowFullScreen="" loading="lazy"></iframe>
      </div>
      
      <div className="info-card">
        <h3><i className="fas fa-clock"></i> Horarios</h3>
        <ul className="hours-list">
          <li><span className="day">Tacos Guau:</span> Viernes y sábados de 6PM a 11PM</li>
          <li><span className="day">Don Panda Birria:</span> Sábados y domingos de 8 AM a 1 PM</li>
        </ul>
      </div>
      
      <div className="info-card">
        <h3><i className="fas fa-star"></i> Promociones</h3>
        <p>Compra 2 tacos de birria y llévate un vaso de consomé gratis (solo en Don Panda Birria)</p>
        <p>Todos los tacos incluyen papas fritas, nopales y cebolla</p>
      </div>
    </section>
  );
};

export default BusinessInfo;