'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import useCheckUser from '../../hooks/useCheckUser';
import Link from 'next/link';
import { Card } from '@nextui-org/card';
import { Skeleton } from '@nextui-org/skeleton';

export default function AccountMain() {
    const [xsrfToken, setXsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');
    const [stripeAccountId, setStripeAccountId] = useState<string | undefined>(undefined);
    const [requiredInfo, setRequiredInfo] = useState<boolean>(false);
    const { userData, error, loading, setLoading } = useCheckUser();

    useEffect(() => { 

        if (userData?.stripe_account_id) {
            setStripeAccountId(userData?.stripe_account_id);
            const getConnected = async () => {
              const response = await fetch('/api/account/get-connected', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'X-CSRF-Token': xsrfToken,
                  },
                  credentials: 'include',
                  body: JSON.stringify({
                    account: userData?.stripe_account_id,
                  }),
              });
      
              if (response.ok) {
                const data = await response.json();
                if(data.requirements.currently_due.length > 0){setRequiredInfo(true)}
            } else {
                const errorData = await response.json();
            }
            };
            getConnected();

        }

        }, [userData]);

        if (loading) { 
            return (
              <div className="flex flex-col items-center h-screen w-full gap-6 bg-gray-100">
                {/* Full-screen skeleton container */}
                <Card className="w-[90%] max-w-3xl space-y-6 p-6" radius="lg">
                  {/* Emulating a large image or content box */}
                  <Skeleton isLoaded={!loading} className="rounded-lg">
                    <div className="h-64 w-full rounded-lg bg-secondary"></div>
                  </Skeleton>
          
                  <div className="space-y-4">
                    {/* Emulating text rows */}
                    <Skeleton isLoaded={!loading} className="w-full rounded-lg">
                      <div className="h-6 w-full rounded-lg bg-secondary"></div>
                    </Skeleton>
                    <Skeleton isLoaded={!loading} className="w-4/5 rounded-lg">
                      <div className="h-6 w-full rounded-lg bg-secondary-300"></div>
                    </Skeleton>
                    <Skeleton isLoaded={!loading} className="w-3/5 rounded-lg">
                      <div className="h-6 w-full rounded-lg bg-secondary-200"></div>
                    </Skeleton>
                  </div>
                </Card>
              </div>
            );
          }
      
          if (error) { return <div>Error: {error.message}</div>; }    

    return (
        <>
            {stripeAccountId && requiredInfo && 
                    <div className="bg-blue-500 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
                        <p className="text-center">
                            We partner with Stripe for payment processing and compliance. To ensure seamless payment processing, we occasionally need additional information from you. <br />
                            Currently, there is some outstanding information required for your account. Please visit <Link href="/account/verification" className="text-pink-200 underline">here </Link> 
                            to provide the necessary details and avoid any disruptions to your payment processing.
                        </p>
                    </div>
                }

                {!stripeAccountId && 
                    <div className="bg-blue-500 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
                        <p className="text-center">
                            We partner with Stripe for payment processing and compliance. To complete the setup of your payment processing account, we need some additional information from you. <br />
                            Please visit <Link href="/account/verification" className="text-pink-200 underline">here</Link> to provide the required details and ensure uninterrupted payment processing.
                        </p>
                    </div>
                }
        </>
    );

}