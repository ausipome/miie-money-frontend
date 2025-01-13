import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';
import { Input } from '@nextui-org/input';
import Cookies from 'js-cookie';
import { LocationResponse } from '@/types';

const LinkBuilderDemo = () => {
  const [description, setDescription] = useState('');
  const [symbol, setSymbol] = useState<string>('$');
  const [amount, setAmount] = useState(`${symbol}85.99`);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [typingStage, setTypingStage] = useState(0);
  const [loadingAction, setLoadingAction] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const animationLoop = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopTyping = useRef(false);
  const [location, setLocation] = useState<string | null>(null);
  
  useEffect(() => {
  const storedLocation = Cookies.get('location');
  if (storedLocation) {
    setLocation(storedLocation);
  } else {
    const fetchLocation = async () => {
      const response = await fetch("/get-location");
      if (!response.ok) {
        Cookies.set('location', 'US');
      }
      const data: LocationResponse = await response.json();
      Cookies.set('location', data.country);
      setLocation(data.country);
    };
    fetchLocation();
  }
}, []);

useEffect(() => {
  if (location) {
    const newSymbol = location === 'GB' ? '£' : '$';
    setSymbol(newSymbol);
    setAmount(`${newSymbol}85.99`);
  }
}, [location]);

  const customer = {
    fullName: 'Jonny Doeson',
    email: 'jonnydoeson@example.com',
    address: '123 Main Street',
    townCity: 'Springfield',
    postcode: 'SP1 2AB',
  };

  const business = {
    name: 'Super Cleaners Ltd.',
    representative: 'Martyn Clinton',
    address: '456 Business Road',
    townCity: 'Metropolis',
    postcode: 'MT9 8ZX',
    logoUrl: '/logo_side_transparent-background_black.png',
  };

  const steps = [
    { setter: setDescription, value: 'Cleaning gutters at your property' }
  ];
  
  const animateTyping = async () => {
    stopTyping.current = false;
    for (let i = 0; i < steps.length; i++) {
      if (stopTyping.current) return;
      const { setter, value } = steps[i];
      setTypingStage(i);
      for (let j = 1; j <= value.length; j++) {
        if (stopTyping.current) return;
        await new Promise((resolve) => setTimeout(resolve, 50)); // Adjust typing speed
        setter(value.slice(0, j));
      }
    }
    setTypingStage(steps.length);
    startFlashing();
  };

  const startFlashing = () => {
    if (stopTyping.current) return;
    setIsFlashing(true);
    animationLoop.current = setTimeout(() => {
      setIsFlashing(false);
      if (!generatedEmail && !stopTyping.current) animateTyping();
    }, 6000); // Flashing for 6 seconds
  };

  useEffect(() => {
    animateTyping();
    return () => {
      if (animationLoop.current) clearTimeout(animationLoop.current);
    };
  }, []);

  const generateEmail = () => {
    if (animationLoop.current) clearTimeout(animationLoop.current);
    stopTyping.current = true; // Stop the typing animation
    setIsFlashing(false); // Stop flashing immediately

    setLoadingAction(true);
    setTimeout(() => {
      const email = `Subject: Cleaning your gutters\n\nDear ${customer.fullName},\n\nI hope this email finds you well. I am writing on behalf of ${business.name} to kindly request payment for the gutter cleaning services provided to your property.\n\nAs per our agreement, the total cost for the service is ${amount}. We have included a payment link for your convenience. Would you please take a moment to settle the outstanding balance at your earliest convenience?\n\nWe value your business and appreciate your prompt attention to this matter. If you have any questions or need assistance with the payment process, please do not hesitate to reach out. We are always happy to help.\n\nThank you for choosing ${business.name}. We look forward to continuing to serve you in the future.\n\nYours sincerely,\n\n${business.representative}\n${business.name}`;

      setGeneratedEmail(email);
      setLoadingAction(false);
    }, 1000);
  };

  return (
    <div className="max-w-[60%] mx-auto mt-8 p-6 bg-white rounded shadow-md">
      {/* Logo and Header */}
      <div className="text-center mb-8">
        <img src={business.logoUrl} alt="Business Logo" className="mx-auto mb-4 max-w-[220px]" />
        <h1 className="text-4xl font-bold">PAYMENT LINK</h1>
      </div>

      {/* Sender and Receiver Details */}
      <div className="flex justify-between items-start mb-8 p-4 border border-gray-300 rounded-md bg-gray-50">
        <div>
          <h3 className="text-lg font-bold">From:</h3>
          <p>{business.name}</p>
          <p>{business.address}</p>
          <p>{business.townCity}, {business.postcode}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold">To:</h3>
          <p>{customer.fullName}</p>
          <p>{customer.address}</p>
          <p>{customer.townCity}, {customer.postcode}</p>
        </div>
      </div>

      {/* Description Input */}
      <div className="mb-4">
        <Input
          type="text"
          label="Description"
          placeholder="Enter a brief description"
          value={description}
          readOnly={true}
          className="w-full"
        />
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <Input
          type="text"
          label={`Amount (${symbol})`}
          placeholder="Enter amount"
          value={amount}
          readOnly={true}
          className="w-full"
        />
      </div>

      {/* Success Message */}
      <div className="mb-6">
        {generatedEmail ? (
          <div className="text-white bg-green-500 text-center font-semibold p-2">
            Payment link generated and emailed to your customer.
          </div>
        ) : (
          <Button
            onClick={generateEmail}
            className={`px-4 py-2 rounded text-white ${isFlashing ? 'bg-red-500 animate-pulse' : 'bg-indigo-500 hover:bg-indigo-600'}`}
            disabled={typingStage < steps.length || loadingAction}
          >
            {loadingAction ? <Spinner size="sm" /> : 'Generate Email'}
          </Button>
        )}
      </div>

      {/* Generated Email Display */}
      {generatedEmail && (
        <div className="mt-4 p-4 bg-gray-100 border rounded-md">
          <h3 className="text-md font-bold mb-2">Generated Email:</h3>
          <textarea
            className="w-full p-2 border rounded-md text-black"
            value={generatedEmail}
            readOnly
            rows={12}
          />
        </div>
      )}
    </div>
  );
};

export default LinkBuilderDemo;
