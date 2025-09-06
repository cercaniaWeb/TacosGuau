import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';
import '../styles/Header.css';

const Header = () => {
  const { getCartCount } = useCart();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const toggleCartModal = () => {
    setIsCartModalOpen(!isCartModalOpen);
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-title-container">
            <img src="/logo.png" alt="Tacos Guau Logo" className="header-logo" />
            <h1 className="header-title">Tacos Guau</h1>
          </div>
          <div className="cart-icon-container" onClick={toggleCartModal}>
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{getCartCount()}</span>
          </div>
        </div>
      </header>
      <CartModal isOpen={isCartModalOpen} onClose={toggleCartModal} />
    </>
  );
};

export default Header;
