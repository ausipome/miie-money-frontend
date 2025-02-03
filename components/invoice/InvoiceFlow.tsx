// components/InvoiceFlow.tsx

'use client';

import { useState } from 'react';
import InvoiceList from './InvoiceList';
import AddressBook from '../account/AddressBook';
import InvoiceBuilder from './InvoiceBuilder';
import BackButton from '../navigation/BackButton';
import { Contact, Invoice } from '../../types';

const InvoiceFlow: React.FC = () => {
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleBackClick = () => {
    if (selectedInvoice) {
      setSelectedInvoice(null);
    } else if (selectedContact) {
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

  const handleOpenInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleHomeClick = () => {
    setShowAddressBook(false);
    setSelectedContact(null);
    setSelectedInvoice(null);
  };

  const handleNewInvoice = () => {
    setSelectedContact(null);
    setSelectedInvoice(null);
    setShowAddressBook(true);
  };

  return (
    <div className="container mx-auto py-4 md:py-12">
      {selectedInvoice ? (
        <InvoiceBuilder
          invoiceData={selectedInvoice}
          backButton={<BackButton onClick={handleBackClick} />}
          onNewInvoice={handleNewInvoice}
          onHomeClick={handleHomeClick}
        />
      ) : selectedContact ? (
        <InvoiceBuilder
          customer={selectedContact}
          backButton={<BackButton onClick={handleBackClick} />}
          onNewInvoice={handleNewInvoice}
          onHomeClick={handleHomeClick}
        />
      ) : showAddressBook ? (
        <AddressBook mode="invoice" onUseContact={handleUseContact} backButton={<BackButton onClick={handleBackClick} />} />
      ) : (
        <div className="flex justify-center w-[95%] lg:w-[80%] mx-auto">
          <InvoiceList onNewInvoiceClick={handleNewInvoiceClick} onOpenInvoice={handleOpenInvoice} />
        </div>
      )}
    </div>
  );
};

export default InvoiceFlow;
