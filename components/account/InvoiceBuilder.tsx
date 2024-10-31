// components/InvoiceBuilder.tsx

'use client';

import useCheckUser from '@/hooks/useCheckUser';
import { AccountInfo, Contact, Invoice, InvoiceItem } from '../../types';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Spinner } from '@nextui-org/spinner';
import { Button } from '@nextui-org/button';
import HomeButton from '../navigation/HomeButton';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Input } from '@nextui-org/input';

interface InvoiceBuilderProps {
  customer?: Contact;
  invoiceData?: Invoice;
  backButton?: React.ReactNode;
  onNewInvoice: () => void;
  onHomeClick: () => void;
}

export default function InvoiceBuilder({ customer, invoiceData, backButton, onNewInvoice, onHomeClick }: InvoiceBuilderProps) {
  const { userData } = useCheckUser();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(invoiceData?.logoUrl || null);
  const [vatNumber, setVatNumber] = useState<string | null>(invoiceData?.vatNumber || null);
  const [invoiceId, setInvoiceId] = useState<string | null>(invoiceData?.invoiceId || null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>(invoiceData?.invoiceNumber || '');
  const [items, setItems] = useState<InvoiceItem[]>(invoiceData?.items || [{ itemName: '', quantity: 1, cost: 0 }]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [customerDetails, setCustomerDetails] = useState<Contact>(invoiceData?.customer || customer || {} as Contact);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'save' | 'send' | 'delete' | null>(null);
  const VAT_RATE = 0.20;
  const INVOICE_DATE = invoiceData?.invoiceDate || new Date().toLocaleDateString();
  const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');

  const applicationFeeRate = userData?.application_fee || 0;
  const isPaid = invoiceData?.status === 'paid';
  const shouldCalculateVAT = !isPaid ? !!vatNumber : isPaid && invoiceData?.vatAmount !== 0;

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

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleSaveCustomerDetails = async () => {
    try {
      const updatedInvoice = {
        ...invoiceData,
        customer: customerDetails,
      };
      const response = await fetch(`/api/invoice/manage-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(updatedInvoice),
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

  const handleItemChange = (index: number, key: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [key]: value };
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { itemName: '', quantity: 1, cost: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems([...items.slice(0, index), ...items.slice(index + 1)]);
  };

  const calculateSubtotal = () => items.reduce((acc, item) => acc + item.quantity * item.cost, 0);
  const calculateVAT = () => (shouldCalculateVAT ? calculateSubtotal() * VAT_RATE : 0);
  const calculateTotal = () => calculateSubtotal() + calculateVAT();
  const applicationFee = parseFloat((calculateTotal() * applicationFeeRate).toFixed(2));

  const handleInvoiceAction = async (action: 'save' | 'send' | 'delete') => {
    setLoadingAction(action);

    if (action === 'delete' && !confirm("Are you sure you want to delete this invoice?")) {
      setLoadingAction(null);
      return;
    }

    const invoicePayload = {
      invoiceId,
      whereFrom: action,
      invoiceNumber,
      invoiceDate: INVOICE_DATE,
      vatNumber,
      customer: customerDetails,
      items,
      accountInfo,
      logoUrl,
      subtotal: calculateSubtotal(),
      vatAmount: calculateVAT(),
      total: calculateTotal(),
      applicationFee,
    };

    try {
      const response = await fetch('/api/invoice/manage-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(invoicePayload),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: `Invoice ${action} successfully!` });
        if (action === 'delete') {
          onHomeClick();
        } else if (!invoiceId && data.invoiceId) {
          setInvoiceId(data.invoiceId);
        }
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: `Failed to ${action} invoice: ${errorData.error}` });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error in invoice action: ${error.message}` });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="max-w-[70%] mx-auto mt-8 p-6 bg-white rounded shadow-md">
      {/* Back, Home, Edit, and New Invoice Buttons */}
      <div className="flex justify-between mb-4 text-base">
        <div className="flex space-x-2">
          {backButton}
          <HomeButton onClick={onHomeClick} />
          {invoiceId && (
            <Button onClick={handleOpenEditModal} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
              Edit Contact
            </Button>
          )}
        </div>
        <Button onClick={onNewInvoice} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          New Invoice
        </Button>
      </div>

      {/* Invoice Details */}
      <div className="flex justify-between items-start mb-8 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
        <div>
          <img src={logoUrl || "/logo_side_transparent-background_black.png"} alt="Company Logo" className="w-auto h-auto max-w-[200px] max-h-[100px] mb-2" />
          <p><strong>Full Name:</strong> {accountInfo?.first_name} {accountInfo?.last_name}</p>
          <p><strong>Address:</strong> {accountInfo?.address?.line1}, {accountInfo?.address?.city}, {accountInfo?.address?.postal_code}</p>
        </div>

        <div>
          <h1 className="text-4xl font-bold">INVOICE</h1>
          <p><strong>Invoice #: </strong> {invoiceNumber}</p>
          <p><strong>Invoice Date: </strong> {INVOICE_DATE}</p>
          {vatNumber && <p><strong>VAT Number:</strong> {vatNumber}</p>}
          <p><strong>Customer:</strong> {customerDetails.company || customerDetails.fullName}</p>
          <p>{customerDetails.address}, {customerDetails.townCity}, {customerDetails.countyState}, {customerDetails.postcodeZip}</p>
          <p><strong>Email:</strong> {customerDetails.email}</p>
          <p><strong>Phone:</strong> {customerDetails.phone}</p>
        </div>
      </div>

      {/* Items Section */}
      {items.map((item, index) => (
        <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
          <label htmlFor={`itemName-${index}`} className="block mb-2 font-bold">Item Name</label>
          <input type="text" id={`itemName-${index}`} className="w-full border p-2 mb-2" value={item.itemName} readOnly={isPaid}
            onChange={e => handleItemChange(index, 'itemName', e.target.value)} />
          <div className="flex justify-between mb-2">
            <div className="w-1/2">
              <label htmlFor={`quantity-${index}`} className="block mb-2 font-bold">Quantity</label>
              <input type="number" id={`quantity-${index}`} className="w-full border p-2 mr-2" value={item.quantity} min="1" readOnly={isPaid}
                onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value))} />
            </div>
            <div className="w-1/2">
              <label htmlFor={`cost-${index}`} className="block mb-2 font-bold">Cost (£)</label>
              <input type="number" id={`cost-${index}`} className="w-full border p-2" value={item.cost} step="0.01" min="0" readOnly={isPaid}
                onChange={e => handleItemChange(index, 'cost', parseFloat(e.target.value))} />
            </div>
            {!isPaid && index !== 0 && (
              <button onClick={() => handleRemoveItem(index)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2">
                Remove
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Totals and Action Buttons */}
      <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
        {!isPaid && (
          <div className="flex justify-end mb-4">
            <button onClick={handleAddItem} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add Item
            </button>
          </div>
        )}
        <div className="flex justify-end mb-2">
          <span className="w-[100px] text-left">Subtotal:</span>
          <span>£{calculateSubtotal().toFixed(2)}</span>
        </div>
        {shouldCalculateVAT && (
          <div className="flex justify-end mb-2">
            <span className="w-[100px] text-left">VAT ({VAT_RATE * 100}%):</span>
            <span>£{calculateVAT().toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-end">
          <h2 className="font-bold w-[100px] text-left">Total:</h2>
          <h2 className="font-bold">£{calculateTotal().toFixed(2)}</h2>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-4 space-x-4">
          {invoiceId && (
            <button onClick={() => handleInvoiceAction('delete')} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Delete Invoice
            </button>
          )}
          <button onClick={() => handleInvoiceAction('save')} className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600">
            Save Invoice
          </button>
          <button onClick={() => handleInvoiceAction('send')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Send Invoice
          </button>
        </div>
      </div>

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
}
