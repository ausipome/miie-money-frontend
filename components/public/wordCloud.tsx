'use client';

import React from 'react';
import ReactWordcloud, { Scale } from 'react-wordcloud';

const words = [
  { text: 'Subscriptions', value: 6 },
  { text: 'Payment Links', value: 4 },
  { text: 'Online Payments', value: 5 },
  { text: 'Invoicing', value: 3 },
  { text: 'Payment Solutions', value: 7 },
  { text: 'Learn', value: 7 },
  { text: 'E-Commerce', value: 5 },
  { text: 'Checkout', value: 4 },
  { text: 'Payment Gateway', value: 5 },
  { text: 'Recurring Billing', value: 3 },
  { text: 'API Integration', value: 3 },
];

const options = {
  colors: ['#080882','#5959c1'],
  enableTooltip: false,
  deterministic: false,
  fontSizes: [30, 70] as [number, number], 
  fontFamily: "Lato",
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 2,
  rotations: 2,
  rotationAngles: [0, 90] as [number, number],
  scale: 'sqrt' as Scale,
  spiral: 'archimedean' as 'archimedean' | 'rectangular',
  transitionDuration: 1000,
};

const WordCloud: React.FC = () => {
  return (
    <div className="word-cloud-container">
      <div className="lg:max-w-[60%] md:max-w-[80%] sm:max-w-[100%]">
        <ReactWordcloud options={options} words={words} />
      </div>
    </div>
  );
};

export default WordCloud;
