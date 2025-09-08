import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';
import AdminOrdersModal from './AdminOrdersModal';
import ComandaModal from './ComandaModal';
import LoginModal from './LoginModal'; // Importar modal de login
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

const Header = ({ mode }) => {
  const { getCartCount } = useCart();
  const { currentUser, logout } = useAuth(); // Obtener usuario y función de logout

  // Estados para todos los modales
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isComandaModalOpen, setIsComandaModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Estado para el login

  const [isFloating, setIsFloating] = useState(false);

  // --- Handlers para Modales ---
  const toggleCartModal = () => {
    if (mode === 'in-store') return; // No abrir el carrito en modo local
    setIsCartModalOpen(!isCartModalOpen);
  };

  const toggleAdminModal = () => setIsAdminModalOpen(!isAdminModalOpen);
  const toggleLoginModal = () => setIsLoginModalOpen(!isLoginModalOpen);

  const openComandaModal = () => {
    setIsAdminModalOpen(false);
    setIsComandaModalOpen(true);
  };

  const closeComandaModal = () => setIsComandaModalOpen(false);

  // --- Efecto para el carrito flotante ---
  useEffect(() => {
    const handleScroll = () => {
      setIsFloating(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cierra el modal de login si el usuario inicia sesión exitosamente
  useEffect(() => {
    if (currentUser && isLoginModalOpen) {
      setIsLoginModalOpen(false);
    }
  }, [currentUser, isLoginModalOpen]);

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-title-container">
            <img src="/logo.png" alt="Tacos Guau Logo" className="header-logo" />
            <h1 className="header-title">Tacos Guau</h1>
          </div>
          
          <div className="header-controls">
            {/* Controles de Sesión */}
            <div className="session-controls">
              {currentUser ? (
                <>
                  <span className="user-email">{currentUser.email}</span>
                  <button onClick={logout} className="session-btn">Cerrar Sesión</button>
                </>
              ) : (
                mode === 'online' && (
                  <button onClick={toggleLoginModal} className="session-btn">Iniciar Sesión</button>
                )
              )}
            </div>

            {/* Panel de Control para Admin/Comandera */}
            {currentUser && (currentUser.role === 'admin' || currentUser.role === 'comandera') && (
              <button className="admin-panel-btn" onClick={toggleAdminModal}>
                <i className="fas fa-cogs"></i> Panel de Control
              </button>
            )}

            {/* Carrito de Compras */}
            <div 
              className={`cart-icon-container ${isFloating ? 'floating' : ''} ${mode === 'in-store' ? 'disabled' : ''}`}
              onClick={toggleCartModal}
            >
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-count">{getCartCount()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Renderizado de todos los modales */}
      {mode === 'online' && <CartModal isOpen={isCartModalOpen} onClose={toggleCartModal} />}
      <LoginModal isOpen={isLoginModalOpen} onClose={toggleLoginModal} />
      
      {currentUser && (
        <>
          <AdminOrdersModal 
            isOpen={isAdminModalOpen} 
            onClose={toggleAdminModal} 
            onNewComandaClick={openComandaModal} 
          />
          <ComandaModal 
            isOpen={isComandaModalOpen} 
            onClose={closeComandaModal} 
          />
        </> 
      )}
    </>
  );
};

export default Header;
