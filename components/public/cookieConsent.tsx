'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = Cookies.get('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookieConsent', 'accepted all', { expires: 365 }); // Expires in 1 year
    setIsVisible(false);
  };

  const handleDecline = () => {
    Cookies.set('cookieConsent', 'accepted essential', { expires: 365 }); // Expires in 1 year
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-xl font-semibold mb-2">We Use Cookies</h2>
        <p className="text-sm text-gray-600 mb-4">
          To ensure this site works correctly, we use essential cookies. We may use other cookies to improve and customise your experience.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Accept All
          </button>
          <button
            onClick={handleDecline}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Decline Non-essential
          </button>
        </div>
      </div>
    </div>
  );
}
