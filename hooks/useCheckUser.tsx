import { useState, useEffect } from 'react';
import { UserData, Error, UseCheckUserResult } from '../types';

const useCheckUser = (email: string, xsrfToken: string): UseCheckUserResult => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const checkUser = async (email: string) => {
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
            } catch (error:any) {
                setError({ message: error.message });
            } finally {
                setLoading(false);
            }
        };

        if (email) {
            checkUser(email);
        }
    }, [email, xsrfToken]);

    return { userData, loading, error, setError, setLoading };
};

export default useCheckUser;