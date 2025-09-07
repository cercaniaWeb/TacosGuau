import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';
import '../styles/Header.css';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import AdminOrdersModal from './AdminOrdersModal'; // Import AdminOrdersModal

const Header = () => {
  const { getCartCount } = useCart();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false); // New state for admin modal

  const { currentUser } = useAuth(); // Get current user from AuthContext

  const toggleCartModal = () => {
    setIsCartModalOpen(!isCartModalOpen);
  };

  const toggleAdminModal = () => { // New function to toggle admin modal
    setIsAdminOpen(!isAdminModalOpen);
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-title-container">
            <img src="/logo.png" alt="Tacos Guau Logo" className="header-logo" />
            <h1 className="header-title">Tacos Guau</h1>
          </div>
          
          {/* Admin Panel Button - visible only to admins and comanderas */}
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'comandera') && (
            <button className="admin-panel-btn" onClick={toggleAdminModal}>
              <i className="fas fa-cogs"></i> Admin Panel
            </button>
          )}

          <div className="cart-icon-container" onClick={toggleCartModal}>
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{getCartCount()}</span>
          </div>
        </div>
      </header>
      <CartModal isOpen={isCartModalOpen} onClose={toggleCartModal} />
      <AdminOrdersModal isOpen={isAdminModalOpen} onClose={toggleAdminModal} /> {/* Render AdminOrdersModal */}
    </>
  );
};

export default Header;
