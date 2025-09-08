import React from 'react';
import MenuItem from './MenuItem';
import { getAvailableItems, categories } from '../data/products';
import '../styles/Menu.css';

// El prop ahora es "mode" en lugar de "isGuest"
const Menu = ({ activeCategory, setActiveCategory, mode }) => {

  // La lógica de notificación para invitados ya no es necesaria aquí.

  const availableItems = getAvailableItems();

  const finalFilteredItems = activeCategory === 'all'
    ? availableItems
    : availableItems.filter(item => item.category === activeCategory);

  return (
    <section className="menu-section container">
      <h2 className="section-title">Nuestro Menú</h2>
      
      <div className="menu-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`tab-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="menu-grid">
        {finalFilteredItems.map(item => (
          <MenuItem 
            key={item.id} 
            item={item} 
            mode={mode} // Pasar el modo al componente hijo
          />
        ))}
      </div>
    </section>
  );
};

export default Menu;