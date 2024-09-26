'use client';

import React, { useState } from 'react';

export default function InvoiceBuilder() {

    const [amount, setAmount] = useState<number | string>(''); // State for amount input

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you can perform any action with the submitted amount, like sending it to an API
    console.log('Submitted amount:', amount);
    // Reset the form after submission
    setAmount('');
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value); // Update the amount state as the user types
  };

    return (
        <div className="max-w-[70%] mx-auto mt-8 p-6 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-slate-300">Create Link</h1>
          <h4 className="font-bold mb-2 ml-2">Amount (£)</h4>
          <form className="flex space-x-4" onSubmit={handleSubmit}>
            <input 
              type="number" 
              id="amount" 
              name="amount" 
              onChange={handleAmountChange}
              placeholder="Enter amount (£)" 
              className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500" 
              style={{height: '100%'}} 
            />
            <button type="submit" className="flex-1 bg-blue-900 text-white font-semibold py-2 px-4 rounded hover:text-[#fffd78] focus:outline-none focus:bg-blue-600" style={{height: '100%'}}>
              Send
            </button>
          </form>
        </div>
      );   

}