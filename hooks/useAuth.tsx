'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [xsrfToken, setXsrfToken] = useState('');

    useEffect(() => {
        // Check if user is authenticated on initial load
        const checkAuth = async () => {
            const response = await fetch('/api/check-auth', {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setIsAuthenticated(true);
                setXsrfToken(data.xsrfToken);
            }
        };
        checkAuth();
    }, []);

    const login = async (values) => {
        try {
            const response = await fetch('/login-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ values }),
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                setIsAuthenticated(true);
                setXsrfToken(data.xsrfToken);
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        await fetch('/logout-endpoint', {
            method: 'POST',
            credentials: 'include',
        });
        setIsAuthenticated(false);
        setXsrfToken('');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, xsrfToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
