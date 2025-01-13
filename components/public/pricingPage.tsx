'use client';

import React, { useEffect, useState } from "react";
import { pricingData, PricingData } from "./priceData";
import { Skeleton } from "@nextui-org/skeleton";
import Footer from "./footer";
import { LocationResponse } from "@/types";
import Cookies from 'js-cookie';



export default function DisplayPrices() {
  const [location, setLocation] = useState<string | null>(null);
  const [prices, setPrices] = useState<PricingData[keyof PricingData] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const storedLocation = Cookies.get('location');
    if (storedLocation) {
      setLocation(storedLocation);
      setPrices(pricingData[storedLocation] || null);
    } else {
      const fetchLocation = async () => {
        try {
          const response = await fetch("/get-location");
          if (!response.ok) {
            throw new Error("Failed to fetch location");
          }
          const data: LocationResponse = await response.json();
          Cookies.set('location', data.country);
          setLocation(data.country);
          setPrices(pricingData[data.country] || null);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
      };
  
      fetchLocation();
    }
  }, []);

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!location) {
    return (
      <>
      {/* Pricing Page Header Skeleton */}
      <section className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 mt-6">
        <Skeleton isLoaded={!location} className="rounded-lg">
          <div className="h-10 w-1/2 mx-auto mb-4 bg-gray-300 rounded"></div> {/* Header Title */}
        </Skeleton>
        <Skeleton isLoaded={!location} className="rounded-lg">
          <div className="h-6 w-3/4 mx-auto mb-2 bg-gray-300 rounded"></div> {/* Paragraph Line 1 */}
        </Skeleton>
        <Skeleton isLoaded={!location} className="rounded-lg">
          <div className="h-6 w-3/4 mx-auto mb-2 bg-gray-300 rounded"></div> {/* Paragraph Line 2 */}
        </Skeleton>
        <Skeleton isLoaded={!location} className="rounded-lg">
          <div className="h-6 w-1/2 mx-auto bg-gray-300 rounded"></div> {/* Paragraph Line 3 */}
        </Skeleton>
      </section>
    
      {/* Subheader Skeleton */}
      <section className="bg-gray-100 py-8 px-6 text-center">
        <Skeleton isLoaded={!location} className="rounded-lg">
          <div className="h-6 w-3/4 mx-auto bg-gray-300 rounded"></div> {/* Subheader Text */}
        </Skeleton>
      </section>
    
      {/* Pricing Content Skeleton */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-600 py-6">
        <div className="p-6 max-w-5xl mx-auto bg-gray-100 shadow-md rounded-lg">
          <Skeleton isLoaded={!location} className="rounded-lg">
            <div className="h-8 w-1/3 mx-auto bg-gray-300 mb-6 rounded"></div> {/* Section Title */}
          </Skeleton>
    
          {/* Category Skeletons */}
          {[...Array(3)].map((_, categoryIndex) => (
            <div
              key={categoryIndex}
              className="mb-6 bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              {/* Category Title Skeleton */}
              <Skeleton isLoaded={!location} className="rounded-lg">
                <div className="h-8 w-1/4 mb-4 bg-gray-300 rounded"></div> {/* Category Title */}
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
      </section>
    
      {/* Footer Skeleton */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <Skeleton isLoaded={!location} className="rounded-lg">
          <div className="h-6 w-1/3 mx-auto bg-gray-300 rounded"></div> {/* Footer Content */}
        </Skeleton>
      </footer>
    </>
    
    );
  }

  if (!prices) {
    return (
      <div className="bg-blue-500 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
        <p className="text-center">No pricing available for your location.</p>
      </div>
    );
  }

  return (
    <>
      {/* Pricing Page Header */}
      <section className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 mt-6">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
          Flexible Pricing Plans
        </h1>
        <p className="text-lg md:text-xl font-light mb-6">
        Get Paid On The Web is free to sign up with no monthly subscription fees—you only pay when you receive payments for your business. 
        <br />
        ** Below, you&apos;ll find detailed pricing for our out-of-the-box standard components. Custom pricing is also available for high-volume or unique requirements.
        <br />
        <span className="text-lg italic">** For {location} customers</span>
        </p>
      </section>

      {/* Subheader */}
      <section className="bg-gray-100 py-8 px-6 text-center">
        <p className="text-lg md:text-xl font-light text-gray-700">
          Need tailored solutions or more than our standard components? Contact {' '}  
          <a href="mailto:martyn@getpaidontheweb.com" className="text-blue-500 font-semibold">
            martyn@getpaidontheweb.com
          </a>{' '}
          for custom pricing or component development.
        </p>
      </section>

      {/* Pricing Content */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-600 py-6">
      <div className="p-6 max-w-5xl mx-auto bg-gray-100 shadow-md rounded-lg">
        <div className="text-center mb-8 mt-8">
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
      </section>

      <Footer />
    </>
  );
}
