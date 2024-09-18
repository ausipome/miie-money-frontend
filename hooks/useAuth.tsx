'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; 

interface AuthContextType {
    isAuthenticated: boolean | null;
    xsrfToken: string;
    submitError: string | null;
    setSubmitError: React.Dispatch<React.SetStateAction<string | null>>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [xsrfToken, setXsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');
    const [submitError, setSubmitError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            if (xsrfToken) {
                try {
                    const response = await fetch('/api/check-auth', {
                        method: 'GET',
                        headers: {
                            'X-CSRF-Token': xsrfToken, 
                        },
                        credentials: 'include',
                    });
                    if (response.ok) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    console.error('Check auth error:', error);
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, [xsrfToken]);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('/login-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setIsAuthenticated(true);
                setXsrfToken(data.csrfToken);
                router.push('/console'); // Redirect to console page
            } else {
                const errorData = await response.json();
                setSubmitError(errorData.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        if (xsrfToken) {
        try {
            await fetch('/logout-endpoint', {
                method: 'POST',
                credentials: 'include',
            });
            setIsAuthenticated(false);
            setXsrfToken('');
            Cookies.remove('XSRF-TOKEN');
        } catch (error) {
            console.error('Logout error:', error);
        }
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, xsrfToken, login, logout, submitError, setSubmitError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;
