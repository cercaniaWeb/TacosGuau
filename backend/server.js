const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// --- Configuración de Nodemailer ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cercaniaweb@gmail.com', // Tu email de Gmail
    pass: 'recn hnrj fksw ajmj'   // Tu contraseña de aplicación de Gmail
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
        .header { text-align: center; margin-bottom: 20px; }
        .header img { max-width: 150px; }
        .footer { text-align: center; margin-top: 20px; font-size: 0.8em; color: #777; }
        table { width: 100%; border-collapse: collapse; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="cid:logopanda" alt="Logo Don Panda">
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


// --- Endpoint de Órdenes ---
app.post('/api/orders', (req, res) => {
  const { name, phone, email, notes, items, total, paymentMethod } = req.body;

  const logoPath = path.join(__dirname, '..', 'public', 'logopanda.png');

  // 1. Enviar correo al negocio
  const businessMailOptions = {
    from: '"Pedidos Tacos Guau" <cercaniaweb@gmail.com>',
    to: 'cercaniaweb@gmail.com',
    subject: '¡Nuevo Pedido Recibido!',
    html: generateOrderEmailHtml({ ...req.body, recipientType: 'business' }),
    attachments: [{
      filename: 'logopanda.png',
      path: logoPath,
      cid: 'logopanda'
    }]
  };

  transporter.sendMail(businessMailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo al negocio:', error);
      // No retornamos res.status(500) para intentar enviar el correo al cliente de todas formas
    } else {
      console.log('Correo al negocio enviado:', info.response);
    }
  });

  // 2. Enviar correo de confirmación al cliente (si proporcionó un email)
  if (email) {
    const customerMailOptions = {
      from: '"Tacos Guau & Don Panda" <cercaniaweb@gmail.com>',
      to: email,
      subject: 'Confirmación de tu Pedido en Tacos Guau',
      html: generateOrderEmailHtml({ ...req.body, recipientType: 'customer' }),
      attachments: [{
        filename: 'logopanda.png',
        path: logoPath,
        cid: 'logopanda'
      }]
    };

    transporter.sendMail(customerMailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo al cliente:', error);
      } else {
        console.log('Correo al cliente enviado:', info.response);
      }
    });
  }

  // Responder inmediatamente al frontend
  res.status(200).send('Procesamiento de pedido iniciado.');
});

app.listen(port, () => {
  console.log(`Servidor de backend escuchando en http://localhost:${port}`);
});