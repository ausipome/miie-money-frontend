'use client';

import React, { useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import Cookies from 'js-cookie';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const StripeSubscriptionCheckout = () => {
// Memoized stripePromise to once
const stripePromise = useMemo(() => {
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey) {
      throw new Error('Stripe publishable key is not defined');
    }
    return loadStripe(stripeKey);
  }, []);

    const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');

  // Function to fetch the client secret from the server
  const fetchClientSecret = async () => {
    try {
      const response = await fetch('/api/account/create-subscription-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': xsrfToken,
          },
          credentials: 'include',
        body: JSON.stringify({
          price_id: 'price_1R4HP4FNhYBPKrsN7qxeu9U6', 
        }),
      });
      const data = await response.json();
      return data.client_secret; 
    } catch (error) {
      console.error('Error fetching client secret:', error);
    }
  };

  const options = { fetchClientSecret };

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout className='p-10'/>
    </EmbeddedCheckoutProvider>
  );
};

export default StripeSubscriptionCheckout;
