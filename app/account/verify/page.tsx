'use client';

import { useAuth } from '@/hooks/useAuth';
import CreateStripeAccount from '../../../components/miieUser/verify';
import { useEffect } from 'react';


export default function Page() {
    const { xsrfToken, emailAddress } = useAuth();

    useEffect(() => {
        const checkUser = async (email: string | '') => {
            try {
              const response = await fetch('/api/account/get-account', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': xsrfToken, 
                },
                credentials: 'include',
                body: JSON.stringify({ email }),
              });
          
              const data = await response.json();
              
              if (response.ok) {
                console.log('Account Details:', data);
              } else {
                console.error('Error fetching account details:', data.error);
              }
            } catch (error) {
              console.error('Request failed:', error);
            }
          };

        checkUser(emailAddress);
    }, [xsrfToken]);

    return <CreateStripeAccount />
}