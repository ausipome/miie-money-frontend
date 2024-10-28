'use client';

import { Invoice } from '@/types';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface InvoiceListProps {
  onNewInvoiceClick: () => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ onNewInvoiceClick }) => {
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/account/get-invoices', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': xsrfToken,
          },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch invoices');
        
        const data = await response.json();
        setRecentInvoices(data.invoices); // Assuming API returns { invoices: [...] }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      {/* New Invoice Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Invoices</h2>
        <button
          onClick={onNewInvoiceClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          New Invoice
        </button>
      </div>

      {/* Loading/Error Message */}
      {loading && <p>Loading invoices...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* List of Recent Invoices */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Invoice Number</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-t">
                  <td className="px-4 py-2">{invoice.invoiceNumber}</td>
                  <td className="px-4 py-2">
                    {invoice.status === 'Paid' ? (
                      <span className="text-green-500 font-semibold">Paid</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Unpaid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
