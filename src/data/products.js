// src/data/products.js

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
    return `/imagenes-tacoguau/${imageName}.jpeg`;
  }
  return null;
};

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
  // ... (otros tacos)
].map(item => ({ ...item, imageUrl: getImageUrl(item) }));

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
  // ... (otros especiales)
].map(item => ({ ...item, imageUrl: getImageUrl(item) }));

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
  // ... (otros de birria)
].map(item => ({ ...item, imageUrl: getImageUrl(item) }));

const bebidas = [
  {
    id: 17,
    name: "Agua de sabor ½ Lt",
    description: "Refrescante agua de sabor natural",
    price: 15,
    category: "bebidas"
  },
  // ... (otras bebidas)
].map(item => ({ ...item, imageUrl: getImageUrl(item) }));

export const allItems = [...tacosGuau, ...especialesGuau, ...donPanda, ...bebidas];

export const getAvailableItems = () => {
  const now = new Date();
  const currentDay = DAYS[now.getDay()];
  const currentHour = now.getHours();

  const isTacosGuauTime = (currentDay === "Friday" || currentDay === "Saturday") && (currentHour >= 18 && currentHour < 23);
  const isDonPandaTime = (currentDay === "Saturday" || currentDay === "Sunday") && (currentHour >= 8 && currentHour < 13);

  if (isTacosGuauTime) {
    return allItems.filter(item => item.category === 'tacos' || item.category === 'especiales' || item.category === 'bebidas');
  }
  if (isDonPandaTime) {
    return allItems.filter(item => item.category === 'birria' || item.category === 'bebidas');
  }
  // Fuera de horario, muestra todo para la gestión
  return allItems;
};

export const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'tacos', name: 'Tacos Normales' },
  { id: 'especiales', name: 'Tacos Especiales' },
  { id: 'birria', name: 'Birria (Don Panda)' },
  { id: 'bebidas', name: 'Bebidas' }
];
