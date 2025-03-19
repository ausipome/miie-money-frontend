'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import StripeSubscriptionCheckout from '@/components/gpotw/subscriptions/SecureSubscription';
import Cookies from 'js-cookie';
import Link from 'next/link';

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
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto text-center mt-6">
       <h1>Payment Successful!</h1>
       <p>Thank you for your purchase, {session.customer_name}.</p>
       <p>You are now welcome to explore our full resources at the <Link href="/academy" className="text-pink-200 underline">Business Academy</Link></p>
    </div>


        
      );
    }
  }

  // Default return in case no conditions are met
  return <p>Unexpected status. Please contact support.</p>;
};

export default SubscriptionReceipt;
