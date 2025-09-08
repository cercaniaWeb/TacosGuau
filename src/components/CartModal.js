import React, { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/CartModal.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const stripeKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const CartModal = ({ isOpen, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const { items, getCartTotal, clearCart, updateQuantity, removeItem } = useCart();
  const formRef = useRef(null); // Referencia para el formulario

  const CLABE_ACCOUNT = '646180401604754389';

  if (!isOpen) {
    return null;
  }

  // Lógica centralizada para enviar la orden (email y Firestore)
  const handleFinalizeOrder = async (orderData) => {
    try {
      const response = await fetch('/.netlify/functions/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('El servidor de notificaciones falló.');
      }

      await addDoc(collection(db, 'orders'), {
        ...orderData,
        timestamp: serverTimestamp(),
        status: 'pending',
      });

      alert(`¡Gracias por tu pedido, ${orderData.name}!\n\nHemos recibido tu pedido y, si proporcionaste un correo, te hemos enviado un recibo.`);
      clearCart();
      onClose();

    } catch (error) {
      console.error('Error al finalizar el pedido:', error);
      alert('Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.');
    }
  };

  // Maneja el submit para pagos que no son con tarjeta
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    const orderData = getOrderDataFromForm();
    if (!orderData) return;

    if (paymentMethod !== 'card') {
      await handleFinalizeOrder({ ...orderData, paymentMethod });
    }
  };

  // Se ejecuta cuando el pago con tarjeta es exitoso desde CheckoutForm
  const onSuccessfulCheckout = () => {
    const orderData = getOrderDataFromForm();
    if (!orderData) return;
    
    handleFinalizeOrder({ ...orderData, paymentMethod: 'card' });
  };

  // Helper para obtener los datos del formulario
  const getOrderDataFromForm = () => {
    const form = formRef.current;
    const name = form.customerName.value;
    const phone = form.customerPhone.value;

    if (!name || !phone) {
      alert('Por favor completa tu Nombre y Teléfono.');
      return null;
    }

    return {
      name,
      phone,
      email: form.customerEmail.value,
      customerAlias: form.customerAlias.value,
      notes: form.customerNotes.value,
      items,
      total: getCartTotal(),
    };
  };

  const handleCopyClabe = () => {
    navigator.clipboard.writeText(CLABE_ACCOUNT)
      .then(() => alert('Número de cuenta CLABE copiado al portapapeles: ' + CLABE_ACCOUNT))
      .catch(() => alert('No se pudo copiar el número de cuenta CLABE.'));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="section-title">Tu Pedido</h2>

        {items.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <div className="cart-items-list">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <div className="item-controls">
                  <input type="number" value={item.quantity} onChange={(e) => updateQuantity(item, parseInt(e.target.value, 10))} min="1" />
                  <button onClick={() => removeItem(item)} className="remove-item-btn">&times;</button>
                </div>
              </div>
            ))}
            <div className="cart-total"><strong>Total: ${getCartTotal().toFixed(2)}</strong></div>
          </div>
        )}

        <form id="orderForm" ref={formRef} onSubmit={handleSubmit}>
          <h3 className="section-title">Información del Pedido</h3>
          <div className="form-grid">
            <div className="form-group"><label htmlFor="customerName">Nombre Completo *</label><input type="text" id="customerName" name="customerName" required /></div>
            <div className="form-group"><label htmlFor="customerPhone">Teléfono *</label><input type="tel" id="customerPhone" name="customerPhone" required /></div>
            <div className="form-group full-width"><label htmlFor="customerEmail">Correo Electrónico (Opcional)</label><input type="email" id="customerEmail" name="customerEmail" placeholder="Para recibir tu recibo por correo"/></div>
            <div className="form-group full-width"><label htmlFor="customerAlias">Nombre para Producción (Opcional)</label><input type="text" id="customerAlias" name="customerAlias" placeholder="Ej: Mesa 5, Cliente Juan"/></div>
          </div>
          <div className="form-group"><label htmlFor="customerNotes">Notas adicionales (Opcional)</label><textarea id="customerNotes" name="customerNotes" placeholder="Especificaciones especiales para tu pedido"></textarea></div>

          <h3 className="section-title">Método de Pago</h3>
          <div className="payment-methods">
            <div className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cash')}><h3><i className="fas fa-money-bill-wave"></i> Efectivo</h3><p>Paga en efectivo al recoger tu pedido</p></div>
            <div className={`payment-option ${paymentMethod === 'transfer' ? 'selected' : ''}`} onClick={() => { setPaymentMethod('transfer'); handleCopyClabe(); }}><h3><i className="fas fa-mobile-alt"></i> Transferencia</h3><p>Transferencia a cuenta clabe 646180401604754389 open light Santander</p></div>
            {stripePromise && (<div className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}><h3><i className="fas fa-credit-card"></i> Tarjeta de Crédito/Débito</h3><p>Paga con tu tarjeta de forma segura</p></div>)}
          </div>

          {paymentMethod === 'card' && stripePromise && (
            <Elements stripe={stripePromise}><CheckoutForm onSuccessfulCheckout={onSuccessfulCheckout} /></Elements>
          )}

          <div className="pickup-info"><h3><i className="fas fa-store"></i> Recolección en Tienda</h3><p>Actualmente solo ofrecemos recolección en tienda.</p></div>

          {paymentMethod !== 'card' && (<button type="submit" className="checkout-btn"><i className="fas fa-check-circle"></i> Confirmar Pedido</button>)}
        </form>
      </div>
    </div>
  );
};

export default CartModal;
