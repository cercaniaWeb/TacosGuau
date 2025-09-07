// src/components/Menu.js
import React, { useEffect } from 'react';
import MenuItem from './MenuItem';
import '../styles/Menu.css';
import { useNotification } from '../context/NotificationContext'; // Import useNotification

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const isProductAvailable = (product) => {
  const now = new Date();
  const currentDay = DAYS[now.getDay()];
  const currentHour = now.getHours();

  if (product.category === 'bebidas') {
    return true; // Water is always available
  }

  if (!product.availableHours) {
    return false; // If no hours defined, assume not available
  }

  for (const schedule of product.availableHours) {
    if (schedule.day === currentDay) {
      if (currentHour >= schedule.startHour && currentHour < schedule.endHour) {
        return true;
      }
    }
  }
  return false;
};

const isBusinessOpenNow = (allItems) => {
  return allItems.some(item => isProductAvailable(item));
};

const getImageName = (item) => {
  let baseName = '';
  if (item.category === 'tacos' || item.category === 'especiales') {
    baseName = `taco-${item.description.replace(/[\s,]+/g, '')}`;
  } else if (item.category === 'birria') {
    if (item.name === "Taco de birria") return "taco-birriaderes";
    if (item.name === "Quesa-birria") return "taco-Birriaconquesofundido";
    if (item.name === "Plato de birria") return "taco-Birriaderesconconsomé";
    if (item.name === "Consomé plato chico") return "Consomédebirria";
    if (item.name === "Consomé plato grande") return "Consomédebirriagrande";
  } else if (item.category === 'bebidas') {
    if (item.name === "Agua de sabor ½ Lt") return "aguamedio";
    if (item.name === "Agua de sabor 1 Lt") return "agua1lt";
  }
  // Fallback for other tacos
  if (item.name === "Taco Rottweiler") return "taco-suadero";
  if (item.name === "Taco Doberman") return "taco-arrachera";
  if (item.name === "Taco Galgo") return "taco-longaniza";
  if (item.name === "Taco Dogo Argentino") return "taco-chorizoargentino";
  if (item.name === "Taco Podle") return "taco-pechugadepollo";
  if (item.name === "Taco Boxer") return "taco-chistorra";
  if (item.name === "Taco Perro hambriento") return "taco-SuaderoArracheraPollo";
  if (item.name === "Taco Perruno") return "taco-ArracheraconChistorra";
  if (item.name === "Taco Rabioso") return "taco-SuaderoconLonganiza";
  if (item.name === "Taco canino") return "taco-ArracheraconLonganiza";
  if (item.name === "Taco Cachorro") return "taco-PechugadePolloyLonganiza";

  return baseName;
};

const getImageUrl = (item) => {
  const imageName = getImageName(item);
  if (imageName) {
    // Check for both .jpeg and .jpg
    const jpegPath = `/imagenes-tacoguau/${imageName}.jpeg`;
    const jpgPath = `/imagenes-tacoguau/${imageName}.jpg`;
    // In a real app, you would check if the file exists.
    // For now, we'll assume .jpeg is the primary, and if not found, .jpg might be used.
    // This is a simplification due to environment limitations.
    return jpegPath;
  }
  return null;
};

const Menu = ({ activeCategory, setActiveCategory, isGuest }) => {
  const { showNotification } = useNotification();

  useEffect(() => {
    if (isGuest) {
      const timer = setTimeout(() => {
        showNotification(
          'Modo invitado: Para ordenar, necesitarás iniciar sesión.',
          'info',
          5000 // La notificación dura 5 segundos
        );
      }, 1000); // Muestra la notificación 1 segundo después de que el componente se monte

      return () => clearTimeout(timer);
    }
  }, [isGuest, showNotification]);

  // Productos REALES de Tacos Guau según las imágenes
  const tacosGuau = [
    {
      id: 1,
      name: "Taco Rottweiler",
      description: "Suadero",
      price: 19,
      category: "tacos",
      availableHours: [
        { day: "Friday", startHour: 18, endHour: 23 },
        { day: "Saturday", startHour: 18, endHour: 23 }
      ]
    },
    {
      id: 2,
      name: "Taco Doberman",
      description: "Arrachera",
      price: 19,
      category: "tacos",
      availableHours: [
        { day: "Friday", startHour: 18, endHour: 23 },
        { day: "Saturday", startHour: 18, endHour: 23 }
      ]
    },
    {
      id: 3,
      name: "Taco Galgo",
      description: "Longaniza",
      price: 19,
      category: "tacos",
      availableHours: [
        { day: "Friday", startHour: 18, endHour: 23 },
        { day: "Saturday", startHour: 18, endHour: 23 }
      ]
    },
    {
      id: 4,
      name: "Taco Dogo Argentino",
      description: "Chorizo argentino",
      price: 19,
      category: "tacos",
      availableHours: [
        { day: "Friday", startHour: 18, endHour: 23 },
        { day: "Saturday", startHour: 18, endHour: 23 }
      ]
    },
    {
      id: 5,
      name: "Taco Podle",
      description: "Pechuga de pollo",
      price: 19,
      category: "tacos",
      availableHours: [
        { day: "Friday", startHour: 18, endHour: 23 },
        { day: "Saturday", startHour: 18, endHour: 23 }
      ]
    },
    {
      id: 6,
      name: "Taco Boxer",
      description: "Chistorra",
      price: 19,
      category: "tacos",
      availableHours: [
        { day: "Friday", startHour: 18, endHour: 23 },
        { day: "Saturday", startHour: 18, endHour: 23 }
      ]
    }
  ].map(item => {
    const newItem = { ...item, imageUrl: getImageUrl(item) };
    return newItem;
  });

  // Especiales REALES de Tacos Guau según las imágenes
  const especialesGuau = [
    {
      id: 7,
      name: "Taco Perro hambriento",
      description: "Suadero, Arrachera y Pollo",
      price: 25,
      category: "especiales",
      availableHours: [
        { day: "Friday", startHour: 18, endHour: 23 },
        { day: "Saturday", startHour: 18, endHour: 23 }
      ]
    },
    {
      id: 8,
      name: "Taco Perruno",
      description: "Arrachera con Chistorra",
      price: 25,
      category: "especiales",
      availableHours: [
        { day: "Friday", startHour: 18, endHour: 23 },
        { day: "Saturday", startHour: 18, endHour: 23 }
      ]
    },
    {
      id: 9,
      name: "Taco Rabioso",
      description: "Suadero con Longaniza",
      price: 25,
      category: "especiales",
      availableHours: [
        { day: "Friday", startHour: 18, endHour: 23 },
        { day: "Saturday", startHour: 18, endHour: 23 }
      ]
    },
    {
      id: 10,
      name: "Taco canino",
      description: "Arrachera con Longaniza",
      price: 25,
      category: "especiales",
      availableHours: [
        { day: "Friday", startHour: 18, endHour: 23 },
        { day: "Saturday", startHour: 18, endHour: 23 }
      ]
    },
    {
      id: 11,
      name: "Taco Cachorro",
      description: "Pechuga de Pollo y Longaniza",
      price: 25,
      category: "especiales",
      availableHours: [
        { day: "Friday", startHour: 18, endHour: 23 },
        { day: "Saturday", startHour: 18, endHour: 23 }
      ]
    }
  ].map(item => {
    const newItem = { ...item, imageUrl: getImageUrl(item) };
    return newItem;
  });

  // Productos REALES de Don Panda Birria según las imágenes
  const donPanda = [
    {
      id: 12,
      name: "Taco de birria",
      description: "Deliciosa birria de res",
      price: 20,
      category: "birria",
      availableHours: [
        { day: "Saturday", startHour: 8, endHour: 13 },
        { day: "Sunday", startHour: 8, endHour: 13 }
      ]
    },
    {
      id: 13,
      name: "Quesa-birria",
      description: "Birria con queso fundido",
      price: 27,
      category: "birria",
      availableHours: [
        { day: "Saturday", startHour: 8, endHour: 13 },
        { day: "Sunday", startHour: 8, endHour: 13 }
      ]
    },
    {
      id: 14,
      name: "Plato de birria",
      description: "Birria de res con consomé",
      price: 70,
      category: "birria",
      availableHours: [
        { day: "Saturday", startHour: 8, endHour: 13 },
        { day: "Sunday", startHour: 8, endHour: 13 }
      ]
    },
    {
      id: 15,
      name: "Consomé plato chico",
      description: "Consomé de birria",
      price: 15,
      category: "birria",
      availableHours: [
        { day: "Saturday", startHour: 8, endHour: 13 },
        { day: "Sunday", startHour: 8, endHour: 13 }
      ]
    },
    {
      id: 16,
      name: "Consomé plato grande",
      description: "Consomé de birria",
      price: 25,
      category: "birria",
      availableHours: [
        { day: "Saturday", startHour: 8, endHour: 13 },
        { day: "Sunday", startHour: 8, endHour: 13 }
      ]
    }
  ].map(item => {
    const newItem = { ...item, imageUrl: getImageUrl(item) };
    return newItem;
  });

  // Bebidas REALES según las imágenes
  const bebidas = [
    {
      id: 17,
      name: "Agua de sabor ½ Lt",
      description: "Refrescante agua de sabor natural",
      price: 15,
      category: "bebidas"
    },
    {
      id: 18,
      name: "Agua de sabor 1 Lt",
      description: "Refrescante agua de sabor natural",
      price: 25,
      category: "bebidas"
    }
  ].map(item => {
    const newItem = { ...item, imageUrl: getImageUrl(item) };
    return newItem;
  });

  const allItems = [...tacosGuau, ...especialesGuau, ...donPanda, ...bebidas];
  
  const now = new Date();
  const currentDay = DAYS[now.getDay()];
  const currentHour = now.getHours();

  // Determine the active menu based on current time
  let currentActiveMenu = 'all'; // Default to all products

  // Tacos Guau hours: Friday or Saturday, 6 PM to 11 PM
  const isTacosGuauTime = (currentDay === "Friday" || currentDay === "Saturday") &&
                          (currentHour >= 18 && currentHour < 23);

  // Don Panda Birria hours: Saturday or Sunday, 8 AM to 1 PM
  const isDonPandaTime = (currentDay === "Saturday" || currentDay === "Sunday") &&
                         (currentHour >= 8 && currentHour < 13);

  if (isTacosGuauTime) {
    currentActiveMenu = 'tacosGuau';
  } else if (isDonPandaTime) {
    currentActiveMenu = 'donPanda';
  }

  let itemsToDisplay = [];

  if (currentActiveMenu === 'all') {
    itemsToDisplay = allItems;
  } else if (currentActiveMenu === 'tacosGuau') {
    itemsToDisplay = allItems.filter(item => item.category === 'tacos' || item.category === 'especiales' || item.category === 'bebidas');
  } else if (currentActiveMenu === 'donPanda') {
    itemsToDisplay = allItems.filter(item => item.category === 'birria' || item.category === 'bebidas');
  }

  // Apply activeCategory filter if not 'all'
  const finalFilteredItems = activeCategory === 'all'
    ? itemsToDisplay
    : itemsToDisplay.filter(item => item.category === activeCategory);

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'tacos', name: 'Tacos Normales' },
    { id: 'especiales', name: 'Tacos Especiales' },
    { id: 'birria', name: 'Birria (Don Panda)' },
    { id: 'bebidas', name: 'Bebidas' }
  ];

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
          <MenuItem key={item.id} item={item} isGuest={isGuest} />
        ))}
      </div>
    </section>
  );
};

export default Menu;