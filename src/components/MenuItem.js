import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import '../styles/MenuItem.css';

const MenuItem = ({ item, isGuest }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { showNotification } = useNotification();

  const handleAddToCart = () => {
    if (isGuest) {
      showNotification('Inicia sesión para poder agregar productos al carrito.', 'info');
      return;
    }
    addItem({ ...item, quantity });
    showNotification('Producto agregado al carrito.', 'success');
  };

  return (
    <div className={`menu-item ${isGuest ? 'is-guest' : ''}`}>
      <img src={item.category === 'birria' ? "/logopanda.png" : "/logo.png"} alt="Tacos Guau Logo" className="menu-item-logo" />
      {item.imageUrl && (
        <img src={item.imageUrl} alt={item.name} className="menu-item-product-image" />
      )}
      <div className="menu-item-image">
        <i className="fas fa-utensils"></i>
      </div>
      
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <p className="price">${item.price}</p>
      <div className="add-to-cart-controls">
        <input 
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          min="1"
          className="quantity-input"
          disabled={isGuest}
        />
        <button onClick={handleAddToCart} className="add-to-cart-btn" disabled={isGuest}>
          {isGuest ? 'Inicia Sesión' : 'Agregar'}
        </button>
      </div>
    </div>
  );
};

export default MenuItem;
