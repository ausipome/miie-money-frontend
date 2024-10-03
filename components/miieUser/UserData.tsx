// components/UserProfile.tsx
'use client';

import React, { useState, useEffect } from 'react';
import useCheckUser from '../../hooks/useCheckUser';
import Cookies from 'js-cookie';

const UserProfile: React.FC = () => {
    const [xsrfToken, setXsrfToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const token = Cookies.get('XSRF-TOKEN');
        const emailAddress = Cookies.get('email');
        setXsrfToken(token || null);
        setEmail(emailAddress || null);
    }, []);

    const { userData, error } = useCheckUser(email ?? undefined, xsrfToken ?? undefined);

    if (!xsrfToken || !email) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    console.log('Rendering UserProfile');

    return (
        <div>
            <h1>User Profile</h1>
            <p>Name: {userData?.fullName}</p>
            <p>Stripe: {userData?.stripe_account_id}</p>
        </div>
    );
};

export default UserProfile;