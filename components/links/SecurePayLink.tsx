'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { AccountInfo, PaymentLink } from '../../types';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { Skeleton } from '@nextui-org/skeleton';

export default function SecurePayLink() {
  const searchParams = useSearchParams();
  const linkId = searchParams.get('link');
  const stripeAccount = searchParams.get('account');

  const stripePromise = useMemo(() => {
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey) {
      throw new Error('Stripe publishable key is not defined');
    }
    return loadStripe(stripeKey, {
      stripeAccount: stripeAccount || undefined,
    });
  }, [stripeAccount]);

  const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'error'; text: string } | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [initializingPayment, setInitializingPayment] = useState(false);
  const [whichTax, setWhichTax] = useState('Sales Tax ');
  const [symbol, setSymbol] = useState('$');
  const country = paymentLink?.countryCode || 'US';

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
        setMessage(null);
      } catch (error) {
        console.error('Error fetching payment link:', error);
        setMessage({ type: 'error', text: 'Failed to load payment link.' });
      } finally {
        setLoading(false);
      }
    }

    fetchPaymentLink();
  }, [linkId]);

  useEffect(() => {
    if (paymentLink && !clientSecret && !initializingPayment) {
      initializePayment();
    }
  }, [paymentLink]);

  const initializePayment = async () => {
    if (!paymentLink || clientSecret || initializingPayment) return;

    setInitializingPayment(true);

    const countryCode = paymentLink.countryCode || 'GB';
    const currencyMap = { GB: 'gbp', US: 'usd', CA: 'cad', AU: 'aud', NZ: 'nzd' };
    const currency = currencyMap[countryCode as keyof typeof currencyMap] || 'usd';

    const amount = Math.round(paymentLink.total * 100);
    const applicationFee = Math.round(paymentLink.applicationFee * 100);

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
      setInitializingPayment(false);
    }
  };

  const calculateSubtotal = () => paymentLink?.subtotal || 0;
  const calculateVAT = () => paymentLink?.vatAmount || 0;
  const calculateTotal = () => calculateSubtotal() + calculateVAT();

  const showVAT = (paymentLink?.vatAmount ?? 0) > 0;

  if (loading) {
    return (
      <div className="container mx-auto mt-8 p-10 max-w-3xl bg-gray-100 rounded-lg shadow-md border border-gray-200">
        <Skeleton isLoaded={!loading}>
          <div className="h-40 w-full bg-gray-300 rounded-md"></div>
        </Skeleton>
      </div>
    );
  }

  if (!paymentLink) {
    return (
      <div className="bg-blue-500 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
        <p className="text-center">The requested payment link could not be found. If you believe this to be an error, please contact the sender for assistance.</p>
      </div>
    );
  }

  const isPaid = paymentLink.status === 'paid';

  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  return (
    <div className="container mx-auto mt-8 p-10 max-w-3xl bg-white rounded-lg shadow-md border border-gray-200">
      <header className="text-center mb-8">
        <div className="mb-4">
          <img src={paymentLink.logoUrl || "/logo_side_transparent-background_black.png"} alt="Company Logo" className="w-auto h-auto max-w-[200px] max-h-[100px] mx-auto" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">PAYMENT LINK</h1>
        <p className="text-lg text-gray-500 mt-2">Payment Link ID: {paymentLink.linkId}</p>
        <p className="text-lg text-gray-500">Date: {new Date(paymentLink.creationDate).toLocaleDateString()}</p>
      </header>

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
          <p className="text-gray-600">{paymentLink.customer?.company || paymentLink.customer?.fullName}</p>
          <p className="text-gray-600">{paymentLink.customer?.address}</p>
          <p className="text-gray-600">{paymentLink.customer?.townCity}, {paymentLink.customer?.countyState} {paymentLink.customer?.postcodeZip}</p>
          <p className="text-gray-600">Email: {paymentLink.customer?.email}</p>
          <p className="text-gray-600">Phone: {paymentLink.customer?.phone}</p>
        </div>
      </div>

      {paymentLink.description && (
        <div className="border-t border-gray-300 mt-6 py-4">
          <h2 className="text-xl font-semibold text-gray-700">Description:</h2>
          <p className="text-gray-600">{paymentLink.description}</p>
        </div>
      )}

      <div className="border-t border-gray-300 mt-6 py-6">
        <div className="flex justify-end py-2">
          <span className="text-lg font-semibold text-gray-700 mr-4">Subtotal:</span>
          <span className="text-lg font-medium text-gray-800">{symbol}{calculateSubtotal().toFixed(2)}</span>
        </div>
        {showVAT && (
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

      {isPaid ? (
        <div style={{ textAlign: 'center', color: 'green', fontSize: '2rem', fontWeight: 'bold' }}>
          PAID
        </div>
      ) : clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm linkId={linkId} />
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
