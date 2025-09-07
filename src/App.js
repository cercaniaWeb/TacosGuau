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
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth
import Login from './components/Login'; // Import Login component

function AppContent() {
  const { currentUser } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="App">
      <Header />
      <Hero />
      <Menu activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <BusinessInfo />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <CartProvider>
        <AuthProvider> {/* Wrap the entire app with AuthProvider */}
          <AppContent /> {/* Render AppContent inside AuthProvider */}
        </AuthProvider>
      </CartProvider>
    </NotificationProvider>
  );
}

export default App;
