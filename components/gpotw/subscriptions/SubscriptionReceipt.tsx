'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import StripeSubscriptionCheckout from '@/components/gpotw/subscriptions/SecureSubscription';
import Cookies from 'js-cookie';

// Define a type for the expected session data
interface SessionData {
  session_status: 'open' | 'complete';
  customer_name?: string;
  customer_email?: string;
  error?: string;
}

const SubscriptionReceipt: React.FC = () => {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');

  useEffect(() => {
    const initialize = async (): Promise<void> => {
    const sessionId = searchParams.get('session_id');
     
      if (!sessionId) {
        setError('No session found.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/account/get-subscription-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': xsrfToken,
              },
              credentials: 'include',
            body: JSON.stringify({
                session_id: sessionId, 
            }),
          });
        const sessionData: SessionData = await response.json();
        if (response.ok) {
          setSession(sessionData);
        } else {
          throw new Error(sessionData.error || 'Failed to fetch session details');
        }
      } catch (err: any) { // Catching type any since Error object doesn't necessarily cover all cases
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (session) {
    if (session.session_status === 'open') {
      // Redirect or re-mount the checkout component
      return (
        <div>
          <h1>Payment Not Complete</h1>
          <p>Please complete your payment:</p>
          <StripeSubscriptionCheckout />
        </div>
      );
    } else if (session.session_status === 'complete') {
      return (
        <div>
          <h1>Payment Successful!</h1>
          <p>Thank you for your purchase, {session.customer_name}.</p>
          <p>Your email: {session.customer_email}</p>
        </div>
      );
    }
  }

  // Default return in case no conditions are met
  return <p>Unexpected status. Please contact support.</p>;
};

export default SubscriptionReceipt;
