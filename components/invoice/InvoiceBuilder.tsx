import { useEffect, useState, useMemo } from 'react';
import Cookies from 'js-cookie';
import { Spinner } from '@nextui-org/spinner';
import HomeButton from '../navigation/HomeButton';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Input } from '@nextui-org/input';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import useCheckUser from '@/hooks/useCheckUser';
import { AccountInfo, Contact, InvoiceBuilderProps, InvoiceItem } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';
import moment from 'moment';

export default function InvoiceBuilder({ customer, invoiceData, backButton, onNewInvoice, onHomeClick }: InvoiceBuilderProps) {
  const { userData } = useCheckUser();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(invoiceData?.logoUrl || null);
  const [taxNumber, setTaxNumber] = useState<string>(invoiceData?.taxNumber || '');
  const [invoiceId, setInvoiceId] = useState<string | null>(invoiceData?.invoiceId || null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>(invoiceData?.invoiceNumber || '');
  const [items, setItems] = useState<InvoiceItem[]>(invoiceData?.items || [{ itemName: '', quantity: '', cost: '' }]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [customerDetails, setCustomerDetails] = useState<Contact>(invoiceData?.customer || customer || {} as Contact);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'save' | 'send' | 'delete' | null>(null);
  const country = Cookies.get('country') || 'US';
  const [vatRate, setVatRate] = useState<number>(invoiceData?.taxRate || userData?.taxRate || 0);
  const [manualVat, setManualVat] = useState<boolean>(invoiceData?.manualVat || false);
  const [manualVatAmount, setManualVatAmount] = useState<number>(invoiceData?.vatAmount || 0);
  const [showVatModal, setShowVatModal] = useState(false);
  const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');
  const [whichTax, setWhichTax] = useState('Sales Tax');
  const [symbol, setSymbol] = useState('$');

  const applicationFeeRate = userData?.application_fee || 0.01;
  const isPaid = invoiceData?.status === 'paid';
  const shouldCalculateVAT = !isPaid ? !!taxNumber : isPaid && invoiceData?.vatAmount !== 0;

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
  
  const [invoiceDate] = useState<string>(invoiceData?.invoiceDate || formatDate(new Date().toISOString(), country));

  useEffect(() => {
    switch (country) {
      case 'GB':
        setVatRate(0.2);
        setWhichTax('VAT');
        setSymbol('£');
        break;
      case 'US':
        setVatRate(invoiceData?.taxRate || userData?.taxRate || 0);
        setWhichTax('Sales Tax');
        break;
      case 'AU':
        setVatRate(0.1);
        setWhichTax('GST');
        setSymbol('A$');
        break;
      case 'NZ':
        setVatRate(0.15);
        setWhichTax('GST');
        setSymbol('NZ$');
        break;
      case 'CA':
        setVatRate(invoiceData?.taxRate || userData?.taxRate || 0);
        setWhichTax('Tax');
        setSymbol('C$');
        break;
      default:
        setVatRate(0);
        setWhichTax('Tax');
        setSymbol('$');
        break;
    }
  }, [country]);

  useEffect(() => {
    if (userData) {
      try {
        const parsedAccount: AccountInfo = JSON.parse(userData.account);
        setAccountInfo(parsedAccount);
        setLogoUrl(userData.logo_url || null);
        setTaxNumber(userData.taxNumber || '');
      } catch (e) {
        console.error('Error parsing account:', e);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (!invoiceData) {
      const fetchInvoiceNumber = async () => {
        try {
          const response = await fetch('/api/invoice/get-invoice-number', {
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

  const handleOpenEditModal = () => setShowEditModal(true);

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

  const handleItemChange = (index: number, key: keyof InvoiceItem, value: string) => {
    const updatedItems = [...items];
    updatedItems[index][key] = value; // Allow empty strings
    setItems(updatedItems);
  };

  const handleAddItem = () => setItems([...items, { itemName: '', quantity: '', cost: '' }]);
  const handleRemoveItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const calculateSubtotal = () =>
    items.reduce((acc, item) => {
      const quantity = parseInt(String(item.quantity) || '0', 10); // Default to 0 if empty
      const cost = parseFloat(String(item.cost) || '0'); // Default to 0 if empty
      return acc + quantity * cost;
    }, 0);

  const calculateVAT = () => {
    if (manualVat) {
      return manualVatAmount;
    }
    return shouldCalculateVAT ? calculateSubtotal() * vatRate : 0;
  };
  const calculateTotal = () => calculateSubtotal() + calculateVAT();
  const applicationFee = parseFloat((calculateTotal() * applicationFeeRate).toFixed(2));

  const handleInvoiceAction = async (action: 'save' | 'send' | 'delete') => {
    setLoadingAction(action);

    const formattedItems = items.map((item) => ({
      ...item,
      quantity: item.quantity ? parseInt(String(item.quantity), 10) : 0, // Convert to number
      cost: item.cost ? parseFloat(String(item.cost)) : 0.0, // Convert to number
    }));

    const invoicePayload = {
      invoiceId,
      whereFrom: action,
      invoiceNumber,
      invoiceDate: invoiceDate,
      taxNumber,
      customer: customerDetails,
      items: formattedItems,
      accountInfo,
      logoUrl,
      subtotal: calculateSubtotal(),
      vatAmount: calculateVAT(),
      total: calculateTotal(),
      applicationFee,
      taxRate: vatRate,
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
        setMessage({ type: 'success', text: `Invoice ${action} successful!` });
        if (action === 'delete') {
          onHomeClick();
        } else if (!invoiceId && data.invoiceId) {
          setInvoiceId(data.invoiceId);
        }
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: `Failed to ${action} invoice: ${errorData.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error in invoice action: ${(error as Error).message}` });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateVat = async () => {
    setManualVat(true);
    setShowVatModal(false);
    try {
      const response = await fetch('/api/invoice/update-vat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ invoiceId, vatAmount: manualVatAmount, manualVat: true }),
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
    <div className="w-full sm:w-['100%'] mx-auto mt-2 md:mt-8 md:p-10 p-2 sm:p-6 bg-white rounded shadow-md">
      {/* Back, Home, and Edit Buttons */}
      <div className="flex justify-between mb-4 text-base">
        <div className="flex space-x-2">
          {!invoiceId && backButton}
          <HomeButton onClick={onHomeClick} />
          {!isPaid && invoiceId && (
            <button onClick={handleOpenEditModal} className="px-2 py-2 md:px-4 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm md:text-base">
              Edit Customer
            </button>
          )}
          {!isPaid && shouldCalculateVAT && (
              <button onClick={() => setShowVatModal(true)} className="px-2 py-2 md:px-4 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm md:text-base">
              Adjust VAT
            </button>
            )}
        </div>
        <button onClick={onNewInvoice} className="px-2 py-2 md:px-4 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm md:text-base">
          New Invoice
        </button>
      </div>
  
      {/* Invoice Details */}
      <div className="flex justify-between items-start mb-8 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 overflow-x-auto">
      <div>
        <img
          src={logoUrl || "/logo_side_transparent-background_black.png"}
          alt="Company Logo"
          className="w-auto h-auto max-w-[200px] max-h-[100px] mb-2"
        />
        {userData?.business_type === 'individual' ? (
          <>
            <p className="text-sm md:text-base">{accountInfo?.first_name} {accountInfo?.last_name}</p>
            <p className="text-sm md:text-base">{accountInfo?.address?.line1}, {accountInfo?.address?.city}, {accountInfo?.address?.postal_code}</p>
          </>
        ) : userData?.business_type === 'company' ? (
          <>
            <p className="text-sm md:text-base">{accountInfo?.name}</p>
            <p className="text-sm md:text-base">{accountInfo?.address?.line1}, {accountInfo?.address?.city}, {accountInfo?.address?.postal_code}</p>
          </>
        ) : null}
      </div>

      <div>
        <h1 className="text-2xl md:text-4xl font-bold">INVOICE</h1>
        <p className="text-sm md:text-base"><strong>Invoice #: </strong> {invoiceNumber}</p>
        <p className="text-sm md:text-base"><strong>Invoice Date: </strong> {invoiceDate}</p>
        {taxNumber && <p className="text-sm md:text-base"><strong>{whichTax} Number:</strong> {taxNumber}</p>}
        <p className="text-sm md:text-base"><strong>Customer:</strong> {customerDetails.company || customerDetails.fullName}</p>
        <p className="text-sm md:text-base">{customerDetails.address}, {customerDetails.townCity}, {customerDetails.countyState}, {customerDetails.postcodeZip}</p>
        <p className="text-sm md:text-base"><strong>Email:</strong> {customerDetails.email}</p>
        <p className="text-sm md:text-base"><strong>Phone:</strong> {customerDetails.phone}</p>
      </div>
    </div>
  
      {/* Items Section */}
      {items.map((item, index) => (
        <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50">
          <input
            type="text"
            value={item.itemName}
            placeholder="Item Name"
            readOnly={isPaid}
            className="w-full border p-2 mb-2"
            onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
          />
          <div className="flex justify-between mb-2">
            <input
              type="number"
              min="1"
              value={item.quantity}
              placeholder="Quantity"
              readOnly={isPaid}
              className="w-1/2 border p-2 mr-2"
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.cost}
              placeholder={`Cost (${symbol})`}
              readOnly={isPaid}
              className="w-1/2 border p-2"
              onChange={(e) => handleItemChange(index, 'cost', e.target.value)}
              onBlur={(e) => handleItemChange(index, 'cost', parseFloat(e.target.value || '0').toFixed(2))}
            />
            {!isPaid && index !== 0 && (
              <button onClick={() => handleRemoveItem(index)} className="px-2 py-2 md:px-4 bg-red-500 text-white rounded hover:bg-red-700 text-sm md:text-base">
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
            <button onClick={handleAddItem} className="px-2 py-2 md:px-4 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm md:text-base">
              Add Item
            </button>
          </div>
        )}
        <div className="flex justify-end mb-2">
          <span>Subtotal : </span>
          <span> {symbol}{calculateSubtotal().toFixed(2)}</span>
        </div>
        {shouldCalculateVAT && (
          <div className="flex justify-end mb-2">
            <span>{whichTax} : </span>
            <span> {symbol}{calculateVAT().toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-end">
          <h2>Total : </h2>
          <h2> {symbol}{calculateTotal().toFixed(2)}</h2>
        </div>
        {!isPaid ? (
          <div className="flex justify-center mt-4 space-x-4">
            {invoiceId && (
              <button
                onClick={() => handleInvoiceAction('delete')}
                className="px-2 py-2 md:px-4 bg-red-500 text-white rounded hover:bg-red-700 text-sm md:text-base"
                disabled={loadingAction === 'delete'}
              >
                Delete Invoice
                {loadingAction === 'delete' && <Spinner className="ml-1 mt-1" color="warning" size="sm" />}
              </button>
            )}
            <button
              onClick={() => handleInvoiceAction('save')}
              className="px-2 py-2 md:px-4 bg-amber-500 text-white rounded hover:bg-amber-700 text-sm md:text-base"
              disabled={loadingAction === 'save'}
            >
              Save Invoice
              {loadingAction === 'save' && <Spinner className="ml-1 mt-1" color="warning" size="sm" />}
            </button>
            <Tippy
              content={calculateTotal() <= 1 ? `Total must be more than ${symbol}1 to send the invoice.` : ''}
              disabled={calculateTotal() > 1}
            >
              <div>
                <button
                  onClick={() => handleInvoiceAction('send')}
                  className={`px-2 py-2 md:px-4 bg-green-500 text-white rounded hover:bg-green-700 text-sm md:text-base ${calculateTotal() <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loadingAction === 'send' || calculateTotal() <= 1}
                >
                  Send Invoice
                  {loadingAction === 'send' && <Spinner className="ml-1 mt-1" color="warning" size="sm" />}
                </button>
              </div>
            </Tippy>
          </div>
        ) : (
          <div className="text-center text-slate-400 text-2xl font-bold">
            PAID {invoiceData?.receiptDate}
          </div>
        )}
      </div>
  
      {/* Success/Error Message */}
      {message && (
        <div className={`mt-4 p-2 rounded ${message.type === 'success' ? 'bg-green-200 text-green-700 text-sm md:text-base' : 'bg-red-200 text-red-700 text-sm md:text-base'}`}>
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
            <Input label="Phone"
                    value={customerDetails.phone || ''}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                    fullWidth
                  />
          </ModalBody>
          <ModalFooter>
            <button onClick={handleSaveCustomerDetails} className="px-2 py-2 md:px-4 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm md:text-base">
              Save
            </button>
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
            <button onClick={handleUpdateVat} className="px-2 py-2 md:px-4 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm md:text-base">
              Update
            </button>
            <button onClick={() => {
              setManualVat(false);
              setManualVatAmount(0);
              setShowVatModal(false);
            }} className="px-2 py-2 md:px-4 bg-red-500 text-white rounded hover:bg-red-700 text-sm md:text-base">
              Reset
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
