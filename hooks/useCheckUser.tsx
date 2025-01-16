'use client';

// hooks/useCheckUser.tsx
import { useState, useEffect } from 'react';
import { UserData, Error, UseCheckUserResult } from '../types';
import Cookies from 'js-cookie';

const useCheckUser = (): UseCheckUserResult => {
    const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');
    const [email] = useState(Cookies.get('email') || '');
    const [userData, setUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        const checkUser = async (email: string, xsrfToken: string) => {
            setLoading(true);
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

                const data: UserData = await response.json();

                if (response.ok) {
                    setUserData(data);
                    setLoading(false);
                } else {
                    setError({ message: data.message });
                    setLoading(false);
                }
            } catch (error: any) {
                setError({ message: error.message });
                setLoading(false);
            }
        };

        if (email && xsrfToken) {
            checkUser(email, xsrfToken);
        }
    }, []);

    return { userData, error, loading, setLoading };
};

export default useCheckUser;