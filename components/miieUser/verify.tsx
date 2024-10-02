'use client'

import { useState, useEffect } from 'react';
import useCheckUser from '../../hooks/useCheckUser';

export default function CreateStripeAccount() {
  const [accountId, setAccountId] = useState('');
  const { userData, loading, error, setError, setLoading} = useCheckUser();

    useEffect(() => {
      console.log(userData);
    }, [userData]);

  const handleCreateAccount = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/create-connected', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setAccountId(data.account_id);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
}

if (error) {
    return <div>Error: {error.message}</div>;
}

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create Stripe Account</h1>
      <button onClick={handleCreateAccount} disabled={loading}>
        {loading ? 'Creating...' : 'Create Stripe Account'}
      </button>

      {accountId && <p>Account Created! Account ID: {accountId}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
