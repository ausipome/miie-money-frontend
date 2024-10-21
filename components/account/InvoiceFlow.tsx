// components/InvoiceFlow.tsx

'use client';

import { useState } from 'react';
import InvoiceList from './InvoiceList';
import AddressBook from './AddressBook';
import { Contact } from '../../types';

const InvoiceFlow: React.FC = () => {
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null); // To store the selected contact

  const handleNewInvoiceClick = () => {
    setShowAddressBook(true);
  };

  const handleAddressBookClose = () => {
    setShowAddressBook(false);
  };

  const handleUseContact = (contact: Contact) => {
    setSelectedContact(contact); // Store selected contact in state
    setShowAddressBook(false); // Close AddressBook after selecting a contact
  };

  return (
    <div className="container mx-auto py-12">
      {showAddressBook ? (
        <div>
          <AddressBook mode="invoice" onUseContact={handleUseContact} />
          <button
            onClick={handleAddressBookClose}
            className="px-4 py-2 mt-4 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Close Address Book
          </button>
        </div>
      ) : (
        <div>
          <InvoiceList onNewInvoiceClick={handleNewInvoiceClick} />
          {selectedContact && (
            <div className="mt-8 p-4 border rounded-md">
              <h3 className="text-xl font-bold">Selected Contact</h3>
              <p>Company: {selectedContact.company}</p>
              <p>Name: {selectedContact.fullName}</p>
              <p>Address: {selectedContact.address}</p>
              <p>Town/City: {selectedContact.townCity}</p>
              <p>County/State: {selectedContact.countyState}</p>
              <p>Postcode/Zip: {selectedContact.postcodeZip}</p>
              <p>Email: {selectedContact.email}</p>
              <p>Phone: {selectedContact.phone}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceFlow;
