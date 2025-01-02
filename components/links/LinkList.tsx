"use client";

import { PaymentLink } from '@/types';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Skeleton } from '@nextui-org/skeleton';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';

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
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [selectedLink, setSelectedLink] = useState<PaymentLink | null>(null);
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
    const fetchLinks = async () => {
      try {
        const response = await fetch('/api/links/get-payment-links', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': xsrfToken,
          },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch links');

        const data = await response.json();
        setLinks(data.paymentLinks);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [xsrfToken]);

  const handleLinkClick = async (linkId: string) => {
    try {
      const response = await fetch(`/get-link-by-id/${linkId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch link details');

      const data = await response.json();
      onOpenLink(data.paymentLink);
    } catch (error) {
      console.error('Error fetching link details:', error);
      setError('Error fetching link details.');
    }
  };

  const handleResendReceipt = async (linkId: string) => {
    setLoadingAction('resend');
    try {
      const response = await fetch('/payment-complete-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ linkId }),
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

  const handleViewPayment = async (link: PaymentLink) => {
    try {
      const response = await fetch('/api/invoice/get-payment-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ paymentIntent: link.paymentIntent }),
      });

      if (!response.ok) throw new Error('Failed to fetch payment info');

      const data = await response.json();
      setPaymentInfo(data);
      setSelectedLink(link);
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Error fetching payment info:', error);
    }
  };

  const filteredLinks = links.filter((link) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      link.customer?.fullName?.toLowerCase().includes(searchLower) ||
      link.description?.toLowerCase().includes(searchLower) ||
      link.customer?.company?.toLowerCase().includes(searchLower)
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

      {!loading && !error && filteredLinks.length === 0 && links.length > 0 && (
        <p className="text-gray-500 text-center">No matching links found for your search.</p>
      )}

      {!loading && !error && links.length === 0 && (
        <p className="text-gray-500 text-center">You have no payment links. Click "New Link" to create one.</p>
      )}

      {!loading && !error && filteredLinks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Amount ({symbol})</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Company</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map((link) => (
                <tr
                  key={link.linkId}
                  className="border-t cursor-pointer hover:bg-gray-100"
                  onClick={() => handleLinkClick(link.linkId)}
                >
                  <td className="px-4 py-2">{link.description || 'N/A'}</td>
                  <td className="px-4 py-2">{symbol}{(link.total).toFixed(2)}</td>
                  <td className="px-4 py-2">{link.customer?.fullName || 'N/A'}</td>
                  <td className="px-4 py-2">{link.customer?.company || 'N/A'}</td>
                  <td className="px-4 py-2">
                    {link.status === 'paid' ? (
                      <span className="text-green-500 font-semibold">Paid</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Unpaid</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {link.status === 'paid' && (
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPayment(link);
                        }}
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

      {showPaymentModal && selectedLink && (
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
                              onClick={() => handleResendReceipt(selectedLink.linkId)}
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

export default LinkList;
