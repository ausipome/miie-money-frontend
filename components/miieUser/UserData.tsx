// components/UserProfile.tsx
'use client';

import React, { useState, useEffect } from 'react';
import useCheckUser from '../../hooks/useCheckUser';


const UserProfile: React.FC = () => {
    

    const { userData, error, loading } = useCheckUser();

    if (loading) {
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