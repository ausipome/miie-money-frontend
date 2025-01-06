'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import Cookies from 'js-cookie';

export default function InvoiceDemo() {
  
  const [vatRate, setVatRate] = useState<number>(0.1);
  const [invoiceDate, setInvoiceDate] = useState('');
  const [items, setItems] = useState([
    { itemName: '', quantity: '', cost: '' },
    { itemName: '', quantity: '', cost: '' }, // Two items always visible
  ]);
  const [message, setMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const country = Cookies.get('country') || 'US';
  const [whichTax, setWhichTax] = useState('Sales Tax');
  const [symbol, setSymbol] = useState('$');

   // Update tax-related labels and messages based on the country
   useEffect(() => {
    switch (country) {
      case 'GB':
        setVatRate(0.2);
        setWhichTax('VAT');
        setSymbol('£');
        break;
      case 'US':
        setVatRate(0.07);
        setWhichTax('Sales Tax');
        break;
      case 'AU':
        setVatRate(0.1);
        setWhichTax('GST');
        break;
      case 'NZ':
        setVatRate(0.15);
        setWhichTax('GST');
        break;
      case 'CA':
        setVatRate(0.06);
        setWhichTax('Tax');
        break;
      default:
        setVatRate(0);
        break;
    }
  }, [country]);

  useEffect(() => {
    setInvoiceDate(new Date().toLocaleDateString());
  }, []);

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => {
      const quantity = parseInt(item.quantity, 10) || 0;
      const cost = parseFloat(item.cost) || 0;
      return acc + quantity * cost;
    }, 0);
  };

  const calculateVAT = () => calculateSubtotal() * vatRate;
  const calculateTotal = () => calculateSubtotal() + calculateVAT();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const demoSteps = [
      () => clearItems(), // Clear all inputs
      () => simulateTyping(0, 'itemName', 'Sample Item 1'),
      () => simulateTyping(0, 'quantity', '2'),
      () => simulateTyping(0, 'cost', '10.00'),
      () => simulateTyping(1, 'itemName', 'Sample Item 2'),
      () => simulateTyping(1, 'quantity', '1'),
      () => simulateTyping(1, 'cost', '20.00'),
      () => sendInvoiceAnimation(), // Show "sending" animation
    ];

    if (currentStep < demoSteps.length) {
      const timeout = setTimeout(() => {
        demoSteps[currentStep]();
        setCurrentStep((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentStep]);

  const clearItems = () => {
    setItems([
      { itemName: '', quantity: '', cost: '' },
      { itemName: '', quantity: '', cost: '' },
    ]);
  };

  const simulateTyping = (index: number, key: keyof typeof items[0], value: string) => {
    let i = 0;
    const interval = setInterval(() => {
      setItems((prev) => {
        const updatedItems = [...prev];
        updatedItems[index] = { ...updatedItems[index], [key]: value.slice(0, i + 1) };
        return updatedItems;
      });
      i += 1;
      if (i === value.length) clearInterval(interval);
    }, 100);
  };

  const sendInvoiceAnimation = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setMessage('Invoice Sent Successfully!');
      setTimeout(() => {
        setMessage(null);
        setCurrentStep(0); // Restart the demo
      }, 3000);
    }, 3000);
  };

  return (
    <div className="mt-8 p-6 bg-white rounded shadow-md">
      {/* Invoice Details */}
      <div className="flex justify-between items-start mb-8 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
        <div>
          <p className="font-bold">Demo Business</p>
          <p>123 Demo Street, Cityville, DEMO123</p>
          <p>Phone: 123-456-7890</p>
          <p>Email: info@demobusiness.com</p>
        </div>
        <div>
          <h1 className="text-4xl font-bold">INVOICE</h1>
          <p>
            <strong>Invoice #: </strong> DEMO-001
          </p>
          <p>
            <strong>Invoice Date: </strong> {invoiceDate || 'Loading...'}
          </p>
          <p>
            <strong>Customer: </strong> John Doe
          </p>
          <p>456 Customer Road, Townland, CUST456</p>
          <p>Phone: 987-654-3210</p>
          <p>Email: customer@example.com</p>
        </div>
      </div>

      {/* Items Section */}
      {items.map((item, index) => (
        <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
          <input
            type="text"
            value={item.itemName}
            placeholder="Item Name"
            readOnly
            className="w-full border p-2 mb-2"
          />
          <div className="flex justify-between mb-2">
            <input
              type="number"
              min="1"
              value={item.quantity}
              placeholder="Quantity"
              readOnly
              className="w-1/2 border p-2 mr-2"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.cost}
              placeholder="Cost ({symbol})"
              readOnly
              className="w-1/2 border p-2"
            />
          </div>
        </div>
      ))}

      {/* Totals */}
      <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
        <div className="flex justify-end mb-2">
          <span>Subtotal:</span>
          <span>{symbol}{calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-end mb-2">
          <span>{whichTax} ({vatRate * 100}%):</span>
          <span>{symbol}{calculateVAT().toFixed(2)}</span>
        </div>
        <div className="flex justify-end">
          <h2>Total:</h2>
          <h2>{symbol}{calculateTotal().toFixed(2)}</h2>
        </div>
      </div>

      {/* Send Invoice Button */}
      <div className="flex justify-center mt-6">
        <button
          className={`bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition ${
            isSending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSending}
          onClick={sendInvoiceAnimation}
        >
          {isSending ? (
            <div className="flex items-center">
              <Spinner size="sm" className="mr-2" />
              Sending...
            </div>
          ) : (
            'Send Invoice'
          )}
        </button>
      </div>

      {/* Success Message */}
      {message && (
        <div className="mt-4 p-2 bg-green-200 text-green-700 rounded text-center">
          {message}
        </div>
      )}
    </div>
  );
}
