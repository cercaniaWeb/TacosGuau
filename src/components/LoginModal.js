import React from 'react';
import Login from './Login';
import '../styles/LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <Login />
      </div>
    </div>
  );
};

export default LoginModal;
