// LinkBuilder.tsx
'use client';

import useCheckUser from '@/hooks/useCheckUser';
import { useEffect, useState } from 'react';
import { AccountInfo, Contact, PaymentLink } from '../../types';
import Cookies from 'js-cookie';
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Input } from '@nextui-org/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';
import moment from 'moment';

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
  const [taxNumber, setTaxNumber] = useState<string | null>(linkData?.taxNumber || null);
  const [linkId, setLinkId] = useState<string | null>(linkData?.linkId || null);
  const [linkUrl, setLinkUrl] = useState<string | null>(linkData?.url || null);
  const [customerDetails, setCustomerDetails] = useState<Contact>(linkData?.customer || customer || {} as Contact);
  const [loadingAction, setLoadingAction] = useState<'save' | 'send' | 'delete' | 'generateEmail' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [generatedEmail, setGeneratedEmail] = useState<string>(linkData?.email || '');
  const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');
  const country = Cookies.get('country') || 'US';
  const [vatRate, setVatRate] = useState<number>(linkData?.taxRate || userData?.taxRate || 0);
  const applicationFeeRate = userData?.application_fee || 0.01;
  const [whichTax, setWhichTax] = useState('Sales Tax ');
  const [symbol, setSymbol] = useState('$');
  const [manualVat, setManualVat] = useState<boolean>(linkData?.manualVat || false);
  const [manualVatAmount, setManualVatAmount] = useState<number>(linkData?.vatAmount || 0);
  const [showVatModal, setShowVatModal] = useState(false);

  const isNewLink = !linkId;
  const isPaid = linkData?.status === 'paid' || false;
  const shouldCalculateVAT = !isPaid ? !!taxNumber : isPaid && linkData?.vatAmount !== 0;

  const formatDate = (date: string, country: string) => {
    switch (country) {
              case 'GB':
              case 'AU':
              case 'NZ':
                  return moment(date).format('DD/MM/YY');
              case 'CA':
              case 'US':
                  return moment(date).format('MM/DD/YY');
              default:
                  return moment(date).format('MM/DD/YY');
          }
};

const [linkDate] = useState<string>(formatDate(linkData?.creationDate || new Date().toISOString(), country));


  // Update tax-related labels and messages based on the country
  useEffect(() => {
    switch (country) {
      case 'GB':
        setVatRate(0.2);
        setWhichTax('VAT ');
        setSymbol('£');
        break;
      case 'US':
        setVatRate(linkData?.taxRate || userData?.taxRate || 0);
        setWhichTax('Sales Tax ');
        break;
      case 'AU':
        setVatRate(0.1);
        setWhichTax('GST ');
        break;
      case 'NZ':
        setVatRate(0.15);
        setWhichTax('GST ');
        break;
      case 'CA':
        setVatRate(linkData?.taxRate || userData?.taxRate || 0);
        setWhichTax('Tax ');
        break;
      default:
        setVatRate(0);
        break;
    }
  }, [country]);

  useEffect(() => {
    if (userData) {
      try {
        const parsedAccount: AccountInfo = JSON.parse(userData.account);
        setAccountInfo(parsedAccount);
        setLogoUrl(userData.logo_url || null);
        setTaxNumber(userData.taxNumber || null);
      } catch (e) {
        console.error('Error parsing account:', e);
      }
    }
  }, [userData]);

  const calculateVAT = () => {
    if (manualVat) {
      return manualVatAmount;
    }
    return shouldCalculateVAT ? parseFloat(amount || '0') * vatRate : 0;
  };
  const calculateTotal = () => parseFloat(amount || '0') + calculateVAT();
  const applicationFee = parseFloat((calculateTotal() * applicationFeeRate).toFixed(2));

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
      email: generatedEmail,
      taxRate: vatRate,
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
            ? 'Link sent successfully! The customer will receive the link in their email. You can also copy the link above.'
            : `Link ${action} successful!`,
        });
        setLinkUrl(data.url);
        setLinkId(data.linkId);
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

  const generateEmailAndSaveLink = async () => {
    setLoadingAction('generateEmail');
    try {
      const response = await fetch('/api/links/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ description, customer: customerDetails.company || customerDetails.fullName, business: accountInfo?.name, business_representative: `${accountInfo?.first_name || ''} ${accountInfo?.last_name || ''}`.trim()}),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedEmail(data.email);
        setMessage({ type: 'success', text: 'Email generated and link saved successfully!' });

        // Save the link after generating the email
        const savePayload = {
          whereFrom: 'save',
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
          email: data.email,
          taxRate: vatRate,
          applicationFee,
        };

        const saveResponse = await fetch('/api/links/manage-payment-links', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': xsrfToken,
          },
          credentials: 'include',
          body: JSON.stringify(savePayload),
        });

        if (saveResponse.ok) {
          const saveData = await saveResponse.json();
          setLinkUrl(saveData.url);
          setLinkId(saveData.linkId);
        } else {
          const saveError = await saveResponse.json();
          setMessage({ type: 'error', text: `Failed to save link: ${saveError.error}` });
        }
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

  const handleUpdateVat = async () => {
    setManualVat(true);
    setShowVatModal(false);
    try {
      const response = await fetch('/api/links/update-vat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ linkId, vatAmount: manualVatAmount, manualVat: true }),
      });
      if (!response.ok) {
        throw new Error('Failed to update VAT');
      }
      setMessage({ type: 'success', text: 'VAT updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update VAT.' });
      console.error('Error updating VAT:', error);
    }
  };

  return (
    <div className="max-w-[70%] mx-auto mt-8 p-6 bg-white rounded shadow-md">
      {/* Back and Home Buttons */}
      <div className="flex justify-between mb-4 text-base">
        <div className="flex space-x-2">
          {!isPaid && isNewLink && backButton}
          <Button onClick={onHomeClick} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Home
          </Button>
          {!isPaid && linkId && (
            <>
            <Button
              onClick={() => setShowEditModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Customer
            </Button>
            <Button onClick={() => setShowVatModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Adjust VAT
          </Button>
          </>
          )}
        </div>
        {isNewLink && (
          <Button onClick={onNewLink} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
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
          <p><strong>Link #: </strong> {linkId}</p>
          <p><strong>Link Date: </strong> {linkDate}</p>
          {taxNumber && <p><strong>{whichTax} Number:</strong> {taxNumber}</p>}
          <p><strong>Customer:</strong> {customerDetails.company || customerDetails.fullName}</p>
          <p>{customerDetails.address}, {customerDetails.townCity}, {customerDetails.countyState}, {customerDetails.postcodeZip}</p>
          <p><strong>Email:</strong> {customerDetails.email}</p>
          <p><strong>Phone:</strong> {customerDetails.phone}</p>
        </div>
      </div>

      {/* Description and Amount Inputs */}
      <div className="mb-6">
        <Input
          type="text"
          label="Description"
          placeholder="Enter a brief description for your payment link"
          value={description}
          readOnly={isPaid}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4"
        />
        <Input
          type="number"
          label={`Amount (${symbol})`}
          placeholder="Enter amount"
          value={amount}
          readOnly={isPaid}
          onChange={(e) => setAmount(e.target.value)}
          onBlur={handleAmountBlur}
          className="w-full mb-4"
        />
      </div>

      {/* Totals Section */}
      <div className="mt-4 bg-gray-100 p-4 rounded-md shadow-sm">
        <p><strong>Subtotal:</strong> {symbol}{parseFloat(amount || '0').toFixed(2)}</p>
        {taxNumber && <p><strong>{whichTax} :</strong> {symbol}{calculateVAT().toFixed(2)}</p>}
        <p><strong>Total:</strong> {symbol}{calculateTotal().toFixed(2)}</p>
      </div>

      {/* Email Generation Section */}
      <div className="mt-6">
        {isNewLink && (
          <Button
            onClick={generateEmailAndSaveLink}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700"
            disabled={!description || loadingAction === 'generateEmail'}
          >
            {loadingAction === 'generateEmail' ? <Spinner color="warning" size="sm" /> : 'Generate Payment Link'}
          </Button>
        )}
        {generatedEmail && (
          <div className="mt-4 p-4 bg-gray-100 border rounded-md">
            <h3 className="text-md font-bold">Email:</h3>
            <textarea
              className="w-full mt-2 p-2 border rounded-md h-111"
              value={generatedEmail}
              onChange={(e) => setGeneratedEmail(e.target.value)}
              readOnly={isPaid}
              rows={22}
            />
          </div>
        )}
      </div>

      {/* Generated Link or Status Display */}
      {!isNewLink && !isPaid && (
        <div className="mt-4">
          <div className="p-2 bg-gray-100 border rounded-md">
            <p className="text-sm">Payment Link:</p>
            <p className="text-blue-500">{linkUrl}</p>
            <Button
              onClick={() => navigator.clipboard.writeText(linkUrl || '')}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Copy Link
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!isNewLink ? (
      !isPaid ? (
        <div className="flex justify-center mt-4 space-x-4">
          {linkId && (
            <Button
              onClick={() => handleLinkAction('delete')}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              disabled={loadingAction === 'delete'}
            >
              Delete Link
              {loadingAction === 'delete' && <Spinner color="warning" className="ml-2" size="sm" />}
            </Button>
          )}
          <Button
            onClick={() => handleLinkAction('save')}
            className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-700"
            disabled={loadingAction === 'save'}
          >
            Save Link
            {loadingAction === 'save' && <Spinner color="warning" className="ml-2" size="sm" />}
          </Button>
          <Button
            onClick={() => handleLinkAction('send')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={loadingAction === 'send' || parseFloat(amount || '0') <= 0}
          >
            Send Link
            {loadingAction === 'send' && <Spinner color="warning" className="ml-2" size="sm" />}
          </Button>
        </div>
      ) : (
        <div className="text-center text-slate-400 text-2xl font-bold">
          PAID {linkData?.receiptDate}
        </div>
      )
    ) : null}

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
            <Button onClick={() => handleLinkAction('save')} color="primary">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Adjusting VAT */}
      <Modal isOpen={showVatModal} onClose={() => setShowVatModal(false)}>
        <ModalContent>
          <ModalHeader>Adjust VAT <Tippy content="`Setting the tax amount manually will override the calculated tax amount.`">
          <span className="ml-2 cursor-pointer text-red-500"><FontAwesomeIcon icon={byPrefixAndName.far['circle-info']} /></span>
        </Tippy>
        </ModalHeader>
          <ModalBody>
            <Input
              label="VAT Amount"
              type="number"
              value={String(manualVatAmount)}
              onChange={(e) => setManualVatAmount(parseFloat(e.target.value))}
              fullWidth
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleUpdateVat} color="primary">
              Update
            </Button>
            <Button onClick={() => {
              setManualVat(false);
              setManualVatAmount(0);
              setShowVatModal(false);
            }} color="danger">
              Reset
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LinkBuilder;
