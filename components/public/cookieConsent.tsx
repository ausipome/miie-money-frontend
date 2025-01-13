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
    Cookies.set('cookieConsent', 'accepted', { expires: 365 }); // Expires in 1 year
    setIsVisible(false);
  };

  const handleDecline = () => {
    Cookies.set('cookieConsent', 'declined', { expires: 365 }); // Expires in 1 year
    alert('Our site only uses essential cookies to function. If you decline, the site may not work as expected.');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-xl font-semibold mb-2">We Use Essential Cookies</h2>
        <p className="text-sm text-gray-600 mb-4">
          To ensure our site works properly, we use only essential cookies. These cookies are necessary for core functionality. By clicking &quot;Accept,&quot; you agree to their use.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Accept
          </button>
          <button
            onClick={handleDecline}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
