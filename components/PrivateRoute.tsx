'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { useAuth } from '../hooks/useAuth'; 

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated === null) {
                // Still loading, wait for authentication status to be determined
                return;
            }
            if (!isAuthenticated) {
                router.push('/login'); // Redirect to login page
            } else {
                setLoading(false);
            }
        };

        checkAuth();
    }, [isAuthenticated, router]);

    if (loading) {
        return <div>Loading...</div>; // You might want to show a loading spinner or some placeholder
    }

    return <>{children}</>;
};

export default PrivateRoute;
