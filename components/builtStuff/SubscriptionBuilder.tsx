'use client';

import React, { useState } from 'react';

interface Subscription {
    productDescription: string;
    startDate: string;
    numberOfCycles: number | 'forever';
    frequency: 'daily' | 'weekly' | 'monthly' | number;
    trialPeriod: number;
}

export default function SubscriptionBuilder() {
    const [subscription, setSubscription] = useState<Subscription>({
        productDescription: '',
        startDate: '',
        numberOfCycles: 'forever',
        frequency: 'monthly',
        trialPeriod: 0,
      });
    
      const handleSubscriptionChange = (key: keyof Subscription, value: string | number | 'forever' | 'daily' | 'weekly' | 'monthly') => {
        setSubscription({
          ...subscription,
          [key]: value,
        });
      };
    
      const handleSubmit = () => {
        // Your submit logic here
        
      };
    
      return (
        <div className="max-w-[50%] mx-auto mt-8 p-6 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-slate-300">Subscription Builder</h1>
          <div className="mb-4">
            <label htmlFor="productDescription" className="block mb-2 font-bold">
              Product Description
            </label>
            <input
              type="text"
              id="productDescription"
              placeholder="Product Description"
              className="w-full border p-2 mb-2"
              value={subscription.productDescription}
              onChange={e => handleSubscriptionChange('productDescription', e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="startDate" className="block mb-2 font-bold">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              className="w-full border p-2 mb-2"
              value={subscription.startDate}
              onChange={e => handleSubscriptionChange('startDate', e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="numberOfCycles" className="block mb-2 font-bold">
              Number of Cycles
            </label>
            <select
              id="numberOfCycles"
              className="w-full border p-2 mb-2"
              value={subscription.numberOfCycles}
              onChange={e => handleSubscriptionChange('numberOfCycles', e.target.value)}
            >
              <option value="forever">Forever</option>
              {[...Array(12)].map((_, index) => (
                <option key={index + 1} value={index + 1}>{index + 1}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="frequency" className="block mb-2 font-bold">
              Frequency
            </label>
            <select
              id="frequency"
              className="w-full border p-2 mb-2"
              value={subscription.frequency}
              onChange={e => handleSubscriptionChange('frequency', e.target.value as 'daily' | 'weekly' | 'monthly' | number)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="trialPeriod" className="block mb-2 font-bold">
              Set Trial Period (in days)
            </label>
            <input
              type="number"
              id="trialPeriod"
              className="w-full border p-2 mb-2"
              min="0"
              value={subscription.trialPeriod}
              onChange={e => handleSubscriptionChange('trialPeriod', parseInt(e.target.value))}
            />
          </div>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:text-[#fffd78]">
            Submit
          </button>
        </div>
      );
};
