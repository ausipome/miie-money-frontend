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
                        setMessage('Thank you! Your email has successfully been confirmed.');
                    } else {
                        setMessage('There has been an error confirming your email. Please try again later.');
                    }
                } catch (error) {
                    console.error('Error confirming email:', error);
                    setMessage('There has been an error confirming your email. Please try again later.');
                }
            };
            confirmEmail();
        }
    }, []); 

    return (
        <div className="flex mt-10 justify-center">
        <div className="text-sky-500 w-2/3 bg-white text-3xl p-8 rounded-lg shadow-lg text-center">
            {message}
        </div>
    </div>
      );
}