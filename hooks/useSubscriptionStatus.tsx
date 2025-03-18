import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { SubscriptionData } from '@/types';

const useSubscriptionStatus = () => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSubscription = async (): Promise<void> => {
      const email = Cookies.get('email'); // Assuming the email is stored in a cookie
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/account/check-subscription-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': Cookies.get('XSRF-TOKEN') || '', // Fetching CSRF token from cookies
          },
          credentials: 'include', // Necessary to include cookies with the request
        });
        const data: SubscriptionData = await response.json();
        if (response.ok) {
          setSubscription(data);
        } else {
          throw new Error(data.error || 'Failed to fetch subscription details');
        }
      } catch (err: any) { // Catching type any since Error object doesn't necessarily cover all cases
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  return { subscription, loading, error };
};

export default useSubscriptionStatus;