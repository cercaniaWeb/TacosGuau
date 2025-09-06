// src/components/CheckoutForm.js
import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
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

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      // TODO: Send paymentMethod.id to your server.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="form-row">
        <label htmlFor="card-element">
          Tarjeta de Crédito o Débito
        </label>
        <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
      </div>
      <button type="submit" disabled={!stripe} className="stripe-button">
        Pagar
      </button>
    </form>
  );
};

export default CheckoutForm;