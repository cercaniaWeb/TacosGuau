import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import BusinessInfo from './components/BusinessInfo';
import Footer from './components/Footer';
import LocationPromptModal from './components/LocationPromptModal'; // Importar el nuevo modal
import { CartProvider } from './context/CartContext';
import './App.css';

import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  // Nuevo estado: null (no decidido), 'online', o 'in-store'
  const [userMode, setUserMode] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Si el modo no ha sido seleccionado, muestra el popup de elección.
  if (!userMode) {
    return <LocationPromptModal onModeSelect={setUserMode} />;
  }

  // Una vez que se elige un modo, se renderiza la app principal.
  // El modo se pasa como prop a los componentes que lo necesiten.
  return (
    <div className="App">
      <Header mode={userMode} />
      <Hero />
      <Menu 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        mode={userMode} 
      />
      <BusinessInfo />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
