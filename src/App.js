// src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import BusinessInfo from './components/BusinessInfo';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import './App.css';

import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';

function AppContent() {
  const { currentUser } = useAuth();
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  // Si no hay usuario y no está en modo invitado, muestra el Login.
  if (!currentUser && !isGuestMode) {
    return <Login onGuestMode={() => setIsGuestMode(true)} />;
  }

  // Si hay usuario o está en modo invitado, muestra la app.
  // Pasamos el estado de invitado a los componentes que lo necesiten.
  const isGuest = !currentUser && isGuestMode;

  return (
    <div className="App">
      <Header isGuest={isGuest} />
      <Hero />
      <Menu 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        isGuest={isGuest} 
      />
      <BusinessInfo />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <CartProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </CartProvider>
    </NotificationProvider>
  );
}

export default App;