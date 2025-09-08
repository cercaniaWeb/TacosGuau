import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import '../styles/CheckoutForm.css';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = ({ onSuccessfulCheckout }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { getCartTotal } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Crear la intención de pago en el backend
      const res = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ total: getCartTotal() }),
      });

      if (!res.ok) {
        throw new Error('No se pudo conectar con el servidor de pagos.');
      }

      const { clientSecret } = await res.json();

      // 2. Confirmar el pago en el frontend con el clientSecret
      const cardElement = elements.getElement(CardElement);
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (paymentError) {
        setErrorMessage(paymentError.message);
        setIsProcessing(false);
        return;
      }

      // 3. Si el pago es exitoso, ejecutar la lógica final
      if (paymentIntent.status === 'succeeded') {
        console.log('Pago exitoso!', paymentIntent);
        onSuccessfulCheckout(); // Llama a la función del padre para finalizar la orden
      }

    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="form-row">
        <label htmlFor="card-element">Datos de la Tarjeta</label>
        <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
      </div>
      
      {errorMessage && <div className="card-errors">{errorMessage}</div>}
      
      <button type="submit" disabled={!stripe || isProcessing} className="stripe-button">
        {isProcessing ? 'Procesando...' : `Pagar $${getCartTotal().toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
