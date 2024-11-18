'use client';

import { useState } from 'react';
import { Contact, PaymentLink } from '../../types';
import Cookies from 'js-cookie';
import { Button } from '@nextui-org/button';

interface LinkBuilderProps {
  customer?: Contact;
  linkData?: PaymentLink;
  backButton?: React.ReactNode;
  onNewLink: () => void;
  onHomeClick: () => void;
}

const LinkBuilder: React.FC<LinkBuilderProps> = ({ customer, linkData, backButton, onNewLink, onHomeClick }) => {
  const [description, setDescription] = useState(linkData?.description || '');
  const [amount, setAmount] = useState(linkData?.amount || '');
  const [linkUrl, setLinkUrl] = useState(linkData?.linkUrl || '');
  const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');

  const handleGenerateLink = async () => {
    try {
      const payload = {
        customer,
        description,
        amount: parseFloat(amount.toString()),
      };

      const response = await fetch('/api/payment-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setLinkUrl(data.linkUrl);
      } else {
        console.error('Failed to generate payment link');
      }
    } catch (error) {
      console.error('Error generating link:', error);
    }
  };

  return (
    <div className="max-w-[70%] mx-auto mt-8 p-6 bg-white rounded shadow-md">
      <div className="flex justify-between mb-4 text-base">
        <div className="flex space-x-2">
          {backButton}
          <Button onClick={onHomeClick} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Home
          </Button>
        </div>
        <Button onClick={onNewLink} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          New Link
        </Button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Amount (£)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-4 p-2 border rounded-md"
        />
        {linkUrl && (
          <div className="mb-4">
            <p className="text-green-500">Link Generated:</p>
            <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {linkUrl}
            </a>
          </div>
        )}
        <Button onClick={handleGenerateLink} className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Generate Payment Link
        </Button>
      </div>
    </div>
  );
};

export default LinkBuilder;
