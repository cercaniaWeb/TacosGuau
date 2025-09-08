// netlify/functions/create-payment-intent.js

// Carga la clave secreta desde las variables de entorno de Netlify
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Solo aceptar peticiones POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { total } = JSON.parse(event.body);

    // Stripe requiere el monto en la unidad más pequeña (centavos)
    const amountInCents = Math.round(total * 100);

    // Crea una "intención de pago" en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'mxn', // Moneda mexicana
      payment_method_types: ['card'],
    });

    // Devuelve el "client_secret" al frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
