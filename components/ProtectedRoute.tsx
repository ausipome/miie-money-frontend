'use client';

import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
 

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect them to the login page, but save the current location they were trying to go to.
      console.log('Redirecting to login page');
    }
  });

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
