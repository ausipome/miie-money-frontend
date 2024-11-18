'use client';

import { PaymentLink } from '@/types';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Skeleton } from '@nextui-org/skeleton';
import { Button } from '@nextui-org/button';

interface LinkListProps {
  onNewLinkClick: () => void;
  onOpenLink: (link: PaymentLink) => void;
}

const LinkList: React.FC<LinkListProps> = ({ onNewLinkClick, onOpenLink }) => {
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch('/api/payment-links', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': xsrfToken,
          },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch links');

        const data = await response.json();
        setLinks(data.links);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const filteredLinks = links.filter((link) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      link.customerName.toLowerCase().includes(searchLower) ||
      link.description.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Payment Links</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border rounded-md w-64"
          />
          <button
            onClick={onNewLinkClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            New Link
          </button>
        </div>
      </div>

      {loading && <Skeleton className="w-full h-12" />}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && filteredLinks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Amount (£)</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map((link) => (
                <tr
                  key={link.linkId}
                  className="border-t cursor-pointer hover:bg-gray-100"
                  onClick={() => onOpenLink(link)}
                >
                  <td className="px-4 py-2">{link.description}</td>
                  <td className="px-4 py-2">£{link.amount.toFixed(2)}</td>
                  <td className="px-4 py-2">{link.customerName}</td>
                  <td className="px-4 py-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(link.linkUrl);
                      }}
                    >
                      Copy Link
                    </button>
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

export default LinkList;
