import React from 'react';
import '../styles/Notification.css';

const Notification = ({ message, type, onClose }) => {
  if (!message) {
    return null;
  }

  let iconClass = '';
  let title = '';

  switch (type) {
    case 'success':
      iconClass = 'fas fa-check-circle';
      title = 'Éxito';
      break;
    case 'error':
      iconClass = 'fas fa-times-circle';
      title = 'Error';
      break;
    case 'info':
      iconClass = 'fas fa-info-circle';
      title = 'Información';
      break;
    default:
      iconClass = 'fas fa-bell';
      title = 'Notificación';
  }

  return (
    <div className={`notification ${type}`}>
      <div className="notification-content">
        <i className={`notification-icon ${iconClass}`}></i>
        <div className="notification-text">
          <h4>{title}</h4>
          <p>{message}</p>
        </div>
      </div>
      <button className="close-notification-btn" onClick={onClose}>&times;</button>
    </div>
  );
};

export default Notification;