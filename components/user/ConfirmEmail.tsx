'use client';

import { Card } from '@nextui-org/card';
import { Skeleton } from '@nextui-org/skeleton';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConfirmEmail() {
    const searchParams = useSearchParams();
    const [token, setToken] = useState(searchParams.get('token') || null);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (token) {
            const confirmEmail = async () => {
                try {
                    const response = await fetch(`/confirm-email?token=${token}`, {
                        method: 'GET',
                    });
                    if (response.ok) {
                        setSuccess(true)
                        setLoading(false);
                    } else {
                        setSuccess(false)
                        setLoading(false);
                    }
                } catch (error) {
                    setSuccess(false)
                    setLoading(false);
                }
            };
            confirmEmail();
            setToken(null);
        }
    }, []); 

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

      if (success) {
        return (
            <div className="bg-blue-500 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
                   <p className="text-center">
                   Thank you! Your email has successfully been confirmed. <br />
                   You can now <Link className="text-pink-200 underline" href="login">Login</Link>
                   </p>
                </div>
          );
      }

      if (!success) {
        return (
            <div className="bg-blue-500 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
                   <p className="text-center">
                   There was an error confirming your email. Please try again later. <br /> 
                   If you can log in, your email has already been confirmed. 
                   </p>
                </div>
          );
      }

    
}