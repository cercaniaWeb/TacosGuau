// src/components/Hero.js
import React from 'react';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <h2>¡Los Mejores Tacos y Birria de la Ciudad!</h2>
      <p>Disfruta de nuestra deliciosa comida mexicana con ingredientes frescos y recetas tradicionales. ¡Todos nuestros tacos incluyen papas fritas, nopales y cebolla!</p>
      <div className="promo-banner">
        <i className="fas fa-star"></i> ¡Compra 2 tacos de birria y llévate un vaso de consomé gratis! (Solo en Don Panda Birria) <i className="fas fa-star"></i>
      </div>
    </section>
  );
};

export default Hero;