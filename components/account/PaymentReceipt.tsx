'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@nextui-org/skeleton';
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
        setLoading(false);
      } catch (error) {
        console.error('Error updating invoice status:', error);
        setMessage('Failed to update invoice status.');
        setLoading(false);
      }
    }

    fetchInvoice();
    updateInvoiceStatus();
  }, [invoiceId]);

  if (loading) { 
    return (
      <div className="flex flex-col items-center h-screen w-full gap-6 bg-gray-100">
        {/* Full-screen skeleton container */}
        <div className="w-[90%] max-w-3xl space-y-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
          
          {/* Logo and Title Skeleton */}
          <div className="flex flex-col items-center space-y-4">
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-16 w-40 bg-gray-200 rounded-lg"></div> {/* Logo placeholder */}
            </Skeleton>
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-8 w-3/4 bg-gray-200 rounded-lg"></div> {/* Title placeholder */}
            </Skeleton>
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-6 w-1/2 bg-gray-200 rounded-lg"></div> {/* Receipt number */}
            </Skeleton>
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-6 w-1/3 bg-gray-200 rounded-lg"></div> {/* Date */}
            </Skeleton>
          </div>
  
          {/* Sender and Receiver Information */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton isLoaded={!loading} className="rounded-lg">
                <div className="h-6 w-1/3 bg-gray-200 rounded-lg"></div> {/* "From:" label */}
              </Skeleton>
              <Skeleton isLoaded={!loading} className="rounded-lg">
                <div className="h-6 w-1/2 bg-gray-200 rounded-lg"></div> {/* Sender name */}
              </Skeleton>
              <Skeleton isLoaded={!loading} className="rounded-lg">
                <div className="h-6 w-2/3 bg-gray-200 rounded-lg"></div> {/* Sender address */}
              </Skeleton>
            </div>
            <div className="space-y-4">
              <Skeleton isLoaded={!loading} className="rounded-lg">
                <div className="h-6 w-1/3 bg-gray-200 rounded-lg"></div> {/* "To:" label */}
              </Skeleton>
              <Skeleton isLoaded={!loading} className="rounded-lg">
                <div className="h-6 w-1/2 bg-gray-200 rounded-lg"></div> {/* Recipient name */}
              </Skeleton>
              <Skeleton isLoaded={!loading} className="rounded-lg">
                <div className="h-6 w-2/3 bg-gray-200 rounded-lg"></div> {/* Recipient address */}
              </Skeleton>
            </div>
          </div>
  
          {/* Invoice Details Skeleton */}
          <div className="space-y-4">
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-6 w-1/4 bg-gray-200 rounded-lg"></div> {/* "Invoice Details" heading */}
            </Skeleton>
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-8 w-full bg-gray-200 rounded-lg"></div> {/* Table header */}
            </Skeleton>
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} isLoaded={!loading} className="rounded-lg">
                <div className="h-6 w-full bg-gray-200 rounded-lg"></div> {/* Table rows */}
              </Skeleton>
            ))}
          </div>
  
          {/* Totals Section Skeleton */}
          <div className="space-y-4">
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-6 w-1/3 bg-gray-200 rounded-lg"></div> {/* Subtotal */}
            </Skeleton>
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-6 w-1/3 bg-gray-200 rounded-lg"></div> {/* VAT */}
            </Skeleton>
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-8 w-1/2 bg-gray-200 rounded-lg"></div> {/* Total */}
            </Skeleton>
          </div>
        </div>
      </div>
    );
  }
  

  if (!invoice) {
    return (
      <div className="bg-red-500 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
        <p className="text-center">
          Unfortunately, the invoice you're looking for could not be found.<br />
          If you believe this is an error, please contact the sender for assistance.
        </p>
      </div>
    );
  }
  
  const shouldCalculateVAT = invoice.status === 'paid' ? invoice.vatAmount !== 0 : !!invoice.vatNumber;

  const calculateSubtotal = () => invoice.items.reduce((acc, item) => 
    acc + (Number(item.quantity) || 0) * (Number(item.cost) || 0), 0);

  const calculateVAT = () => (shouldCalculateVAT ? calculateSubtotal() * VAT_RATE : 0);
  const calculateTotal = () => calculateSubtotal() + calculateVAT();

  return (
    <div className="container mx-auto mt-8 p-10 max-w-3xl bg-white rounded-lg shadow-md border border-gray-200">
      <header className="text-center mb-8">
        <div className="mb-4">
          <img src={invoice.logoUrl || "/logo_side_transparent-background_black.png"} alt="Company Logo" className="w-auto h-auto max-w-[200px] max-h-[100px] mx-auto" />
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
