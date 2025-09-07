import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';
import '../styles/Header.css';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import AdminOrdersModal from './AdminOrdersModal'; // Import AdminOrdersModal

const Header = ({ isGuest }) => {
  const { getCartCount } = useCart();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);

  const { currentUser } = useAuth(); // Get current user from AuthContext

  const toggleCartModal = () => {
    if (isGuest) return; // No abrir el carrito para invitados
    setIsCartModalOpen(!isCartModalOpen);
  };

  const toggleAdminModal = () => {
    setIsAdminModalOpen(!isAdminModalOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) { // Aparece después de 150px de scroll
        setIsFloating(true);
      } else {
        setIsFloating(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-title-container">
            <img src="/logo.png" alt="Tacos Guau Logo" className="header-logo" />
            <h1 className="header-title">Tacos Guau</h1>
          </div>
          
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'comandera') && (
            <button className="admin-panel-btn" onClick={toggleAdminModal}>
              <i className="fas fa-cogs"></i> Admin Panel
            </button>
          )}

          <div 
            className={`cart-icon-container ${isFloating ? 'floating' : ''} ${isGuest ? 'disabled' : ''}`}
            onClick={toggleCartModal}
          >
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{getCartCount()}</span>
          </div>
        </div>
      </header>
      {!isGuest && <CartModal isOpen={isCartModalOpen} onClose={toggleCartModal} />}
      {currentUser && <AdminOrdersModal isOpen={isAdminModalOpen} onClose={toggleAdminModal} />}
    </>
  );
};

export default Header;
