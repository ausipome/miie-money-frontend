'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
           console.log(isAuthenticated);
        }
    }, [isAuthenticated]);

    return isAuthenticated ? children : null;
};

export default PrivateRoute;
