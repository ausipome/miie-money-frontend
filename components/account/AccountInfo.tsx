"use client";

import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import useCheckUser from '../../hooks/useCheckUser';
import Cookies from 'js-cookie';
import { Payment, Payout } from '../../types';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';

const AccountInfo = ({ settingsButton }: { settingsButton: React.ReactNode }) => {
  const [balances, setBalances] = useState({
    available: [{ amount: 0, currency: "gbp" }],
    pending: [{ amount: 0, currency: "gbp" }]
  });
  const [invoicePayments, setInvoicePayments] = useState<Payment[]>([]);
  const [linkPayments, setLinkPayments] = useState<Payment[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [allPayouts, setAllPayouts] = useState<Payout[]>([]);
  const [isPayoutsModalOpen, setPayoutsModalOpen] = useState(false);
  const { userData } = useCheckUser();
  const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');
  const [accountId] = useState(Cookies.get('accountId') || '');
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
    if (userData?.stripe_account_id) {
      const fetchBalances = async () => {
        try {
          const response = await fetch('/api/account/stripe-balance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': xsrfToken },
            credentials: 'include',
            body: JSON.stringify({ accountId: userData?.stripe_account_id }),
          });
          const data = await response.json();
          setBalances(data);
        } catch (error) {
          console.error('Error fetching balances:', error);
        }
      };
      fetchBalances();
    }
  }, [userData]);

  useEffect(() => {
    if (accountId) {
      const fetchPayments = async (endpoint: string, setPayments: React.Dispatch<React.SetStateAction<Payment[]>>) => {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': xsrfToken },
            credentials: 'include',
            body: JSON.stringify({ accountId }),
          });
          const data = await response.json();
          setPayments(data.paymentLinks.slice(0, 5));
        } catch (error) {
          console.error('Error fetching payments:', error);
        }
      };
      fetchPayments('/api/invoice/get-paid-invoices', setInvoicePayments);
      fetchPayments('/api/links/get-paid-links', setLinkPayments);
    }
  }, [accountId]);

  useEffect(() => {
    if (userData?.stripe_account_id) {
      const fetchPayouts = async () => {
        try {
          const response = await fetch('/api/account/stripe-payouts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': xsrfToken },
            credentials: 'include',
            body: JSON.stringify({ accountId: userData?.stripe_account_id }),
          });
          const data = await response.json();
          setPayouts(data.slice(0, 5));
          setAllPayouts(data);
        } catch (error) {
          console.error('Error fetching payouts:', error);
        }
      };
      fetchPayouts();
    }
  }, [userData]);

  return (
    <div className="p-8 space-y-8 bg-gradient-to-r from-blue-50 to-gray-100 rounded-lg shadow-lg">
      {/* Render the settings button */}
      <div className="mt-4 flex justify-end">
                {settingsButton}
            </div>
      {/* Account Balance */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Balance</h2>
        <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-sm">
  <thead className="bg-blue-100">
    <tr>
      <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
      <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="border border-gray-300 px-4 py-2">Pending
      <Tippy content="Pending balances will become available at the end of the business day.">
          <span className="ml-2 cursor-pointer text-red-500"><FontAwesomeIcon icon={byPrefixAndName.far['circle-info']} /></span>
        </Tippy>
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {symbol}{Number(balances.pending[0].amount || 0).toFixed(2)}
      </td>
    </tr>
    <tr>
      <td className="border border-gray-300 px-4 py-2">Available
      <Tippy content="Available balances will be automatically paid out to your bank account at the end of the business day.">
          <span className="ml-2 cursor-pointer text-red-500"><FontAwesomeIcon icon={byPrefixAndName.far['circle-info']} /></span>
        </Tippy>
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {symbol}{Number(balances.available[0].amount || 0).toFixed(2)}
      </td>
    </tr>
  </tbody>
</table>
      </div>

      {/* Payment Assets */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Assets
        <Tippy content="Recent payments for your payment assets will be displayed here.">
          <span className="ml-2 cursor-pointer text-red-500"><FontAwesomeIcon icon={byPrefixAndName.far['circle-info']} /></span>
        </Tippy>
        </h2>

        {/* Invoice Payments */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Invoice Payments</h3>
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Customer</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoicePayments.length > 0 ? (
                invoicePayments.map((payment, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{payment.receiptDate}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {payment.customer?.company || 'N/A'} ({payment.customer?.fullName})
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{symbol}{payment.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="border border-gray-300 px-4 py-2 text-center">
                    No Recent Invoice Payments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Link Payments */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Link Payments</h3>
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Customer</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {linkPayments.length > 0 ? (
                linkPayments.map((payment, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{payment.receiptDate}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {payment.customer?.company || 'N/A'} ({payment.customer?.fullName})
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{symbol}{payment.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="border border-gray-300 px-4 py-2 text-center">
                    No Recent Link Payments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Payouts */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Payouts <Tippy content="Payouts will be automatically sent to your bank account at the end of the business day (Created), and arrive on Arrival Date.">
          <span className="ml-2 cursor-pointer text-red-500"><FontAwesomeIcon icon={byPrefixAndName.far['circle-info']} /></span>
        </Tippy>
        </h2>
        <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Created</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Arrival Date</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(payout.created * 1000).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {symbol}{payout.amount.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(payout.arrivalDate * 1000).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{payout.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button color="primary" className="mt-4" onClick={() => setPayoutsModalOpen(true)}>
          View All Payouts
        </Button>
      </div>

      {/* Payouts Modal */}
      <Modal isOpen={isPayoutsModalOpen} size={'3xl'} onClose={() => setPayoutsModalOpen(false)} className="w-full sm:w-1/2">
        <ModalContent>
          <ModalHeader>
            <h3>All Payouts</h3>
          </ModalHeader>
          <ModalBody>
            <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Created</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Arrival Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {allPayouts.map((payout, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(payout.created * 1000).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {symbol}{payout.amount.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(payout.arrivalDate * 1000).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{payout.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ModalBody>
          <ModalFooter>
          <button
          className="bg-gray-500 text-white py-2 px-4 rounded-md"
          onClick={() => setPayoutsModalOpen(false)}
            >
            Close
          </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AccountInfo;
