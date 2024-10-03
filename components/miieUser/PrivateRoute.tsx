'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { useAuth } from '../../hooks/useAuth'; 

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated === null) {
                // Still loading, wait for authentication status to be determined
                return;
            }
            if (!isAuthenticated) {
                router.push('/login'); // Redirect to login page
            } else {
               
            }
        };

        checkAuth();
    }, [isAuthenticated, router]);

    return <>{children}</>;
};

export default PrivateRoute;
