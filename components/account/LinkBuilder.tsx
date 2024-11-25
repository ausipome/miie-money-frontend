'use client';

import useCheckUser from '@/hooks/useCheckUser';
import { useEffect, useState } from 'react';
import { AccountInfo, Contact, PaymentLink } from '../../types';
import Cookies from 'js-cookie';
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Input } from '@nextui-org/input';

interface LinkBuilderProps {
  customer?: Contact;
  linkData?: PaymentLink;
  backButton?: React.ReactNode;
  onNewLink: () => void;
  onHomeClick: () => void;
}

const LinkBuilder: React.FC<LinkBuilderProps> = ({ customer, linkData, backButton, onNewLink, onHomeClick }) => {
  const { userData } = useCheckUser();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(linkData?.logoUrl || null);
  const [description, setDescription] = useState(linkData?.description || '');
  const [amount, setAmount] = useState<string>(linkData?.subtotal?.toString() || ''); // Preload amount for existing links
  const [vatNumber, setVatNumber] = useState<string | null>(linkData?.vatNumber || null);
  const [linkId, setLinkId] = useState<string | null>(linkData?.linkId || null);
  const [linkUrl, setLinkUrl] = useState<string | null>(linkData?.url || null);
  const [customerDetails, setCustomerDetails] = useState<Contact>(linkData?.customer || customer || {} as Contact);
  const [loadingAction, setLoadingAction] = useState<'save' | 'send' | 'delete' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');

  const VAT_RATE = 0.20;
  const applicationFeeRate = userData?.application_fee || 0.01;

  useEffect(() => {
    if (userData) {
      try {
        const parsedAccount: AccountInfo = JSON.parse(userData.account);
        setAccountInfo(parsedAccount);
        setLogoUrl(userData.logo_url || null);
        setVatNumber(userData.vatNumber || null);
      } catch (e) {
        console.error('Error parsing account:', e);
      }
    }
  }, [userData]);

  // Parse amount safely, defaulting to 0 if empty
  const parseAmount = () => (amount ? parseFloat(amount) : 0);

  // Calculate VAT, Subtotal, and Total
  const calculateVAT = () => (vatNumber ? parseAmount() * VAT_RATE : 0);
  const calculateTotal = () => parseAmount() + calculateVAT();
  const applicationFee = parseFloat((calculateTotal() * applicationFeeRate).toFixed(2));

  const handleLinkAction = async (action: 'save' | 'send' | 'delete') => {
    setLoadingAction(action);

    if (action === 'delete' && !confirm('Are you sure you want to delete this link?')) {
      setLoadingAction(null);
      return;
    }

    const payload = {
      whereFrom: action, // Include the action for the backend
      linkId,
      url: linkUrl,
      creationDate: new Date().toISOString(),
      description,
      status: 'unpaid',
      customer: customerDetails,
      accountInfo: accountInfo || {},
      subtotal: parseAmount(),
      vatAmount: calculateVAT(),
      total: calculateTotal(),
      logoUrl: logoUrl || '',
      applicationFee,
    };

    try {
      const response = await fetch('/api/links/manage-payment-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({
          type: 'success',
          text: action === 'send'
            ? 'Link sent successfully! The customer will receive the link in their email. You can also copy the link above'
            : `Link ${action} successful!`,
        });
        setLinkUrl(data.url); // Update linkUrl with the backend-provided URL
        setLinkId(data.linkId); // Update linkId for future requests
        if (action === 'delete') {
          onHomeClick();
        }
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: `Failed to ${action} link: ${errorData.error}` });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error in link action: ${error.message}` });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSaveCustomerDetails = () => {
    setShowEditModal(false);
  };

  return (
    <div className="max-w-[70%] mx-auto mt-8 p-6 bg-white rounded shadow-md">
      {/* Back, Home, and New Link Buttons */}
      <div className="flex justify-between mb-4 text-base">
        <div className="flex space-x-2">
          {backButton}
          <Button onClick={onHomeClick} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Home
          </Button>
        </div>
        <Button onClick={onNewLink} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          New Link
        </Button>
      </div>

      {/* Sender and Customer Details */}
      <div className="flex justify-between items-start mb-8 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
        {/* Sender Details */}
        <div>
          <img src={logoUrl || '/logo_side_transparent-background_black.png'} alt="Company Logo" className="w-auto h-auto max-w-[200px] max-h-[100px] mb-2" />
          {userData?.business_type === 'individual' ? (
            <>
              <p>{accountInfo?.first_name} {accountInfo?.last_name}</p>
              <p>{accountInfo?.address?.line1}, {accountInfo?.address?.city}, {accountInfo?.address?.postal_code}</p>
            </>
          ) : userData?.business_type === 'company' ? (
            <>
              <p>{accountInfo?.name}</p>
              <p>{accountInfo?.address?.line1}, {accountInfo?.address?.city}, {accountInfo?.address?.postal_code}</p>
            </>
          ) : null}
        </div>

        {/* Customer Details */}
        <div>
          <h1 className="text-4xl font-bold">PAYMENT LINK</h1>
          <p><strong>Customer:</strong> {customerDetails.company || customerDetails.fullName}</p>
          <p>{customerDetails.address}, {customerDetails.townCity}, {customerDetails.countyState}, {customerDetails.postcodeZip}</p>
          <p><strong>Email:</strong> {customerDetails.email}</p>
          <p><strong>Phone:</strong> {customerDetails.phone}</p>
          {linkId && (
            <Button
              onClick={() => setShowEditModal(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-2"
            >
              Edit Customer
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-between">
        {/* Form Section */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-4 p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Amount (£)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mb-4 p-2 border rounded-md"
          />

          {/* Link URL Display */}
          {linkUrl && message?.type === 'success' && (
            <div className="mt-4">
              <div className="p-2 bg-gray-100 border rounded-md mt-2">
                <p className="text-sm">Payment Link:</p>
                <p className="text-blue-500">{linkUrl}</p>
                <Button
                  onClick={() => navigator.clipboard.writeText(linkUrl)}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Copy Link
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Totals Section */}
        <div className="flex flex-col items-end text-right ml-8">
          {vatNumber && (
            <>
              <p className="mb-2 text-lg">
                <strong>Subtotal:</strong> £{parseAmount().toFixed(2)}
              </p>
              <p className="mb-2 text-lg">
                <strong>VAT ({(VAT_RATE * 100).toFixed(0)}%):</strong> £{calculateVAT().toFixed(2)}
              </p>
            </>
          )}
          <p className="mb-2 text-lg font-bold">
            <strong>Total:</strong> £{calculateTotal().toFixed(2)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center mt-4 space-x-4">
        {linkId && (
          <Button
            onClick={() => handleLinkAction('delete')}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            disabled={loadingAction === 'delete'}
          >
            Delete Link
            {loadingAction === 'delete' && <Spinner className="ml-2" size="sm" />}
          </Button>
        )}
        <Button
          onClick={() => handleLinkAction('save')}
          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
          disabled={loadingAction === 'save'}
        >
          Save Link
          {loadingAction === 'save' && <Spinner className="ml-2" size="sm" />}
        </Button>
        <Button
          onClick={() => handleLinkAction('send')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loadingAction === 'send' || parseAmount() <= 0}
        >
          Send Link
          {loadingAction === 'send' && <Spinner className="ml-2" size="sm" />}
        </Button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mt-4 p-2 rounded ${message.type === 'success' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Modal for Editing Customer Details */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <ModalContent>
          <ModalHeader>Edit Contact</ModalHeader>
          <ModalBody>
            <Input label="Company" value={customerDetails.company || ''} onChange={(e) => setCustomerDetails({ ...customerDetails, company: e.target.value })} fullWidth />
            <Input label="Full Name" value={customerDetails.fullName || ''} onChange={(e) => setCustomerDetails({ ...customerDetails, fullName: e.target.value })} fullWidth />
            <Input label="Address" value={customerDetails.address || ''} onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })} fullWidth />
            <Input label="Town/City" value={customerDetails.townCity || ''} onChange={(e) => setCustomerDetails({ ...customerDetails, townCity: e.target.value })} fullWidth />
            <Input label="County/State" value={customerDetails.countyState || ''} onChange={(e) => setCustomerDetails({ ...customerDetails, countyState: e.target.value })} fullWidth />
            <Input label="Postcode/Zip" value={customerDetails.postcodeZip || ''} onChange={(e) => setCustomerDetails({ ...customerDetails, postcodeZip: e.target.value })} fullWidth />
            <Input label="Email" value={customerDetails.email || ''} onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })} fullWidth />
            <Input label="Phone" value={customerDetails.phone || ''} onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })} fullWidth />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSaveCustomerDetails} color="primary">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LinkBuilder;
