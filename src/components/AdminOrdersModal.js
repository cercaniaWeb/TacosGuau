import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import '../styles/AdminOrdersModal.css';
import { useAuth } from '../context/AuthContext';

// Recibe la nueva prop onNewComandaClick
const AdminOrdersModal = ({ isOpen, onClose, onNewComandaClick }) => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, [isOpen]);

  const updateOrderStatus = async (orderId, newStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    try {
      await updateDoc(orderRef, { status: newStatus });
      console.log(`Orden ${orderId} actualizada a ${newStatus}`);
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>Gestión de Pedidos</h2>
          {/* Botón para crear nueva comanda */}
          <button className="new-comanda-btn" onClick={onNewComandaClick}>
            <i className="fas fa-plus"></i> Crear Nueva Comanda
          </button>
          <button className="admin-close-btn" onClick={onClose}>&times;</button>
        </div>

        {orders.length === 0 ? (
          <p className="no-orders-message">No hay pedidos pendientes.</p>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className={`order-card status-${order.status}`}>
                <div className="order-card-header">
                  <h3>{order.customerAlias || 'Pedido de Cliente'}</h3>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <p><strong>ID:</strong> {order.id}</p>
                {order.name && <p><strong>Cliente:</strong> {order.name}</p>}
                <p><strong>Estado:</strong> <span className={`status-text`}>{order.status}</span></p>
                <p><strong>Fecha:</strong> {order.timestamp?.toDate().toLocaleString()}</p>

                <h4>Productos:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>{item.name} (x{item.quantity})</li>
                  ))}
                </ul>

                <div className="order-actions">
                  {currentUser && (currentUser.role === 'admin' || currentUser.role === 'comandera') && (
                    <>
                      <button onClick={() => updateOrderStatus(order.id, 'preparing')}>En Preparación</button>
                      <button onClick={() => updateOrderStatus(order.id, 'ready')}>Listo</button>
                      <button onClick={() => updateOrderStatus(order.id, 'delivered')}>Entregado</button>
                      {/* Botón renombrado como se solicitó */}
                      <button className="btn-paid" onClick={() => updateOrderStatus(order.id, 'paid')}>Cobrar y Cerrar</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersModal;
