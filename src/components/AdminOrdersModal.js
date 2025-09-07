import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import '../styles/AdminOrdersModal.css'; // Necesitarás crear este archivo CSS
import { useAuth } from '../context/AuthContext'; // Import useAuth

const AdminOrdersModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth(); // Get current user
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isOpen) return; // Solo escuchar si el modal está abierto

    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    });

    return () => unsubscribe(); // Limpiar el listener al desmontar
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
        <button className="admin-close-btn" onClick={onClose}>&times;</button>
        <h2>Gestión de Pedidos</h2>

        {orders.length === 0 ? (
          <p>No hay pedidos pendientes.</p>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <h3>Pedido ID: {order.id}</h3>
                <p><strong>Cliente:</strong> {order.name}</p>
                {order.customerAlias && <p><strong>Alias/Mesa:</strong> {order.customerAlias}</p>}
                <p><strong>Teléfono:</strong> {order.phone}</p>
                {order.email && <p><strong>Email:</strong> {order.email}</p>}
                <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                <p><strong>Método de Pago:</strong> {order.paymentMethod}</p>
                <p><strong>Notas:</strong> {order.notes || 'Ninguna'}</p>
                <p><strong>Estado:</strong> <span className={`status-${order.status}`}>{order.status}</span></p>
                <p><strong>Fecha:</strong> {order.timestamp?.toDate().toLocaleString()}</p>

                <h4>Productos:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>{item.name} (x{item.quantity}) - ${item.price.toFixed(2)}</li>
                  ))}
                </ul>

                <div className="order-actions">
                  {currentUser && currentUser.role === 'admin' && (
                    <>
                      <button onClick={() => updateOrderStatus(order.id, 'preparing')}>En Preparación</button>
                      <button onClick={() => updateOrderStatus(order.id, 'ready')}>Listo para Recoger</button>
                      <button onClick={() => updateOrderStatus(order.id, 'delivered')}>Entregado</button>
                    </>
                  )}
                  {currentUser && currentUser.role === 'comandera' && (
                    <button onClick={() => updateOrderStatus(order.id, 'paid')}>Marcar como Cobrado</button>
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