'use client';

import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@nextui-org/skeleton';
import DemoCheckoutForm from './DemoCheckoutForm';
import moment from 'moment';
import Cookies from 'js-cookie';
import { LocationResponse } from '@/types';

export default function SecurePayInvoiceDemo() {
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const VAT_RATE = 0.2;
  const [location, setLocation] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string>('$');
  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [whichTax, setWhichTax] = useState('Tax');

  
  
  
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


  const formatDate = (date: string, location: string) => {
    switch (location) {
      case 'GB':
        setWhichTax('VAT');
        return moment(date).format('DD/MM/YY');
      case 'AU':
        setWhichTax('GST');
        return moment(date).format('DD/MM/YY');
      case 'NZ':
        setWhichTax('GST');
        return moment(date).format('DD/MM/YY');
      case 'CA':
        setWhichTax('Tax');
        return moment(date).format('MM/DD/YY');
      case 'US':
        setWhichTax('Sales Tax');
        return moment(date).format('MM/DD/YY');
      default:
        setWhichTax('Tax');
        return moment(date).format('MM/DD/YY');
    }
  };

  useEffect(() => {
    if (location) {
      setSymbol(location === 'GB' ? '£' : '$');
      setInvoiceDate(formatDate(new Date().toISOString(), location));
    }
  }, [location]);

  // Simulated demo invoice data
  const invoice = useMemo(
    () => ({
      logoUrl: '/logo_side_transparent-background_black.png',
      invoiceNumber: 'DEMO-001',
      status: 'unpaid',
      taxNumber: 'DEMO-VAT-123',
      customer: {
        company: 'Demo Customer Co.',
        fullName: 'John Doe',
        address: '123 Demo Street',
        townCity: 'Demo City',
        countyState: 'Demo State',
        postcodeZip: 'DEMO123',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      },
      items: [
        { itemName: 'Demo Product 1', quantity: 1, cost: 50 },
        { itemName: 'Demo Product 2', quantity: 2, cost: 30 },
      ],
      accountInfo: {
        first_name: 'Demo',
        last_name: 'Business',
        address: {
          line1: '456 Demo Lane',
          city: 'Demo City',
          postal_code: 'DEMO456',
        },
      },
    }),
    []
  );

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const calculateSubtotal = () =>
    invoice.items.reduce((acc, item) => acc + item.quantity * item.cost, 0);

  const calculateVAT = () => calculateSubtotal() * VAT_RATE;
  const calculateTotal = () => calculateSubtotal() + calculateVAT();

  if (loading) {
    return (
      <div className="container mx-auto mt-8 p-10 max-w-3xl bg-gray-100 rounded-lg shadow-md border border-gray-200">
        {/* Header Skeleton */}
        <header className="text-center mb-8">
          <Skeleton isLoaded={!loading} className="rounded-lg">
            <div className="h-20 w-40 bg-gray-300 mx-auto rounded"></div> {/* Logo */}
          </Skeleton>
          <Skeleton isLoaded={!loading} className="rounded-lg mt-4">
            <div className="h-8 w-1/2 bg-gray-300 mx-auto rounded"></div> {/* Title */}
          </Skeleton>
          <Skeleton isLoaded={!loading} className="rounded-lg mt-2">
            <div className="h-6 w-1/3 bg-gray-300 mx-auto rounded"></div> {/* Invoice Number */}
          </Skeleton>
          <Skeleton isLoaded={!loading} className="rounded-lg mt-1">
            <div className="h-6 w-1/4 bg-gray-300 mx-auto rounded"></div> {/* Date */}
          </Skeleton>
        </header>
  
        {/* Sender and Receiver Information Skeleton */}
        <div className="border-t border-gray-300 py-6 flex justify-between">
          {/* Sender Skeleton */}
          <div className="space-y-2">
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-6 w-1/4 bg-gray-300 rounded"></div> {/* "From:" */}
            </Skeleton>
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} isLoaded={!loading} className="rounded-lg">
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div> {/* Sender Info */}
              </Skeleton>
            ))}
          </div>
          {/* Receiver Skeleton */}
          <div className="space-y-2">
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-6 w-1/4 bg-gray-300 rounded"></div> {/* "To:" */}
            </Skeleton>
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} isLoaded={!loading} className="rounded-lg">
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div> {/* Receiver Info */}
              </Skeleton>
            ))}
          </div>
        </div>
  
        {/* Invoice Details Skeleton */}
        <div className="border-t border-gray-300 mt-6 py-6">
          <Skeleton isLoaded={!loading} className="rounded-lg mb-4">
            <div className="h-6 w-1/3 bg-gray-300 rounded"></div> {/* "Invoice Details" */}
          </Skeleton>
          <Skeleton isLoaded={!loading} className="rounded-lg mb-2">
            <div className="h-8 w-full bg-gray-300 rounded"></div> {/* Table Header */}
          </Skeleton>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} isLoaded={!loading} className="rounded-lg mb-2">
              <div className="h-6 w-full bg-gray-300 rounded"></div> {/* Table Rows */}
            </Skeleton>
          ))}
        </div>
  
        {/* Totals Section Skeleton */}
        <div className="border-t border-gray-300 mt-6 py-6 space-y-2">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} isLoaded={!loading} className="rounded-lg">
              <div className="h-6 w-1/2 bg-gray-300 ml-auto rounded"></div> {/* Totals */}
            </Skeleton>
          ))}
        </div>
  
        {/* Checkout Form Skeleton */}
        <div className="mt-6">
          <Skeleton isLoaded={!loading} className="rounded-lg">
            <div className="h-16 w-full bg-gray-300 rounded"></div> {/* Checkout Form */}
          </Skeleton>
        </div>
      </div>
    );
  }  

  return (
    <div className="container mx-auto mt-8 p-10 max-w-3xl bg-white rounded-lg shadow-md border border-gray-200">
      <header className="text-center mb-8">
        <img
          src={invoice.logoUrl}
          alt="Company Logo"
          className="w-auto h-auto max-w-[200px] max-h-[100px] mx-auto"
        />
        <h1 className="text-4xl font-bold text-gray-800">INVOICE</h1>
        <p className="text-lg text-gray-500 mt-2">Invoice Number: {invoice.invoiceNumber}</p>
        <p className="text-lg text-gray-500">Date: {invoiceDate}</p>
      </header>

      {/* Sender and Receiver Information */}
      <div className="border-t border-gray-300 py-6 flex justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">From:</h2>
          <p className="text-gray-600">
            {invoice.accountInfo.first_name} {invoice.accountInfo.last_name}
          </p>
          <p className="text-gray-600">{invoice.accountInfo.address.line1}</p>
          <p className="text-gray-600">
            {invoice.accountInfo.address.city}, {invoice.accountInfo.address.postal_code}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700">To:</h2>
          <p className="text-gray-600">{invoice.customer.company}</p>
          <p className="text-gray-600">{invoice.customer.address}</p>
          <p className="text-gray-600">
            {invoice.customer.townCity}, {invoice.customer.countyState}{' '}
            {invoice.customer.postcodeZip}
          </p>
          <p className="text-gray-600">Email: {invoice.customer.email}</p>
          <p className="text-gray-600">Phone: {invoice.customer.phone}</p>
        </div>
      </div>

      {/* Itemized Invoice Table */}
      <div className="border-t border-gray-300 mt-6 py-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Invoice Details</h2>
        <table className="w-full text-left text-gray-600">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="pb-2">Item</th>
              <th className="pb-2">Quantity</th>
              <th className="pb-2">Cost ({symbol})</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-2 font-medium">{item.itemName}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2">{symbol}{Number(item.cost).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="border-t border-gray-300 mt-6 py-6">
        <div className="flex justify-end py-2">
          <span className="text-lg font-semibold text-gray-700 mr-4">Subtotal:</span>
          <span className="text-lg font-medium text-gray-800">{symbol}{calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-end py-2">
          <span className="text-lg font-semibold text-gray-700 mr-4">{whichTax}:</span>
          <span className="text-lg font-medium text-gray-800">{symbol}{calculateVAT().toFixed(2)}</span>
        </div>
        <div className="flex justify-end py-2 mt-4 border-t border-gray-300 pt-4">
          <span className="text-xl font-bold text-gray-900 mr-4">Total:</span>
          <span className="text-xl font-bold text-gray-900">{symbol}{calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Demo Checkout Form */}
      <div>
        <DemoCheckoutForm
          onPaymentSuccess={() => {
            setCurrentStep(0); // Example: Reset animation logic
          }}
        />
      </div>
    </div>
  );
}
