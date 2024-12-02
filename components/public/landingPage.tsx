'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const [showVideo, setShowVideo] = useState(true); // Toggle for video or interactive components

  return (
    <div className=" pt-[30px]">
      {/* Hero Section */}
      <section
        className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20" 
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
          Payment Components For The Web
        </h1>
        <p className="text-2xl md:text-3xl font-semibold mb-4">
          Instantly ready, endlessly adaptable
        </p>
        <p className="text-lg md:text-xl font-light mb-6">
          Use out of the box or integrate into your own projects.
        </p>
        <div className="space-x-4">
          <Link href="/signup">
            <button className="px-6 py-3 text-lg font-semibold bg-white text-blue-500 rounded-full shadow hover:bg-blue-100">
              Get Started
            </button>
          </Link>
          <Link href="/docs">
            <button className="px-6 py-3 text-lg font-semibold bg-transparent border border-white rounded-full hover:bg-white hover:text-blue-500">
              See Docs
            </button>
          </Link>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Explore Our Payment Components
        </h2>
        <div className="flex justify-center items-center space-x-6">
          <button
            className={`px-4 py-2 text-lg font-medium rounded-full ${
              showVideo ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setShowVideo(true)}
          >
            Video Demo
          </button>
          <button
            className={`px-4 py-2 text-lg font-medium rounded-full ${
              !showVideo ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setShowVideo(false)}
          >
            Interactive Demo
          </button>
        </div>

        <div className="mt-10">
          {showVideo ? (
            <div className="relative w-full max-w-4xl mx-auto aspect-video">
              <iframe
                src="https://www.youtube.com/embed/example"
                title="Payment Components Demo"
                allowFullScreen
                className="w-full h-full rounded-lg shadow-lg"
              ></iframe>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-lg font-medium mb-4">
                  Example of an Interactive Component
                </p>
                {/* Replace with actual interactive component */}
                <div className="border border-gray-300 rounded-lg p-4">
                  <p className="text-gray-700">[Payment Widget Placeholder]</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
