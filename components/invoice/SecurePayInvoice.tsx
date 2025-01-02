'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { AccountInfo, Invoice } from '../../types';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { Skeleton } from '@nextui-org/skeleton';

export default function SecurePayInvoice() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('invoice');
  const stripeAccount = searchParams.get('account');

  // Memoized stripePromise to only load when stripeAccount changes
  const stripePromise = useMemo(() => {
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey) {
      throw new Error('Stripe publishable key is not defined');
    }
    return loadStripe(stripeKey, {
      stripeAccount: stripeAccount || undefined,
    });
  }, [stripeAccount]);

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'error'; text: string } | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [initializingPayment, setInitializingPayment] = useState(false); // New state to track initialization
  const [whichTax, setWhichTax] = useState('Sales Tax ');
  const [symbol, setSymbol] = useState('$');
  const country = invoice?.countryCode || 'US';

    // Update tax-related labels and messages based on the country
    useEffect(() => {
      switch (country) {
        case 'GB':
          setWhichTax('VAT ');
          setSymbol('£');
          break;
        case 'US':
          setWhichTax('Sales Tax ');
          break;
        case 'AU':
          setWhichTax('GST ');
          break;
        case 'NZ':
          setWhichTax('GST ');
          break;
        case 'CA':
          setWhichTax('Tax ');
          break;
        default:
          break;
      }
    }, [country]);

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
        setMessage(null);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        setMessage({ type: 'error', text: 'Failed to load invoice.' });
      } finally {
        setLoading(false);
      }
    }

    fetchInvoice();
  }, [invoiceId]);

  useEffect(() => {
    if (invoice && !clientSecret && !initializingPayment) {
      initializePayment();
    }
  }, [invoice]);

  const initializePayment = async () => {
    if (!invoice || clientSecret || initializingPayment) return;

    setInitializingPayment(true); // Set initializing to true to prevent multiple calls

    const countryCode = invoice.countryCode || 'GB';
    const currencyMap = { GB: 'gbp', US: 'usd', CA: 'cad', AU: 'aud', NZ: 'nzd' };
    const currency = currencyMap[countryCode as keyof typeof currencyMap] || 'usd';

    const amount = Math.round(calculateTotal() * 100);
    const applicationFee = Math.round(invoice.applicationFee * 100);

    try {
      const response = await fetch('/get-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, application_fee: applicationFee, stripeAccount }),
      });

      if (!response.ok) throw new Error('Failed to create PaymentIntent');
      const { client_secret: newClientSecret } = await response.json();
        setClientSecret(newClientSecret);
    } catch (error) {
      console.error('Error creating PaymentIntent:', error);
      setMessage({ type: 'error', text: 'Failed to initialize payment.' });
    } finally {
      setInitializingPayment(false); // Reset initializing after attempt
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto mt-8 p-10 max-w-3xl bg-gray-100 rounded-lg shadow-md border border-gray-200">
        {/* Header Skeleton */}
        <header className="text-center mb-8">
          <div className="mb-4">
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-20 w-40 bg-gray-300 mx-auto rounded"></div> {/* Logo placeholder */}
            </Skeleton>
          </div>
          <Skeleton isLoaded={!loading} className="rounded-lg">
            <div className="h-8 w-1/2 bg-gray-300 mx-auto mb-2 rounded"></div> {/* Title placeholder */}
          </Skeleton>
          <Skeleton isLoaded={!loading} className="rounded-lg">
            <div className="h-6 w-1/3 bg-gray-300 mx-auto mb-1 rounded"></div> {/* Invoice Number */}
          </Skeleton>
          <Skeleton isLoaded={!loading} className="rounded-lg">
            <div className="h-6 w-1/4 bg-gray-300 mx-auto rounded"></div> {/* Date */}
          </Skeleton>
        </header>
  
        {/* Sender and Receiver Information Skeleton */}
        <div className="border-t border-gray-300 py-6 flex justify-between">
          <div className="space-y-2">
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-6 w-1/4 bg-gray-300 mb-2 rounded"></div> {/* "From:" */}
            </Skeleton>
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} isLoaded={!loading} className="rounded-lg">
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div> {/* From Info */}
              </Skeleton>
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-6 w-1/4 bg-gray-300 mb-2 rounded"></div> {/* "To:" */}
            </Skeleton>
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} isLoaded={!loading} className="rounded-lg">
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div> {/* To Info */}
              </Skeleton>
            ))}
          </div>
        </div>
  
        {/* Invoice Details Skeleton */}
        <div className="border-t border-gray-300 mt-6 py-6">
          <Skeleton isLoaded={!loading} className="rounded-lg mb-4">
            <div className="h-6 w-1/3 bg-gray-300 mb-2 rounded"></div> {/* "Invoice Details" */}
          </Skeleton>
          <Skeleton isLoaded={!loading} className="rounded-lg">
            <div className="h-8 w-full bg-gray-300 rounded mb-2"></div> {/* Table Header */}
          </Skeleton>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} isLoaded={!loading} className="rounded-lg">
              <div className="h-6 w-full bg-gray-300 mb-2 rounded"></div> {/* Table Rows */}
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
      </div>
    );
  }
  
  if (!invoice) return <div className="bg-blue-500 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
  <p className="text-center">The requested invoice could not be found. If you believe this to be an error, please contact the sender for assistance.</p>
</div>
;

  const isPaid = invoice.status === 'paid';
  const shouldCalculateVAT = isPaid ? invoice.vatAmount !== 0 : !!invoice.taxNumber;

  const calculateSubtotal = () => invoice.items.reduce((acc, item) => 
    acc + (Number(item.quantity) || 0) * (Number(item.cost) || 0), 0);

  const calculateVAT = () => invoice?.vatAmount || 0;
  const calculateTotal = () => calculateSubtotal() + calculateVAT();

  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  return (
    <div className="container mx-auto mt-8 p-10 max-w-3xl bg-white rounded-lg shadow-md border border-gray-200">
      <header className="text-center mb-8">
        <div className="mb-4">
          <img src={invoice.logoUrl || "/logo_side_transparent-background_black.png"} alt="Company Logo" className="w-auto h-auto max-w-[200px] max-h-[100px] mx-auto" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">INVOICE</h1>
        <p className="text-lg text-gray-500 mt-2">Invoice Number: {invoice.invoiceNumber}</p>
        <p className="text-lg text-gray-500">Date: {invoice.invoiceDate}</p>
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
        {shouldCalculateVAT && (
          <div className="flex justify-end py-2">
            <span className="text-lg font-semibold text-gray-700 mr-4">{whichTax} :</span>
            <span className="text-lg font-medium text-gray-800">{symbol}{calculateVAT().toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-end py-2 mt-4 border-t border-gray-300 pt-4">
          <span className="text-xl font-bold text-gray-900 mr-4">Total:</span>
          <span className="text-xl font-bold text-gray-900">{symbol}{calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Stripe Payment Section */}
      {isPaid ? (
        <div style={{ textAlign: 'center', color: 'green', fontSize: '2rem', fontWeight: 'bold' }}>
          PAID
        </div>
      ) : clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm invoiceId={invoiceId} />
        </Elements>
      ) : (
        <p>Payment initialization in progress...</p>
      )}


      {message && (
        <div className={`mt-4 p-2 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
