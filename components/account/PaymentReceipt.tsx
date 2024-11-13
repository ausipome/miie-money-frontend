'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Spinner } from '@nextui-org/spinner';
import { AccountInfo, Invoice } from '../../types';

export default function PaymentReceipt() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('invoice');
  const paymentIntent = searchParams.get('payment_intent');

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const VAT_RATE = 0.20;
  const RECEIPT_DATE = new Date().toLocaleDateString(); // Receipt date set to the current date when receipt is generated.

  useEffect(() => {
    if (!invoiceId) return;

    async function fetchInvoice() {
      setLoading(true);
      try {
        const response = await fetch(`/get-invoice-by-id/${invoiceId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch invoice');
        
        const { invoice: fetchedInvoice } = await response.json();
        setInvoice(fetchedInvoice);
        setAccountInfo(fetchedInvoice.accountInfo);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        setMessage('Failed to load invoice.');
      } finally {
        setLoading(false);
      }
    }
    const RECEIPT_DATE = new Date().toLocaleDateString(); // Receipt date set to the current date when receipt is generated.

    async function updateInvoiceStatus() {
      try {
        const response = await fetch('/payment-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoiceId, paymentIntent, receiptDate: RECEIPT_DATE }),
        });
        if (!response.ok) throw new Error('Failed to update invoice status');
        
        setMessage('Your payment has been successfully completed. A copy of this receipt has been emailed to you.');
      } catch (error) {
        console.error('Error updating invoice status:', error);
        setMessage('Failed to update invoice status.');
      }
    }

    fetchInvoice();
    updateInvoiceStatus();
  }, [invoiceId]);

  if (loading) return <Spinner color="primary" size="lg" />;
  if (!invoice) return <div>Invoice not found.</div>;

  const shouldCalculateVAT = invoice.status === 'paid' ? invoice.vatAmount !== 0 : !!invoice.vatNumber;

  const calculateSubtotal = () => invoice.items.reduce((acc, item) => 
    acc + (Number(item.quantity) || 0) * (Number(item.cost) || 0), 0);

  const calculateVAT = () => (shouldCalculateVAT ? calculateSubtotal() * VAT_RATE : 0);
  const calculateTotal = () => calculateSubtotal() + calculateVAT();

  return (
    <div className="container mx-auto mt-8 p-10 max-w-3xl bg-white rounded-lg shadow-md border border-gray-200">
      <header className="text-center mb-8">
        <div className="mb-4">
          <img src={invoice.logoUrl || "/logo_side_transparent-background_black.png"} alt="Company Logo" className="w-64 h-auto mx-auto" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">PAYMENT RECEIPT</h1>
        <p className="text-lg text-gray-500 mt-2">Receipt Number: {invoice.invoiceNumber}</p>
        <p className="text-lg text-gray-500">Date: {RECEIPT_DATE}</p>
      </header>

      {/* Sender and Receiver Information */}
      <div className="border-t border-gray-300 py-6 flex justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">From:</h2>
          <p className="text-gray-600">{accountInfo?.first_name} {accountInfo?.last_name}</p>
          {accountInfo?.name && <p className="text-gray-600">{accountInfo?.name}</p>}
          <p className="text-gray-600">{accountInfo?.address?.line1}</p>
          <p className="text-gray-600">{accountInfo?.address?.city}, {accountInfo?.address?.postal_code}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700">To:</h2>
          <p className="text-gray-600">{invoice.customer?.company || invoice.customer?.fullName}</p>
          <p className="text-gray-600">{invoice.customer?.address}</p>
          <p className="text-gray-600">{invoice.customer?.townCity}, {invoice.customer?.countyState} {invoice.customer?.postcodeZip}</p>
          <p className="text-gray-600">Email: {invoice.customer?.email}</p>
          <p className="text-gray-600">Phone: {invoice.customer?.phone}</p>
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
              <th className="pb-2">Cost (£)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-2 font-medium">{item.itemName}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2">£{Number(item.cost).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="border-t border-gray-300 mt-6 py-6">
        <div className="flex justify-end py-2">
          <span className="text-lg font-semibold text-gray-700 mr-4">Subtotal:</span>
          <span className="text-lg font-medium text-gray-800">£{calculateSubtotal().toFixed(2)}</span>
        </div>
        {shouldCalculateVAT && (
          <div className="flex justify-end py-2">
            <span className="text-lg font-semibold text-gray-700 mr-4">VAT ({VAT_RATE * 100}%):</span>
            <span className="text-lg font-medium text-gray-800">£{calculateVAT().toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-end py-2 mt-4 border-t border-gray-300 pt-4">
          <span className="text-xl font-bold text-gray-900 mr-4">Total:</span>
          <span className="text-xl font-bold text-gray-900">£{calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      {message && (
        <div className="mt-4 p-4 rounded bg-green-100 text-green-700">
          {message}
        </div>
      )}
    </div>
  );
}
