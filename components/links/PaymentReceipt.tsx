'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@nextui-org/skeleton';
import { AccountInfo, PaymentLink } from '../../types';

export default function PaymentLinkReceipt() {
  const searchParams = useSearchParams();
  const linkId = searchParams.get('link');
  const paymentIntent = searchParams.get('payment_intent');

  const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const RECEIPT_DATE = new Date().toLocaleDateString(); // Receipt date set to the current date when receipt is generated.
  const VAT_RATE = 0.20;

  useEffect(() => {
    if (!linkId) return;

    async function fetchPaymentLink() {
      setLoading(true);
      try {
        const response = await fetch(`/get-link-by-id/${linkId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch payment link');
        
        const { paymentLink: fetchedPaymentLink } = await response.json();
        setPaymentLink(fetchedPaymentLink);
        setAccountInfo(fetchedPaymentLink.accountInfo);
      } catch (error) {
        console.error('Error fetching payment link:', error);
        setMessage('Failed to load payment link.');
        setLoading(false);
      } 
    }

    async function updatePaymentLinkStatus() {
      try {
        const response = await fetch('/payment-complete-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ linkId, paymentIntent, receiptDate: RECEIPT_DATE }),
        });
        if (!response.ok) throw new Error('Failed to update payment link status');
        
        setMessage('Your payment has been successfully completed. A copy of this receipt has been emailed to you.');
        setLoading(false);
      } catch (error) {
        console.error('Error updating payment link status:', error);
        setMessage('Failed to update payment link status.');
        setLoading(false);
      }
    }

    fetchPaymentLink();
    updatePaymentLinkStatus();
  }, [linkId]);

  if (loading) { 
    return (
      <div className="flex flex-col items-center h-screen w-full gap-6 bg-gray-100">
        {/* Full-screen skeleton container */}
        <div className="w-[90%] max-w-3xl space-y-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <Skeleton isLoaded={!loading}>
            <div className="h-40 w-full bg-gray-300 rounded-md"></div>
          </Skeleton>
        </div>
      </div>
    );
  }

  if (!paymentLink) {
    return (
      <div className="bg-red-500 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
        <p className="text-center">
          Unfortunately, the payment link you're looking for could not be found.<br />
          If you believe this is an error, please contact the sender for assistance.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 p-10 max-w-3xl bg-white rounded-lg shadow-md border border-gray-200">
      <header className="text-center mb-8">
        <div className="mb-4">
          <img src={paymentLink.logoUrl || "/logo_side_transparent-background_black.png"} alt="Company Logo" className="w-auto h-auto max-w-[200px] max-h-[100px] mx-auto" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">PAYMENT RECEIPT</h1>
        <p className="text-lg text-gray-500 mt-2">Receipt Number: {paymentLink.linkId}</p>
        <p className="text-lg text-gray-500">Date: {RECEIPT_DATE}</p>
      </header>

      {/* Sender and Receiver Information */}
      <div className="border-t border-gray-300 py-6 flex justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">From:</h2>
          <p className="text-gray-600">{accountInfo?.first_name} {accountInfo?.last_name}</p>
          <p className="text-gray-600">{accountInfo?.address?.line1}</p>
          <p className="text-gray-600">{accountInfo?.address?.city}, {accountInfo?.address?.postal_code}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700">To:</h2>
          <p className="text-gray-600">{paymentLink.customer?.company || paymentLink.customer?.fullName}</p>
          <p className="text-gray-600">{paymentLink.customer?.address}</p>
          <p className="text-gray-600">{paymentLink.customer?.townCity}, {paymentLink.customer?.countyState} {paymentLink.customer?.postcodeZip}</p>
          <p className="text-gray-600">Email: {paymentLink.customer?.email}</p>
          <p className="text-gray-600">Phone: {paymentLink.customer?.phone}</p>
        </div>
      </div>

      {/* Description Section */}
      {paymentLink.description && (
        <div className="border-t border-gray-300 mt-6 py-4">
          <h2 className="text-xl font-semibold text-gray-700">Description:</h2>
          <p className="text-gray-600">{paymentLink.description}</p>
        </div>
      )}

      {/* Totals Section */}
      <div className="border-t border-gray-300 mt-6 py-6">
        <div className="flex justify-end py-2">
          <span className="text-lg font-semibold text-gray-700 mr-4">Subtotal:</span>
          <span className="text-lg font-medium text-gray-800">£{paymentLink.subtotal.toFixed(2)}</span>
        </div>
        {paymentLink.vatAmount > 0 && (
          <div className="flex justify-end py-2">
            <span className="text-lg font-semibold text-gray-700 mr-4">VAT ({VAT_RATE * 100}%):</span>
            <span className="text-lg font-medium text-gray-800">£{paymentLink.vatAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-end py-2 mt-4 border-t border-gray-300 pt-4">
          <span className="text-xl font-bold text-gray-900 mr-4">Total:</span>
          <span className="text-xl font-bold text-gray-900">£{paymentLink.total.toFixed(2)}</span>
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