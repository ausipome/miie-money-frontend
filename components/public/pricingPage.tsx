"use client";

import React, { useEffect, useState } from "react";

type PricingCategory = {
  description: string;
  rate: string;
};

type PricingData = {
  [key: string]: {
    [category: string]: PricingCategory[];
  };
};

type LocationResponse = {
  location: string;
  country: string;
};

const pricingData: PricingData = {
    UK: {
      "Credit and Debit Cards": [
        { description: "Standard UK cards", rate: "1.5% + 20p" },
        { description: "Premium UK cards", rate: "1.9% + 20p" },
      ],
      "International Card Payments": [
        { description: "EEA cards", rate: "2.5% + 20p" },
        { description: "Currency conversion", rate: "+ 2%" },
        { description: "International cards", rate: "3.25% + 20p" },
      ],
      Link: [
        { description: "UK cards", rate: "1.2% + 20p" },
        { description: "Other cards", rate: "Regular pricing applies" },
      ],
      "Multi-currency Settlement": [
        { description: "Pay out in additional currencies", rate: "1% or £4.00 cap" },
      ],
      "3D Secure Authentication": [
        { description: "Standard", rate: "Included" },
        { description: "Custom pricing", rate: "3p per attempt" },
      ],
      "Card Account Updater": [
        { description: "Automatically update card information", rate: "25p per update" },
      ],
      "Adaptive Acceptance": [
        { description: "Machine learning for authorizations", rate: "0.08% per charge" },
      ],
      "Network Tokens": [
        { description: "Secure payment credentials", rate: "12p per token" },
      ],
      "Local Payment Methods": [
        { description: "Bacs Direct Debit", rate: "1% (min 20p, £4.00 cap)" },
      ],
      "Buy Now Pay Later": [
        { description: "Klarna", rate: "Starting at 4.99% + 35p" },
      ],
    },
    US: {
      "Cards and Wallets": [
        { description: "Domestic cards", rate: "2.9% + 30¢" },
        { description: "Manually entered cards", rate: "+ 0.5%" },
        { description: "International cards", rate: "+ 1.5%" },
        { description: "Currency conversion", rate: "+ 1%" },
      ],
      Link: [
        { description: "Domestic cards", rate: "2.9% + 30¢" },
        { description: "Instant Bank Payments", rate: "2.6% + 30¢" },
      ],
      "Bank Debits and Transfers": [
        { description: "ACH Direct Debit", rate: "0.8% (max $5.00 cap)" },
      ],
      "International Payment Methods": [
        { description: "iDEAL", rate: "Starting at 80¢" },
      ],
      "Buy Now Pay Later": [
        { description: "Klarna", rate: "Starting at 5.99% + 30¢" },
      ],
      "3D Secure Authentication": [
        { description: "Standard", rate: "Included" },
        { description: "Custom pricing", rate: "3¢ per attempt" },
      ],
      "Card Account Updater": [
        { description: "Automatically update card information", rate: "25¢ per update" },
      ],
      "Adaptive Acceptance": [
        { description: "Machine learning for authorizations", rate: "0.08% per charge" },
      ],
      "Network Tokens": [
        { description: "Secure payment credentials", rate: "15¢ per token" },
      ],
      "Instant Payouts": [
        { description: "Instant payouts volume", rate: "1.5% (min 50¢)" },
      ],
      Disputes: [
        { description: "Chargeback dispute", rate: "$15.00 per dispute" },
      ],
    },
    // Add other countries (AU, NZ, CA) here...
  };
  

export default function DisplayPrices() {
  const [location, setLocation] = useState<string | null>(null);
  const [prices, setPrices] = useState<PricingData[keyof PricingData] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("/get-location");
        if (!response.ok) {
          throw new Error("Failed to fetch location");
        }
        const data: LocationResponse = await response.json();
        setLocation(data.country);
        setPrices(pricingData[data.country] || null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    };

    fetchLocation();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!location) {
    return <div>Loading location...</div>;
  }

  if (!prices) {
    return <div>No pricing available for your location.</div>;
  }

  return (
    <div>
      <h1>Pricing for {location}</h1>
      {Object.keys(prices).map((category) => (
        <div key={category}>
          <h2>{category}</h2>
          <ul>
            {prices[category].map((item, index) => (
              <li key={index}>
                <strong>{item.description}:</strong> {item.rate}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
