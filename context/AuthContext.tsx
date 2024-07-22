'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check the cookie/session to validate if user is authenticated
    const checkAuth = async () => {
      const response = await fetch('/validate-session', {
        method: 'POST',
        credentials: 'include', // Ensure credentials are included with the fetch call
      });
      const data = await response.json();       
      if (data.isAuthenticated) {
        console.log(data.isAuthenticated);
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  const login = (data: any) => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
