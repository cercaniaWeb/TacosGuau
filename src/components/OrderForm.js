// src/components/OrderForm.js
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/OrderForm.css';

const OrderForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const { getCartTotal, clearCart, items } = useCart();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    
    if (!name || !phone) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    
    if (items.length === 0) {
      alert('Tu carrito está vacío. Agrega algunos productos antes de ordenar.');
      return;
    }
    
    // Simular confirmación de pedido
    setTimeout(() => {
      alert(`¡Gracias por tu pedido, ${name}!\n\nHemos recibido tu pedido por un total de $${getCartTotal().toFixed(2)}. Pronto nos pondremos en contacto contigo al ${phone} para coordinar la recolección.`);
      clearCart();
      e.target.reset();
      setPaymentMethod('cash');
    }, 1000);
  };

  return (
    <section className="order-form container">
      <h2 className="section-title">Información del Pedido</h2>
      
      <form id="orderForm" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="customerName">Nombre Completo *</label>
            <input type="text" id="customerName" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="customerPhone">Teléfono *</label>
            <input type="tel" id="customerPhone" required />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="customerNotes">Notas adicionales (Opcional)</label>
          <textarea id="customerNotes" placeholder="Especificaciones especiales para tu pedido"></textarea>
        </div>
        
        <h3 className="section-title">Método de Pago</h3>
        
        <div className="payment-methods">
          <div 
            className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`} 
            onClick={() => setPaymentMethod('cash')}
          >
            <h3><i className="fas fa-money-bill-wave"></i> Efectivo</h3>
            <p>Paga en efectivo al recoger tu pedido</p>
          </div>
          
          <div 
            className={`payment-option ${paymentMethod === 'transfer' ? 'selected' : ''}`} 
            onClick={() => setPaymentMethod('transfer')}
          >
            <h3><i className="fas fa-mobile-alt"></i> Transferencia</h3>
            <p>Transferencia bancaria o pago móvil</p>
          </div>
        </div>
        
        <div className="pickup-info">
          <h3><i className="fas fa-store"></i> Recolección en Tienda</h3>
          <p>Actualmente solo ofrecemos recolección en tienda. Ven por tu pedido a nuestra ubicación:</p>
          <p><strong>Calle Guanajuato Lt 33 Mz 1a</strong></p>
          <p><strong>Frente al templo de los Testigos de Jehová</strong></p>
        </div>
        
        <button type="submit" className="checkout-btn">
          <i className="fas fa-check-circle"></i> Confirmar Pedido
        </button>
      </form>
    </section>
  );
};

export default OrderForm;