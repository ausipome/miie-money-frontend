'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import Cookies from 'js-cookie';
import { Contact } from '../../types';

interface AddressBookProps {
  mode?: 'default' | 'invoice'; // 'default' for normal mode, 'invoice' for InvoiceFlow mode
  onUseContact?: (contact: Contact) => void; // Callback to pass selected contact data to InvoiceFlow
}

const AddressBook: React.FC<AddressBookProps> = ({ mode = 'default', onUseContact }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [contactIndex, setContactIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>(''); // State for error messages
  const [successMessage, setSuccessMessage] = useState<string>(''); // State for success messages
  const [contactForm, setContactForm] = useState<Contact>({
    customerId: '',
    company: '',
    fullName: '',
    address: '',
    townCity: '',
    countyState: '',
    postcodeZip: '',
    email: '',
    phone: '',
  });
  const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/account/get-contacts', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': xsrfToken,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      setContacts(data.contacts);
      setFilteredContacts(data.contacts); // Display all contacts initially
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const addContact = async () => {
    try {
      const response = await fetch('/api/account/add-contact', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': xsrfToken,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.customerId) {
          const newContact = { ...contactForm, customerId: data.customerId };
          setContacts((prev) => [...prev, newContact]);
          setFilteredContacts((prev) => [...prev, newContact]);
          setSuccessMessage(data.message || 'Contact added successfully!');
          setErrorMessage('');

          if (onUseContact) {
            onUseContact(newContact); // Pass the newly added contact to InvoiceFlow
          }

          closeModal();

          // Clear success message after 4 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 4000);
        }
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to add contact.');
      }
    } catch (error) {
      console.error('Network or server error when adding contact:', error);
      setErrorMessage('Failed to add contact: Network or server error.');
    }
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = contacts.filter(
      (contact) =>
        contact.fullName.toLowerCase().includes(term) ||
        contact.company.toLowerCase().includes(term)
    );
    setFilteredContacts(filtered);
  };

  const openAddModal = () => {
    setIsEdit(false);
    setErrorMessage(''); // Clear previous errors
    setContactForm({
      customerId: '',
      company: '',
      fullName: '',
      address: '',
      townCity: '',
      countyState: '',
      postcodeZip: '',
      email: '',
      phone: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setIsEdit(true);
    setErrorMessage(''); // Clear previous errors
    setContactIndex(index);
    setContactForm(contacts[index]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setContactIndex(null);
    setErrorMessage(''); // Clear previous errors
  };

  const handleUseContact = () => {
    if (onUseContact) {
      onUseContact(contactForm); // Pass contact data to the parent (InvoiceFlow)
    }
    closeModal();
  };

  return (
    <div className="flex justify-center text-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h1 className='text-2xl mb-6 border-b-1'>Address book</h1>

        {/* Conditionally render the message when in invoice mode */}
        {mode === 'invoice' && (
          <p className="text-gray-600 mb-4 text-lg">
            Select a contact or add a new contact to invoice.
          </p>
        )}

        {/* Search Bar */}
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          className="mb-4"
        />

        {/* Add Contact Button */}
        <Button color="primary" onClick={openAddModal} className="mb-4">
          Add Contact
        </Button>

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-700 text-lg mb-4">{successMessage}</p>
        )}

        {/* Display Contacts */}
        <div>
          {filteredContacts.length === 0 ? (
            <p className="text-center text-gray-500">No contacts found.</p>
          ) : (
            filteredContacts.map((contact, index) => (
              <div
                key={index}
                className="p-4 mb-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition transform hover:scale-105"
                onClick={() => openEditModal(index)}
              >
                <strong className="text-lg font-semibold">{contact.fullName}</strong>
                <p className="text-gray-500">{contact.company}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for Adding/Selecting Contact */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent>
          <ModalHeader>
            {/* Change heading based on mode */}
            <h3>{isEdit && mode === 'invoice' ? 'Select Contact' : isEdit ? 'Edit Contact' : 'Add Contact'}</h3>
          </ModalHeader>
          <ModalBody>

            <Input
              label="Company"
              name="company"
              value={contactForm.company}
              onChange={handleFormChange}
              fullWidth
            />
            <Input
              label="Full Name"
              name="fullName"
              value={contactForm.fullName}
              onChange={handleFormChange}
              fullWidth
            />
            <Input
              label="Address"
              name="address"
              value={contactForm.address}
              onChange={handleFormChange}
              fullWidth
            />
            <Input
              label="Town/City"
              name="townCity"
              value={contactForm.townCity}
              onChange={handleFormChange}
              fullWidth
            />
            <Input
              label="County/State"
              name="countyState"
              value={contactForm.countyState}
              onChange={handleFormChange}
              fullWidth
            />
            <Input
              label="Postcode/Zip"
              name="postcodeZip"
              value={contactForm.postcodeZip}
              onChange={handleFormChange}
              fullWidth
            />
            <Input
              label="Email"
              name="email"
              value={contactForm.email}
              onChange={handleFormChange}
              fullWidth
            />
            <Input
              label="Phone"
              name="phone"
              value={contactForm.phone}
              onChange={handleFormChange}
              fullWidth
            />
            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
          </ModalBody>
          <ModalFooter>
            {isEdit ? (
              mode === 'invoice' ? (
                <Button color="primary" onClick={handleUseContact}>
                  Use Contact
                </Button>
              ) : (
                <>
                  <Button color="danger" onClick={() => console.log('delete')}>
                    Delete
                  </Button>
                  <Button color="primary" onClick={() => console.log('update')}>
                    Save
                  </Button>
                </>
              )
            ) : (
              <Button color="primary" onClick={addContact}>
                {mode === 'invoice' ? 'Add and Use Contact' : 'Add'}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddressBook;
