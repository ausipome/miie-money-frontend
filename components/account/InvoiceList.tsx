'use client';

import { Invoice } from '@/types';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

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

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/account/get-invoices', {
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

  // Handler to fetch and open a specific invoice by ID
  const handleInvoiceClick = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/account/get-invoice-by-id/${invoiceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch invoice');

      const invoice = await response.json();
      console.log("Loaded invoice data:", invoice); // Add logging to check data structure
      onOpenInvoice(invoice.invoice); // Pass only the `invoice` object if it's wrapped in { invoice: {...} }
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };

  // Filter invoices based on the search query
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
      {/* New Invoice Button and Search Bar */}
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

      {/* Loading/Error Message */}
      {loading && <p>Loading invoices...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* No Invoices Message */}
      {!loading && !error && recentInvoices.length === 0 && (
        <p className="text-center mt-4">There are no invoices.</p>
      )}

      {/* List of Filtered Invoices */}
      {!loading && !error && recentInvoices.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Invoice Number</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Total (£)</th>
                <th className="px-4 py-2 text-left">Status</th>
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
                  <td className="px-4 py-2">£{invoice.total.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    {invoice.status === 'paid' ? (
                      <span className="text-green-500 font-semibold">Paid</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Unpaid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredInvoices.length === 0 && recentInvoices.length > 0 && (
            <p className="text-center mt-4">No invoices match your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
