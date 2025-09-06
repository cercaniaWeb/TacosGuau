# Tacos Guau & Don Panda Birria App

¡Bienvenido a la aplicación de Tacos Guau y Don Panda Birria! Esta es una aplicación web progresiva (PWA) diseñada para permitir a los clientes explorar el menú, realizar pedidos y obtener información sobre el negocio.

## Características

Esta aplicación cuenta con las siguientes funcionalidades clave:

### 🌮 Menú Dinámico y Responsivo
- **Visualización de Productos:** Explora una amplia variedad de tacos, especialidades, birria y bebidas.
- **Categorías:** Filtra el menú por categorías (Tacos Normales, Tacos Especiales, Birria, Bebidas).
- **Diseño Responsivo:** El menú se adapta a diferentes tamaños de pantalla:
  - **Móvil:** 1 columna.
  - **Tablets:** 2 columnas.
  - **Escritorio:** 3 o 4 columnas, según el espacio disponible.
- **Imágenes de Producto:** Cada tarjeta de producto muestra una imagen visualmente atractiva con opacidad para un mejor contraste.

### ⏰ Horarios de Servicio y Disponibilidad de Productos
- **Menú Condicional:** La aplicación ajusta los productos visibles según el horario de atención:
  - **Viernes y Sábados (6 PM - 11 PM):** Solo se muestran los productos de **Tacos Guau** (categorías 'tacos' y 'especiales') y las bebidas.
  - **Sábados y Domingos (8 AM - 1 PM):** Solo se muestran los productos de **Don Panda Birria** (categoría 'birria') y las bebidas.
  - **Fuera de estos horarios:** Se muestran **todos** los productos del menú.
  - **Bebidas:** Siempre disponibles, independientemente del horario.

### 🛒 Carrito de Compras Interactivo
- **Añadir al Carrito:** Agrega productos al carrito con la cantidad deseada.
- **Actualizar Cantidad:** Modifica la cantidad de productos directamente en el carrito.
- **Eliminar Productos:** Quita productos del carrito fácilmente.
- **Total del Pedido:** Calcula y muestra el total a pagar.

### 📝 Formulario de Pedido y Pago
- **Información del Cliente:** Completa tus datos (nombre, teléfono) para el pedido.
- **Notas Adicionales:** Añade especificaciones especiales para tu pedido.
- **Métodos de Pago:**
  - **Efectivo:** Pago al recoger el pedido.
  - **Transferencia Bancaria:** Se proporciona un número de cuenta CLABE.
  - **Pago con Tarjeta (Stripe):** Integración con la pasarela de pago Stripe para pagos seguros con tarjeta de crédito/débito.
- **Copiar CLABE:** Al seleccionar la opción de transferencia, el número de cuenta CLABE se copia automáticamente al portapapeles para mayor comodidad.

### 🔔 Notificaciones Mejoradas
- **Alertas Visuales:** Recibe notificaciones claras y estilizadas para acciones como añadir productos al carrito.
- **Tipos de Notificación:** Las notificaciones se presentan con iconos y colores distintivos para éxito, error o información.

### 📍 Información del Negocio
- **Ubicación:** Dirección detallada y un mapa interactivo de Google Maps.
- **Horarios:** Horarios de atención específicos para Tacos Guau y Don Panda Birria.
- **Promociones:** Información sobre ofertas especiales.
- **Contacto:** Número de teléfono y enlaces a redes sociales.

### 📱 Aplicación Web Progresiva (PWA)
- **Instalable:** La aplicación puede ser instalada directamente desde el navegador a la pantalla de inicio de tu dispositivo móvil o escritorio, funcionando como una aplicación nativa.
- **Soporte Offline:** Gracias a un Service Worker robusto (implementado con Workbox), la aplicación puede funcionar sin conexión a internet, ofreciendo una experiencia rápida y fiable.

## Tecnologías Utilizadas

- **React:** Biblioteca de JavaScript para construir interfaces de usuario.
- **CSS:** Estilos personalizados para un diseño moderno y atractivo.
- **Stripe:** Plataforma de pagos para procesar transacciones con tarjeta.
- **Workbox:** Librería de Google para la gestión de Service Workers y funcionalidades PWA.
- **Font Awesome:** Librería de iconos para elementos visuales.

## Instalación y Configuración

Para ejecutar este proyecto localmente, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd tacos-guau-app
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura tu clave pública de Stripe:**
    Abre `src/components/CartModal.js` y reemplaza `pk_test_51S1ix4JHi6uvfAaFBSURmPS18ihdxP49gsVKA6hCtcWVbFI4i1eekczhUfpCwRiF66JN60B5EgnkOTo2rKhTh3CU003p48oloN` con tu propia clave pública de Stripe.

4.  **Prepara las imágenes de producto:**
    Asegúrate de que las imágenes de los productos estén en la ruta `public/imagenes-tacoguau/` y sigan la convención de nombres esperada (ej. `taco-SuaderoArracheraPollo.jpeg`).

5.  **Prepara los iconos de la PWA:**
    Coloca tus iconos `logo.png` (192x192px y 512x512px) en la carpeta `public/`.

## Uso

### Modo Desarrollo

Para iniciar la aplicación en modo desarrollo:

```bash
npm start
```

Esto abrirá la aplicación en `http://localhost:3000` (o un puerto disponible).

### Modo Producción (para probar PWA)

Para construir la aplicación para producción y probar las funcionalidades PWA:

1.  **Construye la aplicación:**
    ```bash
    npm run build
    ```

2.  **Sirve la aplicación construida:**
    ```bash
    npx serve -s build
    ```
    Esto iniciará un servidor local que servirá los archivos de producción. Abre la URL proporcionada en tu navegador para probar la PWA.

## Contribución

Si deseas contribuir a este proyecto, por favor, sigue las prácticas estándar de desarrollo de React.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
