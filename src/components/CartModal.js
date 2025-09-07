import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/CartModal.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { db } from '../firebase'; // Import db
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CartModal = ({ isOpen, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const { items, getCartTotal, clearCart, updateQuantity, removeItem } = useCart();

  const CLABE_ACCOUNT = '646180401604754389'; // Define CLABE here

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const name = e.target.customerName.value;
    const phone = e.target.customerPhone.value;
    const email = e.target.customerEmail.value;
    const customerAlias = e.target.customerAlias.value; // New line
    const notes = e.target.customerNotes.value;
    
    if (!name || !phone) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    
    if (items.length === 0) {
      alert('Tu carrito está vacío. Agrega algunos productos antes de ordenar.');
      return;
    }
    
    if (paymentMethod !== 'card') {
      const orderData = {
        name,
        phone,
        email,
        customerAlias, // New line
        notes,
        items,
        total: getCartTotal(),
        paymentMethod
      };

      try {
        const response = await fetch('/.netlify/functions/send-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (response.ok) {
          // Save order to Firestore
          try {
            await addDoc(collection(db, 'orders'), {
              ...orderData,
              timestamp: serverTimestamp(),
              status: 'pending' // Initial status
            });
            alert(`¡Gracias por tu pedido, ${name}!\n\nHemos recibido tu pedido y, si proporcionaste un correo, te hemos enviado un recibo.`);
            clearCart();
            onClose();
          } catch (firestoreError) {
            console.error('Error al guardar el pedido en Firestore:', firestoreError);
            alert('Hubo un error al guardar tu pedido. Por favor, inténtalo de nuevo.');
          }
        } else {
          alert('Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('Error al enviar el pedido:', error);
        alert('Hubo un error de conexión al procesar tu pedido. Por favor, revisa tu conexión a internet e inténtalo de nuevo.');
      }
    }
    // Si el método de pago es 'card', el submit se manejará en CheckoutForm
  };

  const handleCopyClabe = () => {
    navigator.clipboard.writeText(CLABE_ACCOUNT)
      .then(() => {
        alert('Número de cuenta CLABE copiado al portapapeles: ' + CLABE_ACCOUNT);
      })
      .catch(err => {
        console.error('Error al copiar el número de cuenta CLABE: ', err);
        alert('No se pudo copiar el número de cuenta CLABE.');
      });
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
                  <input 
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item, parseInt(e.target.value, 10))}
                    min="1"
                  />
                  <button onClick={() => removeItem(item)} className="remove-item-btn">&times;</button>
                </div>
              </div>
            ))}
            <div className="cart-total">
              <strong>Total: ${getCartTotal().toFixed(2)}</strong>
            </div>
          </div>
        )}

        <form id="orderForm" onSubmit={handleSubmit}>
          <h3 className="section-title">Información del Pedido</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="customerName">Nombre Completo *</label>
              <input type="text" id="customerName" name="customerName" required />
            </div>
            <div className="form-group">
              <label htmlFor="customerPhone">Teléfono *</label>
              <input type="tel" id="customerPhone" name="customerPhone" required />
            </div>
            <div className="form-group full-width">
              <label htmlFor="customerEmail">Correo Electrónico (Opcional)</label>
              <input type="email" id="customerEmail" name="customerEmail" placeholder="Para recibir tu recibo por correo"/>
            </div>
            <div className="form-group full-width">
              <label htmlFor="customerAlias">Nombre para Producción (Opcional)</label>
              <input type="text" id="customerAlias" name="customerAlias" placeholder="Ej: Mesa 5, Cliente Juan"/>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="customerNotes">Notas adicionales (Opcional)</label>
            <textarea id="customerNotes" name="customerNotes" placeholder="Especificaciones especiales para tu pedido"></textarea>
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
              onClick={() => {
                setPaymentMethod('transfer');
                handleCopyClabe(); // Call copy function
              }}
            >
              <h3><i className="fas fa-mobile-alt"></i> Transferencia</h3>
              <p>Transferencia a cuenta clabe 646180401604754389 open light Santander</p>
            </div>
            <div 
              className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <h3><i className="fas fa-credit-card"></i> Tarjeta de Crédito/Débito</h3>
              <p>Paga con tu tarjeta de forma segura</p>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}

          <div className="pickup-info">
            <h3><i className="fas fa-store"></i> Recolección en Tienda</h3>
            <p>Actualmente solo ofrecemos recolección en tienda.</p>
          </div>

          {paymentMethod !== 'card' && (
            <button type="submit" className="checkout-btn">
              <i className="fas fa-check-circle"></i> Confirmar Pedido
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CartModal;
