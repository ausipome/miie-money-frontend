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
  const [amount, setAmount] = useState<string>(linkData?.subtotal?.toFixed(2)?.toString() || '');
  const [vatNumber, setVatNumber] = useState<string | null>(linkData?.vatNumber || null);
  const [linkId, setLinkId] = useState<string | null>(linkData?.linkId || null);
  const [linkUrl, setLinkUrl] = useState<string | null>(linkData?.url || null);
  const [customerDetails, setCustomerDetails] = useState<Contact>(linkData?.customer || customer || {} as Contact);
  const [loadingAction, setLoadingAction] = useState<'save' | 'send' | 'delete' | 'generateEmail' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');

  const VAT_RATE = 0.20;
  const applicationFeeRate = userData?.application_fee || 0.01;
  const isPaid = linkData?.status === 'paid';
  const isNewLink = !linkId;

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

  const calculateVAT = () => (vatNumber ? parseFloat(amount || '0') * VAT_RATE : 0);
  const calculateTotal = () => parseFloat(amount || '0') + calculateVAT();

  const handleLinkAction = async (action: 'save' | 'send' | 'delete') => {
    setLoadingAction(action);

    if (action === 'delete' && !confirm('Are you sure you want to delete this link?')) {
      setLoadingAction(null);
      return;
    }

    const payload = {
      whereFrom: action,
      linkId,
      url: linkUrl,
      creationDate: new Date().toISOString(),
      description,
      status: 'unpaid',
      customer: customerDetails,
      accountInfo: accountInfo || {},
      subtotal: parseFloat(amount || '0'),
      vatAmount: calculateVAT(),
      total: calculateTotal(),
      logoUrl: logoUrl || '',
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
            ? 'Link sent successfully! The customer will receive the link in their email. You can also copy the link above.'
            : `Link ${action} successful!`,
        });
        setLinkUrl(data.url); // Update the link URL after success
        setLinkId(data.linkId); // Update link ID for new links
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

  const generateEmailFromDescription = async () => {
    setLoadingAction('generateEmail');
    try {
      const response = await fetch('/api/account/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ description }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedEmail(data.email);
        setMessage({ type: 'success', text: 'Email generated successfully!' });
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: `Failed to generate email: ${errorData.error}` });
      }
    } catch (error) {
      console.error('Error generating email:', error);
      setMessage({ type: 'error', text: 'Error generating email' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAmountBlur = () => {
    if (amount) {
      setAmount(parseFloat(amount).toFixed(2));
    }
  };

  const handleSaveCustomerDetails = async () => {
    try {
      const updatedLink = {
        ...linkData,
        customer: customerDetails,
      };
      const response = await fetch(`/api/links/manage-payment-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(updatedLink),
      });
  
      if (response.ok) {
        setShowEditModal(false);
        setMessage({ type: 'success', text: 'Customer details updated successfully!' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save customer details.' });
      }
    } catch (error) {
      console.error('Error updating customer details:', error);
      setMessage({ type: 'error', text: 'Failed to update customer details.' });
    }
  };
  

  return (
    <div className="max-w-[70%] mx-auto mt-8 p-6 bg-white rounded shadow-md">
      {/* Back and Home Buttons */}
      <div className="flex justify-between mb-4 text-base">
        <div className="flex space-x-2">
          {!isPaid && isNewLink && backButton}
          <Button onClick={onHomeClick} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Home
          </Button>
        </div>
        {isNewLink && (
          <Button onClick={onNewLink} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            New Link
          </Button>
        )}
      </div>

      {/* Sender and Customer Details */}
      <div className="flex justify-between items-start mb-8 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
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

        <div>
          <h1 className="text-4xl font-bold">PAYMENT LINK</h1>
          <p><strong>Customer:</strong> {customerDetails.company || customerDetails.fullName}</p>
          <p>{customerDetails.address}, {customerDetails.townCity}, {customerDetails.countyState}, {customerDetails.postcodeZip}</p>
          <p><strong>Email:</strong> {customerDetails.email}</p>
          <p><strong>Phone:</strong> {customerDetails.phone}</p>
          {!isPaid && linkId && (
            <Button
              onClick={() => setShowEditModal(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-2"
            >
              Edit Customer
            </Button>
          )}
        </div>
      </div>

      {/* Form Section */}
      <div>
        <Input
          type="text"
          placeholder="Description"
          value={description}
          readOnly={isPaid}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4"
        />
        <Input
          type="text"
          placeholder="Amount (£)"
          value={amount}
          readOnly={isPaid}
          onChange={(e) => setAmount(e.target.value)}
          onBlur={handleAmountBlur}
          className="w-full mb-4"
        />

        {/* Totals Section */}
        <div className="mt-4 bg-gray-100 p-4 rounded-md shadow-sm">
          <p><strong>Subtotal:</strong> £{parseFloat(amount || '0').toFixed(2)}</p>
          {vatNumber && <p><strong>VAT ({(VAT_RATE * 100).toFixed(0)}%):</strong> £{calculateVAT().toFixed(2)}</p>}
          <p><strong>Total:</strong> £{calculateTotal().toFixed(2)}</p>
        </div>

        {/* Payment Link or Status Display */}
        {linkUrl && !isPaid ? (
          <div className="mt-4">
            <div className="p-2 bg-gray-100 border rounded-md">
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
        ) : isPaid ? (
          <div className="text-center text-slate-400 text-2xl font-bold mt-4">
            PAID
          </div>
        ) : null}
      </div>

      {/* Email Generation Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Generate Email</h2>
        <Button
          onClick={generateEmailFromDescription}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          disabled={!description || loadingAction === 'generateEmail'}
        >
          {loadingAction === 'generateEmail' ? <Spinner size="sm" /> : 'Generate Email'}
        </Button>
        {generatedEmail && (
          <div className="mt-4 p-4 bg-gray-100 border rounded-md">
            <h3 className="text-md font-bold">Generated Email:</h3>
            <textarea
              className="w-full mt-2 p-2 border rounded-md"
              value={generatedEmail}
              onChange={(e) => setGeneratedEmail(e.target.value)}
            />
            <Button
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => alert('Email Sent (Mock Action)!')}
            >
              Send Email
            </Button>
          </div>
        )}
      </div>
      

      {/* Action Buttons */}
      {!isPaid && (
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
            disabled={loadingAction === 'send' || parseFloat(amount || '0') <= 0}
          >
            Send Link
            {loadingAction === 'send' && <Spinner className="ml-2" size="sm" />}
          </Button>
        </div>
      )}

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
            <Button onClick={() => handleSaveCustomerDetails()} color="primary">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LinkBuilder;
