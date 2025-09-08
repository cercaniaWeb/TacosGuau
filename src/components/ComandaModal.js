import React, { useState, useMemo } from 'react';
import { allItems, categories } from '../data/products';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNotification } from '../context/NotificationContext';
import '../styles/ComandaModal.css';

const ComandaModal = ({ isOpen, onClose }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [customerIdentifier, setCustomerIdentifier] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { showNotification } = useNotification();

  const handleAddItem = (item) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    const newQuantity = parseInt(quantity, 10);
    if (newQuantity > 0) {
      setOrderItems(items => items.map(i => i.id === itemId ? { ...i, quantity: newQuantity } : i));
    } else {
      setOrderItems(items => items.filter(i => i.id !== itemId));
    }
  };

  const orderTotal = useMemo(() => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [orderItems]);

  const handleSendToKitchen = async () => {
    if (orderItems.length === 0) {
      showNotification('No hay productos en la comanda.', 'error');
      return;
    }
    if (!customerIdentifier) {
      showNotification('Por favor, identifica la comanda (Ej: Mesa 5, Cliente Juan).', 'error');
      return;
    }

    const orderData = {
      customerAlias: customerIdentifier,
      items: orderItems,
      total: orderTotal,
      status: 'preparing', // Directo a preparación
      timestamp: serverTimestamp(),
      paymentMethod: 'local', // Identificador para pedidos de comandera
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
      showNotification(`Comanda para "${customerIdentifier}" enviada a cocina.`, 'success');
      setOrderItems([]);
      setCustomerIdentifier('');
      onClose();
    } catch (error) {
      showNotification('Error al enviar la comanda.', 'error');
      console.error("Error writing document: ", error);
    }
  };

  if (!isOpen) return null;

  const filteredMenuItems = activeCategory === 'all' 
    ? allItems 
    : allItems.filter(item => item.category === activeCategory);

  return (
    <div className="comanda-modal-overlay" onClick={onClose}>
      <div className="comanda-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="comanda-modal-header">
          <h2>Nueva Comanda</h2>
          <button onClick={onClose} className="comanda-close-btn">&times;</button>
        </div>
        <div className="comanda-grid">
          <div className="menu-list-panel">
            <h3>Menú</h3>
            <div className="menu-tabs">
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}>
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="comanda-menu-grid">
              {filteredMenuItems.map(item => (
                <div key={item.id} className="comanda-menu-item" onClick={() => handleAddItem(item)}>
                  <img src={item.imageUrl || '/logo.png'} alt={item.name} />
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="current-order-panel">
            <h3>Comanda Actual</h3>
            <div className="order-details-form">
              <div className="form-group">
                <label htmlFor="customer-id">Identificador (Mesa/Cliente)</label>
                <input 
                  type="text" 
                  id="customer-id" 
                  value={customerIdentifier}
                  onChange={(e) => setCustomerIdentifier(e.target.value)}
                  placeholder="Ej: Mesa 5, Cliente Juan"
                />
              </div>
            </div>
            <div className="current-order-list">
              {orderItems.length === 0 ? (
                <p>Añade productos desde el menú...</p>
              ) : (
                orderItems.map(item => (
                  <div key={item.id} className="current-order-item">
                    <span className="item-name">{item.name}</span>
                    <div className="item-controls">
                      <input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                        min="0"
                      />
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="current-order-total">
              Total: ${orderTotal.toFixed(2)}
            </div>
            <div className="comanda-actions">
              <button className="btn btn-primary" onClick={handleSendToKitchen}>Enviar a Cocina</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComandaModal;
