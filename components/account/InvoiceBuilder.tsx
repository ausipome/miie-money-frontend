'use client';

import useCheckUser from '@/hooks/useCheckUser';
import { AccountInfo, Contact, Invoice, InvoiceItem } from '../../types';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Spinner } from '@nextui-org/spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';
import { Button } from '@nextui-org/button';

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
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loadingAction, setLoadingAction] = useState<'save' | 'send' | 'delete' | null>(null);
  const VAT_RATE = 0.20;
  const INVOICE_DATE = invoiceData?.invoiceDate || new Date().toLocaleDateString();
  const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');

  // Set up user data
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

  // Fetch new invoice number if creating a new invoice
  useEffect(() => {
    if (!invoiceData) {
      const fetchInvoiceNumber = async () => {
        try {
          const response = await fetch('/api/account/get-invoice-number', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': xsrfToken,
            },
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            setInvoiceNumber(data.invoiceNumber); 
          } else {
            console.error('Failed to fetch invoice number');
          }
        } catch (error) {
          console.error('Error fetching invoice number:', error);
        }
      };
      fetchInvoiceNumber();
    }
  }, [invoiceData]);

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

  const calculateVAT = () => (vatNumber ? calculateSubtotal() * VAT_RATE : 0);

  const calculateTotal = () => calculateSubtotal() + calculateVAT();

  const handleInvoiceAction = async (action: 'save' | 'send' | 'delete') => {
    setLoadingAction(action);

    if (action === 'delete') {
      const confirmed = confirm("Are you sure you want to delete this invoice?");
      if (!confirmed) {
        setLoadingAction(null);
        return;
      }
    }

    const invoicePayload = {
      invoiceId,
      whereFrom: action,
      invoiceNumber,
      invoiceDate: INVOICE_DATE,
      vatNumber,
      customer: invoiceData?.customer || customer,
      items,
      accountInfo,
      logoUrl,
      subtotal: calculateSubtotal(),
      vatAmount: calculateVAT(),
      total: calculateTotal(),
    };

    try {
      const response = await fetch('/api/account/manage-invoice', {
        method: action === 'delete' ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(invoicePayload),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: `Invoice ${action === 'save' ? 'saved' : action === 'send' ? 'sent' : 'deleted'} successfully!` });
        
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

  const displayedCustomer = invoiceData?.customer || customer;

  return (
    <div className="max-w-[70%] mx-auto mt-8 p-6 bg-white rounded shadow-md">
      {/* Back, Home, and New Invoice Buttons */}
      {backButton && (
        <div className="flex justify-between mb-4 text-base">
          <div className="flex space-x-2">
            {backButton}
            <Button onClick={onHomeClick} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              <FontAwesomeIcon icon={byPrefixAndName.fas['house']} />
            </Button>
          </div>
          <Button onClick={onNewInvoice} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            New Invoice
          </Button>
        </div>
      )}

      {/* Invoice Details */}
      <div className="flex justify-between items-start mb-8 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
        <div>
          <img src={logoUrl || "/logo_side.png"} alt="Company Logo" className="w-auto h-auto max-w-[200px] max-h-[100px] mb-2" />
          {userData?.business_type === 'individual' && (
            <div>
              <p className='pb-4'><strong>Full Name</strong><br /> {accountInfo?.first_name} {accountInfo?.last_name}</p>
              <p><strong>Address</strong><br />
                {accountInfo?.address?.line1}<br />
                {accountInfo?.address?.city}<br />
                {accountInfo?.address?.postal_code}
              </p>
            </div>
          )}
          {(userData?.business_type === 'company' || userData?.business_type === 'non_profit') && (
            <div>
              <p className='pb-4'><strong>Company Name</strong><br /> {accountInfo?.name}</p>
              <p><strong>Address</strong><br />
                {accountInfo?.address?.line1}<br />
                {accountInfo?.address?.city}<br />
                {accountInfo?.address?.postal_code}
              </p>
            </div>
          )}
        </div>

        <div className="text-left">
          <h1 className="text-4xl font-bold">INVOICE</h1>
          <div className="mt-4">
            <div><strong>Invoice #: </strong> {invoiceNumber}</div>
            <div><strong>Invoice Date: </strong> {INVOICE_DATE}</div>
            {vatNumber && (
              <div className="mt-2">
                <strong>VAT Number: </strong>{vatNumber}
              </div>
            )}
          </div>

          {displayedCustomer && (
            <div className="mt-4">
              <h2 className="font-bold">{displayedCustomer.company || displayedCustomer.fullName}</h2>
              <div>{displayedCustomer.address}</div>
              <div>{displayedCustomer.townCity}, {displayedCustomer.countyState} {displayedCustomer.postcodeZip}</div>
              <div>{displayedCustomer.email}</div>
              <div>{displayedCustomer.phone}</div>
            </div>
          )}
        </div>
      </div>

      {/* Items Section */}
      {items.map((item, index) => (
        <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
          <label htmlFor={`itemName-${index}`} className="block mb-2 font-bold">Item Name</label>
          <input
            type="text"
            id={`itemName-${index}`}
            placeholder="Item Name"
            className="w-full border p-2 mb-2"
            value={item.itemName}
            onChange={e => handleItemChange(index, 'itemName', e.target.value)}
          />
          <div className="flex justify-between mb-2">
            <div className="w-1/2">
              <label htmlFor={`quantity-${index}`} className="block mb-2 font-bold">Quantity</label>
              <input
                type="number"
                id={`quantity-${index}`}
                placeholder="Quantity"
                min="1"
                className="w-full border p-2 mr-2"
                value={item.quantity}
                onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value))}
              />
            </div>
            <div className="w-1/2">
              <label htmlFor={`cost-${index}`} className="block mb-2 font-bold">Cost (£)</label>
              <input
                type="number"
                id={`cost-${index}`}
                placeholder="Cost"
                min="0"
                step="0.01"
                className="w-full border p-2"
                value={item.cost}
                onChange={e => handleItemChange(index, 'cost', parseFloat(e.target.value))}
              />
            </div>
            {index !== 0 && (
              <button onClick={() => handleRemoveItem(index)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2 h-1/2 mt-auto">
                Remove
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Totals and Action Buttons */}
      <div className="mt-8 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
        <div className="flex justify-end mb-4">
          <button onClick={handleAddItem} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">
            Add Item
          </button>
        </div>
        <div className="flex justify-end mb-2">
          <span className="w-[100px] text-left">Subtotal:</span>
          <span>£{calculateSubtotal().toFixed(2)}</span>
        </div>

        {vatNumber && (
          <div className="flex justify-end mb-2">
            <span className="w-[100px] text-left">VAT ({VAT_RATE * 100}%):</span>
            <span>£{calculateVAT().toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-end">
          <h2 className="font-bold w-[100px] text-left">Total:</h2>
          <h2 className="font-bold">£{calculateTotal().toFixed(2)}</h2>
        </div>

        {/* Save, Send, and Delete Buttons with Spinner */}
        <div className="flex justify-center mt-4 space-x-4">
          {invoiceId && (
            <button
              onClick={() => handleInvoiceAction('delete')}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              disabled={loadingAction === 'delete'}
            >
              Delete Invoice
              {loadingAction === 'delete' && <Spinner style={{ marginLeft: "4px", marginTop: "2px" }} color="warning" size="sm" />}
            </button>
          )}
          <button
            onClick={() => handleInvoiceAction('save')}
            className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
            disabled={loadingAction === 'save'}
          >
            Save Invoice
            {loadingAction === 'save' && <Spinner style={{ marginLeft: "4px", marginTop: "2px" }} color="warning" size="sm" />}
          </button>
          <button
            onClick={() => handleInvoiceAction('send')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={loadingAction === 'send'}
          >
            Send Invoice
            {loadingAction === 'send' && <Spinner style={{ marginLeft: "4px", marginTop: "2px" }} color="warning" size="sm" />}
          </button>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mt-4 p-2 rounded ${message.type === 'success' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
