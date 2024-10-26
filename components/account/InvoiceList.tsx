'use client';

import { Invoice } from '@/types';
import React from 'react';

interface InvoiceListProps {
  onNewInvoiceClick: () => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ onNewInvoiceClick }) => {
  // Dummy data for 10 invoices
  const recentInvoices: Invoice[] = [
    { id: 1, invoiceNumber: 'INV001', status: 'Paid' },
    { id: 2, invoiceNumber: 'INV002', status: 'Unpaid' },
    { id: 3, invoiceNumber: 'INV003', status: 'Paid' },
    { id: 4, invoiceNumber: 'INV004', status: 'Unpaid' },
    { id: 5, invoiceNumber: 'INV005', status: 'Paid' },
    { id: 6, invoiceNumber: 'INV006', status: 'Unpaid' },
    { id: 7, invoiceNumber: 'INV007', status: 'Paid' },
    { id: 8, invoiceNumber: 'INV008', status: 'Unpaid' },
    { id: 9, invoiceNumber: 'INV009', status: 'Paid' },
    { id: 10, invoiceNumber: 'INV010', status: 'Unpaid' },
  ];

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

      {/* List of Recent Invoices */}
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
    </div>
  );
};

export default InvoiceList;
