// components/InvoiceFlow.tsx

'use client';

import { useState } from 'react';
import InvoiceList from './InvoiceList';
import AddressBook from './AddressBook';
import InvoiceBuilder from './InvoiceBuilder';
import BackButton from '../BackButton';
import { Contact } from '../../types';

const InvoiceFlow: React.FC = () => {
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleBackClick = () => {
    if (selectedContact) {
      setSelectedContact(null);
      setShowAddressBook(true);
    } else {
      setShowAddressBook(false);
    }
  };

  const handleNewInvoiceClick = () => {
    setShowAddressBook(true);
  };

  const handleUseContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowAddressBook(false);
  };

  return (
    <div className="container mx-auto py-12">
      {selectedContact ? (
        <InvoiceBuilder customer={selectedContact} backButton={<BackButton onClick={handleBackClick} />} />
      ) : showAddressBook ? (
        <AddressBook mode="invoice" onUseContact={handleUseContact} backButton={<BackButton onClick={handleBackClick} />} />
      ) : (
        <div className="flex justify-center w-[95%] lg:w-[80%] mx-auto">
          <InvoiceList onNewInvoiceClick={handleNewInvoiceClick} />
        </div>
      )}
    </div>
  );
};

export default InvoiceFlow;
