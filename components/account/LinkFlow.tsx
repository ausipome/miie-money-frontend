'use client';

import { useState } from 'react';
import LinkList from './LinkList';
import AddressBook from './AddressBook';
import LinkBuilder from './LinkBuilder';
import BackButton from '../navigation/BackButton';
import { Contact, PaymentLink } from '../../types';

const LinkFlow: React.FC = () => {
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedLink, setSelectedLink] = useState<PaymentLink | null>(null);

  const handleBackClick = () => {
    if (selectedLink) {
      setSelectedLink(null);
    } else if (selectedContact) {
      setSelectedContact(null);
      setShowAddressBook(true);
    } else {
      setShowAddressBook(false);
    }
  };

  const handleNewLinkClick = () => {
    setShowAddressBook(true);
  };

  const handleUseContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowAddressBook(false);
  };

  const handleOpenLink = (link: PaymentLink) => {
    setSelectedLink(link);
  };

  const handleHomeClick = () => {
    setShowAddressBook(false);
    setSelectedContact(null);
    setSelectedLink(null);
  };

  const handleNewLink = () => {
    setSelectedContact(null);
    setSelectedLink(null);
    setShowAddressBook(true);
  };

  return (
    <div className="container mx-auto py-12">
      {selectedLink ? (
        <LinkBuilder
          linkData={selectedLink}
          backButton={<BackButton onClick={handleBackClick} />}
          onNewLink={handleNewLink}
          onHomeClick={handleHomeClick}
        />
      ) : selectedContact ? (
        <LinkBuilder
          customer={selectedContact}
          backButton={<BackButton onClick={handleBackClick} />}
          onNewLink={handleNewLink}
          onHomeClick={handleHomeClick}
        />
      ) : showAddressBook ? (
        <AddressBook mode="invoice" onUseContact={handleUseContact} backButton={<BackButton onClick={handleBackClick} />} />
      ) : (
        <div className="flex justify-center w-[95%] lg:w-[80%] mx-auto">
          <LinkList onNewLinkClick={handleNewLinkClick} onOpenLink={handleOpenLink} />
        </div>
      )}
    </div>
  );
};

export default LinkFlow;
