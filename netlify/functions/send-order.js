const nodemailer = require('nodemailer');
const path = require('path');

// --- Configuración de Nodemailer ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Tu email de Gmail (desde variable de entorno)
    pass: process.env.GMAIL_PASS   // Tu contraseña de aplicación de Gmail (desde variable de entorno)
  }
});

// --- Plantilla de Correo HTML ---
const generateOrderEmailHtml = ({ name, phone, email, notes, items, total, paymentMethod, recipientType }) => {
  const itemsHtml = items.map(item => `
    <tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 10px;">${item.name}</td>
      <td style="padding: 10px; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; text-align: right;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  const paymentStatus = (paymentMethod === 'cash' || paymentMethod === 'transfer')
    ? '<span style="background-color: #ffc107; padding: 5px 10px; border-radius: 5px; color: #333;">Pendiente de Pago</span>'
    : '<span style="background-color: #28a745; padding: 5px 10px; border-radius: 5px; color: white;">Pagado</span>';

  const subject = recipientType === 'business' ? '¡Nuevo Pedido Recibido!' : 'Confirmación de tu Pedido en Tacos Guau';
  const headerText = recipientType === 'business' ? '¡Has recibido un nuevo pedido!' : `¡Gracias por tu pedido, ${name}!`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 20px; }        .header img { max-width: 150px; }
        .footer { text-align: center; margin-top: 20px; font-size: 0.8em; color: #777; }
        table { width: 100%; border-collapse: collapse; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="Logo Don Panda">
          <h2>${headerText}</h2>
        </div>
        
        <h3>Detalles del Pedido</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
        <p><strong>Notas:</strong> ${notes || 'Ninguna'}</p>
        
        <hr style="margin: 20px 0;">

        <h3>Resumen de la Compra</h3>
        <table>
          <thead>
            <tr>
              <th style="padding: 10px; text-align: left;">Producto</th>
              <th style="padding: 10px;">Cantidad</th>
              <th style="padding: 10px; text-align: right;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <h3 style="text-align: right; margin-top: 20px;">Total: $${total.toFixed(2)}</h3>

        <hr style="margin: 20px 0;">

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>Método de Pago:</strong> ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
          </div>
          <div>
            <strong>Estado:</strong> ${paymentStatus}
          </div>
        </div>

        <div class="footer">
          <p>Tacos Guau & Don Panda Birria</p>
          <p>Gracias por tu preferencia.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const { name, phone, email, notes, items, total, paymentMethod } = JSON.parse(event.body);

    // Ruta al logo (asumiendo que está en la carpeta public de tu proyecto React)
    // En Netlify Functions, los archivos estáticos no son directamente accesibles así.
    // Para el logo, lo mejor es subirlo a un CDN o usar base64 si es pequeño.
    // Por simplicidad, para Netlify Functions, usaremos una URL pública o lo incrustaremos en base64.
    // Para este ejemplo, mantendremos el CID y asumiremos que el logo se manejará en el build de Netlify.
    // Sin embargo, para un entorno real, deberías considerar subir el logo a un CDN o incrustarlo en base64.
    // Por ahora, la ruta relativa no funcionará directamente en la función serverless.
    // La forma más sencilla para Netlify Functions es que el logo sea parte del bundle de la función o esté en un CDN.
    // Para este ejemplo, vamos a simular que el logo está disponible para la función.
    // En un entorno real, la ruta del logo dentro de una función serverless es más compleja.
    // La forma más robusta es usar una URL pública para la imagen o incrustarla en base64.
    // Para este ejercicio, vamos a cambiar la forma en que se referencia el logo en el HTML.
    // En lugar de CID, usaremos una URL directa.
    // Esto significa que el logo debe estar en la carpeta `public` de tu proyecto React.
    // Y la URL en el correo será `https://tu-dominio.netlify.app/logopanda.png`.
    // Por lo tanto, la plantilla HTML debe cambiar para usar una URL directa en lugar de CID.
    // Voy a modificar la plantilla HTML para usar una URL directa para el logo.
    // Y eliminaré la sección `attachments` de `mailOptions`.

    // La URL del logo en Netlify será tu dominio + /logopanda.png
    // Por ejemplo: https://tacos-guau.netlify.app/logopanda.png
    // Necesitarás reemplazar [TU_SITIO_NETLIFY] con el nombre de tu sitio en Netlify.
    const netlifySiteUrl = process.env.NETLIFY_SITE_URL || 'https://your-netlify-site.netlify.app'; // Configura esto en Netlify
    const logoUrl = `${netlifySiteUrl}/logopanda.png`;

    // 1. Enviar correo al negocio
    const businessMailOptions = {
      from: '"Pedidos Tacos Guau" <cercaniaweb@gmail.com>',
      to: 'cercaniaweb@gmail.com',
      subject: '¡Nuevo Pedido Recibido!',
      html: generateOrderEmailHtml({ ...JSON.parse(event.body), recipientType: 'business', logoUrl }),
    };

    await transporter.sendMail(businessMailOptions);
    console.log('Correo al negocio enviado.');

    // 2. Enviar correo de confirmación al cliente (si proporcionó un email)
    if (email) {
      const customerMailOptions = {
        from: '"Tacos Guau & Don Panda" <cercaniaweb@gmail.com>',
        to: email,
        subject: 'Confirmación de tu Pedido en Tacos Guau',
        html: generateOrderEmailHtml({ ...JSON.parse(event.body), recipientType: 'customer', logoUrl }),
      };

      await transporter.sendMail(customerMailOptions);
      console.log('Correo al cliente enviado.');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Procesamiento de pedido iniciado.' }),
    };
  } catch (error) {
    console.error('Error al procesar el pedido:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al procesar el pedido.' }),
    };
  }
};
