'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MiieConfirmEmail() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [message, setMessage] = useState('Confirming...');

    useEffect(() => {
        if (token) {
            const confirmEmail = async () => {
                try {
                    const response = await fetch(`/confirm-email?token=${token}`, {
                        method: 'GET',
                    });
                    if (response.ok) {
                        setMessage('Email confirmed successfully!');
                    } else {
                        setMessage('Failed to confirm email.');
                    }
                } catch (error) {
                    console.error('Error confirming email:', error);
                    setMessage('An error occurred while confirming email.');
                }
            };

            confirmEmail();
        }
    }, [token]);

    return <div style={{fontSize:'5em',color:'white'}}>{message}</div>;
}