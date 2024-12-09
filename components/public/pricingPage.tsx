"use client";

import React, { useEffect, useState } from "react";
import {pricingData, PricingData} from "./priceData";
import { Skeleton } from "@nextui-org/skeleton";

type LocationResponse = {
  location: string;
  country: string;
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
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!location) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
      {/* Header Skeleton */}
      <div className="text-center mb-8">
        <Skeleton isLoaded={!location} className="rounded-lg">
          <div className="h-6 w-3/4 bg-gray-300 mx-auto mb-2 rounded"></div> {/* Title */}
        </Skeleton>
      </div>

      {/* Categories and Items Skeleton */}
      {[...Array(3)].map((_, categoryIndex) => (
        <div
          key={categoryIndex}
          className="mb-6 bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          {/* Category Title Skeleton */}
          <Skeleton isLoaded={!location} className="rounded-lg">
            <div className="h-8 w-1/3 bg-gray-300 mb-4 rounded"></div> {/* Category Title */}
          </Skeleton>

          {/* Items Skeleton */}
          <ul className="space-y-3">
            {[...Array(3)].map((_, itemIndex) => (
              <li
                key={itemIndex}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <Skeleton isLoaded={!location} className="rounded-lg">
                  <div className="h-6 w-1/2 bg-gray-300 rounded"></div> {/* Item Description */}
                </Skeleton>
                <Skeleton isLoaded={!location} className="rounded-lg">
                  <div className="h-6 w-1/4 bg-gray-300 rounded"></div> {/* Item Rate */}
                </Skeleton>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    );
  }

  if (!prices) {
    return (
      <div className="bg-blue-500 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
        <p className="text-center">
        No pricing available for your location.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-gray-600 mt-2 text-xl">Please find detailed pricing information below for {location} customers</h2>
      </div>
      {Object.keys(prices).map((category) => (
        <div
          key={category}
          className="mb-6 bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">{category}</h2>
          <ul className="space-y-3">
            {prices[category].map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <span className="text-gray-700">{item.description}</span>
                <span className="text-blue-500 font-medium">{item.rate}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
