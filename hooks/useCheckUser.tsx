'use client';

// hooks/useCheckUser.tsx
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { UserData, Error, UseCheckUserResult } from '../types';

const useCheckUser = (): UseCheckUserResult => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const xsrfToken = Cookies.get('xsrfToken');
        const email = Cookies.get('email');

        const checkUser = async (email: string, xsrfToken: string) => {
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
                } else {
                    setError({ message: data.message });
                }
            } catch (error: any) {
                setError({ message: error.message });
            }
        };

        if (email && xsrfToken) {
            checkUser(email, xsrfToken);
        }
    }, []);

    return { userData, error };
};

export default useCheckUser;