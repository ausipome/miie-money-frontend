import React, { useState, useEffect } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm({ invoiceId }: { invoiceId: string | null }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Stripe initialized:", stripe);
    console.log("Elements initialized:", elements);
  }, [stripe, elements]);

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      console.log("Stripe.js has not loaded yet");
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Change this to your payment completion page
        return_url: `http://localhost:3000/payment-receipt?invoice=${invoiceId}`,
      },
    });

    if (error) {
      setMessage(error.message || "An unknown error occurred");
    } else {
      setMessage("Payment processing...");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="text-center">
      <PaymentElement />
      <button className="stdButton" disabled={!stripe || isLoading}>
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
      {message && <div className="text-red-600 mt-2">{message}</div>}
    </form>
  );
}
