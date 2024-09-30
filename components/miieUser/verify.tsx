'use client'

import { useState } from 'react';

export default function CreateStripeAccount() {
  const [accountId, setAccountId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
