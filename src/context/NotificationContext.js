import React, { createContext, useContext, useState } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ message: null, type: null });

  const showNotification = (message, type = 'info') => {
    console.log('Setting notification:', { message, type }); // Added console.log
    setNotification({ message, type });
    setTimeout(() => {
      console.log('Clearing notification after 3 seconds'); // Added console.log
      setNotification({ message: null, type: null });
    }, 3000);
  };

  const closeNotification = () => {
    console.log('Closing notification manually'); // Added console.log
    setNotification({ message: null, type: null });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <Notification 
        message={notification.message} 
        type={notification.type} 
        onClose={closeNotification} 
      />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
