'use client';

import { Invoice } from '@/types';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Skeleton } from '@nextui-org/skeleton';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';

interface InvoiceListProps {
  onNewInvoiceClick: () => void;
  onOpenInvoice: (invoice: Invoice) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ onNewInvoiceClick, onOpenInvoice }) => {
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const country = Cookies.get('country') || 'US';
  const [symbol, setSymbol] = useState('$');

  useEffect(() => {
    switch (country) {
      case 'GB':
        setSymbol('£');
        break;
      default:
        setSymbol('$');
        break;
    }
  }, [country]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/invoice/get-invoices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': xsrfToken,
          },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch invoices');

        const data = await response.json();
        setRecentInvoices(data.invoices);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleInvoiceClick = async (invoiceId: string) => {
    try {
      const response = await fetch(`/get-invoice-by-id/${invoiceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch invoice');

      const invoice = await response.json();
      onOpenInvoice(invoice.invoice);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };

  const handleResendReceipt = async (invoiceId: string) => {
    setLoadingAction('resend');
    try {
      const response = await fetch('/payment-complete-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ invoiceId }),
      });

      if (!response.ok) throw new Error('Failed to resend receipt');

      setSuccessMessage('Receipt resent successfully!');
    } catch (error) {
      console.error('Error resending receipt:', error);
      setSuccessMessage('Failed to resend receipt.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePaymentInfo = async (paymentIntent: string) => {
    try {
      const response = await fetch('/api/invoice/get-payment-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ paymentIntent }),
      });

      if (!response.ok) throw new Error('Failed to fetch payment info');

      const data = await response.json();
      setPaymentInfo(data);
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Error fetching payment info:', error);
    }
  };

  const filteredInvoices = recentInvoices.filter((invoice) => {
    const searchLower = searchQuery.toLowerCase();
    const customerName = invoice.customer.company || invoice.customer.fullName;
    return (
      invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
      customerName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Invoices</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border rounded-md w-64"
          />
          <button
            onClick={onNewInvoiceClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            New Invoice
          </button>
        </div>
      </div>

      {loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
              {["Invoice Number", "Date", "Customer", `Total (${symbol})`, "Status", "Actions"].map((header, index) => (
                  <th key={index} className="px-4 py-2 text-left">
                    <Skeleton isLoaded={!loading} className="rounded-lg">
                      <div className="h-6 w-32 bg-gray-300 rounded"></div>
                    </Skeleton>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex} className="border-t">
                  {[...Array(6)].map((_, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-2">
                      <Skeleton isLoaded={!loading} className="rounded-lg">
                        <div className="h-6 w-full bg-gray-300 rounded"></div>
                      </Skeleton>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && filteredInvoices.length === 0 && recentInvoices.length > 0 && (
        <p className="text-gray-500 text-center">No matching invoices found for your search.</p>
      )}

      {!loading && !error && recentInvoices.length === 0 && (
        <p className="text-gray-500 text-center">You have no invoices. Click "New Invoice" to create one.</p>
      )}

      {!loading && !error && filteredInvoices.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Invoice Number</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Total ({symbol})</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.invoiceId}
                  className="border-t cursor-pointer hover:bg-gray-100"
                  onClick={() => handleInvoiceClick(invoice.invoiceId)}
                >
                  <td className="px-4 py-2">{invoice.invoiceNumber}</td>
                  <td className="px-4 py-2">{invoice.invoiceDate}</td>
                  <td className="px-4 py-2">
                    {invoice.customer.company || invoice.customer.fullName}
                  </td>
                  <td className="px-4 py-2">{symbol}{invoice.total.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    {invoice.status === 'paid' ? (
                      <span className="text-green-500 font-semibold">Paid</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Unpaid</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {invoice.status === 'paid' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInvoice(invoice);
                          handlePaymentInfo(invoice.paymentIntent);
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        View Payment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPaymentModal && selectedInvoice && (
        <Modal isOpen={showPaymentModal} onClose={() => {
          setShowPaymentModal(false);
          setSuccessMessage(null);
        }}>
          <ModalContent>
            <ModalHeader>Payment Information</ModalHeader>
            <ModalBody>
              {paymentInfo ? (
                <table className="table-auto w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b">Details</th>
                      <th className="px-4 py-2 border-b">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border-b">Amount</td>
                      <td className="px-4 py-2 border-b">{symbol}{(paymentInfo.amount / 100).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">Fees</td>
                      <td className="px-4 py-2 border-b">{symbol}{(paymentInfo.stripe_fees / 100).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">Net Amount</td>
                      <td className="px-4 py-2 border-b">{symbol}{(paymentInfo.net_amount / 100).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">Charge Date</td>
                      <td className="px-4 py-2 border-b">
                        {new Date(paymentInfo.charge_date * 1000).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>Loading payment details...</p>
              )}
              {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() => handleResendReceipt(selectedInvoice.invoiceId)}
                color="primary"
                disabled={loadingAction === 'resend'}
              >
                Resend Receipt
                {loadingAction === 'resend' && <Spinner className="ml-2" color="warning" size="sm" />}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default InvoiceList;
