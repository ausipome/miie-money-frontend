// components/UserProfile.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { loadConnectAndInitialize, StripeConnectInstance } from "@stripe/connect-js";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { useRouter } from 'next/navigation'; 
import Cookies from 'js-cookie';
import useCheckUser from '../../hooks/useCheckUser';
import { Skeleton } from "@nextui-org/skeleton";
import { Card } from "@nextui-org/card";
import { Spinner } from '@nextui-org/spinner';

export default function StripeVerification() {
    const [xsrfToken, setXsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');
    const [email, setEmail] = useState(Cookies.get('email') || '');
    const [stripeAccountId, setStripeAccountId] = useState<string | undefined>(undefined);
    const [countryCode, setCountryCode] = useState<string>('gb');
    const [status, setStatus] = useState<boolean>(false);
    const { userData, error, loading, setLoading } = useCheckUser();
    const [stripeConnectInstance, setStripeConnectInstance] = useState<StripeConnectInstance | undefined>(undefined);
    const router = useRouter();



    useEffect(() => { 
      setStripeAccountId(userData?.stripe_account_id);

        if (stripeAccountId) {
            const fetchClientSecret = async () => {
              const response = await fetch('/api/account/account_session', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'X-CSRF-Token': xsrfToken,
                  },
                  credentials: 'include',
                  body: JSON.stringify({
                    stripe_account_id: stripeAccountId,
                  }),
              });
      
              if (!response.ok) {
                // Handle errors on the client side here
                const { error } = await response.json();
                throw new Error(`An error occurred: ${error}`);
              } else {
                const { client_secret: clientSecret } = await response.json();
                return clientSecret;
              }
            };
      
            setStripeConnectInstance(
              loadConnectAndInitialize({
                publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
                fetchClientSecret,
                appearance: {
                  variables: {
                    buttonPrimaryColorBackground: "#3B82F6",
                    buttonPrimaryColorText: "#ffffff",
                    fontSizeBase: "20px",
                    spacingUnit: "15px",
                  },
                },
              })
            );
            setStripeAccountId(stripeAccountId);
        }

    }, [userData,stripeAccountId]);

    const createConnected = async () => {
        setStatus(true);
        try {
            const response = await fetch('/api/account/create-connected', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': xsrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ email, countryCode }),
            });

            if (response.ok) {
              const data = await response.json();
                setStatus(false);
                setStripeAccountId(data.account_id);
            } else {
                setStatus(false);
            }
        } catch (error: any) {
            setStatus(false);
        }
    };

    const updateAccount = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/account/update-connected', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': xsrfToken,
            },
            credentials: 'include',
            body: JSON.stringify({
              stripe_account_id: stripeAccountId,
              email: email,
            }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('update Success', data);
        } else {
          setLoading(false);
        }
    } catch (error: any) {
      setLoading(false);
    }finally{
      setLoading(false);
      router.push('/account');
    }
    };

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

    if (!stripeAccountId){ 
      return(
        <>
        <div className="bg-blue-500 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
          <p className="text-center">
            Please create your Stripe account to complete the setup and enable payment processing on your account.
          </p>
        </div>
        <div className="flex flex-col items-center mt-4 text-lg">
          <div className="mt-6 w-full max-w-xs">
            <label htmlFor="countryCode" className="ml-[10px] block font-medium text-gray-700">
              Select Country
            </label>
            <select
              id="countryCode"
              name="countryCode"
              className="m-[10px] block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 "
              onChange={(event) => setCountryCode(event.target.value)}
            >
              <option value="gb">United Kingdom</option>
              <option value="us">United States</option>
              <option value="au">Australia</option>
              <option value="ca">Canada</option>
              <option value="nz">New Zealand</option>
            </select>
          </div>
          <div className="w-full max-w-xs my-6">
            <button
              onClick={createConnected}
              id="createConnected"
              className="stdButton w-full m-0 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center"
            >
              Create
              {status && (
                <Spinner
                  style={{ marginLeft: "4px", marginTop: "2px" }}
                  color="warning"
                  size="sm"
                />
              )}
            </button>
          </div>
        </div>
      </>
        );
    }

    if(stripeConnectInstance){ 
      return (<div>
                    <div className="bg-blue-500 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
                        <p className="text-center">
                        Please follow the prompts below to add or update the required account information.
                        </p>
                    </div>
        
              <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
              <ConnectAccountOnboarding
                 onExit={updateAccount}
              />
              </ConnectComponentsProvider>
    </div>
      );
    }

};
