// src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import OrderForm from './components/OrderForm';
import BusinessInfo from './components/BusinessInfo';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import './App.css';

import { NotificationProvider } from './context/NotificationContext';

function App() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <NotificationProvider>
      <CartProvider>
        <div className="App">
          <Header />
          <Hero />
          <Menu activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          <BusinessInfo />
          <Footer />
        </div>
      </CartProvider>
    </NotificationProvider>
  );
}

export default App;