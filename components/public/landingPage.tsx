'use client';

import React from 'react';
import Link from 'next/link';
import WordCloud from './wordCloud';
import SecurePayInvoiceDemo from '../invoice/SecurePayInvoiceDemo';
import TopNav from '../navigation/TopNav';
import { motion } from 'framer-motion';

const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const slideInVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

export default function LandingPage() {
  return (
    <>
      <TopNav />
      <div className="pt-[30px]">
        {/* Hero Section */}
        <motion.section
          className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInVariants}
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
        </motion.section>

        {/* Showcase Section */}
        <motion.section
          className="py-6 bg-gray-100 text-center min-h-[400px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInVariants}
        >
          <WordCloud />
        </motion.section>

        {/* Payment Demo Section */}
        <motion.section
          className="py-16 bg-gradient-to-r from-blue-950 to-blue-600 text-white relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-800 opacity-20 pointer-events-none"></div>
          <div className="max-w-[90%] lg:max-w-[70%] mx-auto px-6 md:flex md:items-center md:space-x-10">
            {/* Left Side: Unified Block with Animation */}
            <motion.div
              className="md:w-3/6 text-center md:text-left mb-10 md:mb-0 bg-gradient-to-br from-blue-700 to-blue-800 p-10 rounded-lg shadow-lg"
              variants={slideInVariants}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-md">
                Powerful payment components for invoices, links, subscriptions, or whatever your business needs.
              </h2>
              <p className="mt-6 text-lg font-light">
                Streamline payments with seamless components that work for you. From professional invoices to versatile payment links and subscription management, we can adapt our solutions to any business model.
              </p>
              <h3 className="mt-10 text-2xl font-semibold text-blue-300">
                Country-dependent payment options available:
              </h3>
              <ul className="mt-6 space-y-2 text-lg">
                <li>Credit and Debit Cards</li>
                <li>International Card Payments</li>
                <li>Stripe Link</li>
                <li>Buy Now Pay Later (Afterpay, Klarna, ZIP)</li>
                <li>Google Pay</li>
                <li>Apple Pay</li>
                <li>BACS and ACH Direct Debits</li>
                <li>iDEAL</li>
              </ul>
            </motion.div>

            {/* Right Side: Invoice Component */}
            <motion.div className="md:w-3/6 flex justify-center" variants={fadeInVariants}>
              <div className="w-full relative overflow-hidden">
                <div className="relative z-10">
                  <SecurePayInvoiceDemo />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          className="py-16 bg-gray-100 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12"
            variants={fadeInVariants}
          >
            GET PAID ON THE WEB DOT COM
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[80%] mx-auto px-6"
            variants={containerVariants}
          >
            {/* Top Row: 3 Equal Boxes */}
            <motion.div
              className="p-6 bg-blue-800 text-white rounded-lg shadow-lg"
              variants={fadeInVariants}
            >
              <h3 className="text-2xl font-bold mb-4">
                Build Professional Invoices, Quotes, and Subscriptions
              </h3>
              <p className="text-lg">
                getpaidontheweb.com provides tools to easily create professional-looking invoices, quotes, and subscription management, helping you present a polished image to your clients.
              </p>
            </motion.div>
            <motion.div
              className="p-6 bg-blue-400 text-white rounded-lg shadow-lg"
              variants={fadeInVariants}
            >
              <h3 className="text-2xl font-bold mb-4">AI-Powered Communication</h3>
              <p className="text-lg">
                The platform uses AI technology to assist you in writing effective communications, such as invoice emails and payment links, saving you time and ensuring consistent messaging.
              </p>
            </motion.div>
            <motion.div
              className="p-6 bg-teal-300 text-black rounded-lg shadow-lg"
              variants={fadeInVariants}
            >
              <h3 className="text-2xl font-bold mb-4">Secure Payments</h3>
              <p className="text-lg">
                Payments made through getpaidontheweb.com are much more secure than traditional bank transfers, providing peace of mind and protecting your business and your customers' sensitive information.
              </p>
            </motion.div>

            {/* Bottom Row: 2 Larger Boxes */}
            <motion.div
              className="p-8 md:col-span-1 bg-orange-600 text-white rounded-lg shadow-lg"
              variants={fadeInVariants}
            >
              <h3 className="text-2xl font-bold mb-4">Save Time on Business Management</h3>
              <p className="text-lg">
                getpaidontheweb.com's all-in-one platform allows you to streamline your business operations, freeing up your time to focus on what really matters - growing your business and serving your customers.
              </p>
            </motion.div>
            <motion.div
              className="p-8 md:col-span-2 bg-blue-800 text-white rounded-lg shadow-lg"
              variants={fadeInVariants}
            >
              <h3 className="text-2xl font-bold mb-4">Improved Customer Experience</h3>
              <p className="text-lg">
                By using getpaidontheweb.com, you can provide your customers with a seamless and professional experience, from invoicing to payment processing, leading to increased satisfaction and loyalty.
              </p>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </>
  );
}
