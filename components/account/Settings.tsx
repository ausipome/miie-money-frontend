'use client';

import useCheckUser from '../../hooks/useCheckUser';
import Cookies from 'js-cookie';
import { Card } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { useEffect, useState, useRef } from 'react';
import { AccountInfo } from '../../types';
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';
import ChangePasswordModal from '../user/ChangePasswordModal'; // Import the modal

export default function Settings() {
  const { userData, error, loading } = useCheckUser();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [xsrfToken, setXsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');
  const [email, setEmail] = useState(Cookies.get('email') || '');
  const [logoUrl, setLogoUrl] = useState<string | null>(null); // Holds the uploaded logo URL
  const [vatNumber, setVatNumber] = useState<string | null>(null); // VAT number state
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref to trigger the file input
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // Modal open state

  // Open and close functions for the modal
  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => setIsPasswordModalOpen(false);

  useEffect(() => { 
    if (userData) {
      try {
        const parsedAccount: AccountInfo = JSON.parse(userData.account);
        setAccountInfo(parsedAccount);
        setLogoUrl(userData.logo_url || null); // Assuming the logo URL is available in userData
        setVatNumber(userData.vatNumber || ''); // Assuming vat_number is in userData
      } catch (e) {
        console.error('Error parsing account:', e);
      }
    }
  }, [userData]);

  // Function to update VAT number in the database
  const updateVatNumber = async () => {
    try {
      const response = await fetch('/api/account/update-vat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ email, vatNumber: vatNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('VAT number updated successfully!'); // Success popup
      } else {
        alert('Failed to update VAT number. Please try again.'); // Error popup
      }
    } catch (error) {
      console.error('Error updating VAT number:', error);
      alert('An error occurred while updating the VAT number.');
    }
  };

  // Handle when the "+" button is clicked to change or add a logo
  const handleLogoChange = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  // Handle the file selection and trigger the logo upload
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file
    if (file && email) {
      // Check dimensions of the image before upload (Optional)
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async function () {
        if (img.width <= 300 && img.height <= 300) {
          await uploadLogo(email, file);
        } else {
          alert('Logo dimensions must not exceed 300px by 300px.');
        }
      };
    }
  };

  // Function to handle logo upload to the backend
  const uploadLogo = async (email: string | Blob, file: string | Blob) => {
    const formData = new FormData();
    formData.append('email', email);  // Attach email to the form data
    formData.append('logo', file);    // Attach the logo file to the form data

    try {
      const response = await fetch('/api/account/upload-logo', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': xsrfToken,
      },
      credentials: 'include',
        body: formData,  // Sending form data containing the logo and email
      });

      const data = await response.json();

      if (response.ok) {
        setLogoUrl(data.logo_url); // Update logo URL in state after successful upload
      } else {
        console.error('Error uploading logo:', data.error);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  // Helper functions to render individual account info
  const renderIndividualInfo = () => (
    <div>
      <p className='pb-4'><strong>Full Name</strong><br /> {accountInfo?.first_name} {accountInfo?.last_name}</p>
      <p><strong>Address</strong><br />
        {accountInfo?.address?.line1}<br />
        {accountInfo?.address?.city}<br />
        {accountInfo?.address?.postal_code}
      </p>
    </div>
  );

  // Helper function to render company or non-profit info
  const renderCompanyInfo = () => (
    <div>
      <p className='pb-4'><strong>Company Name</strong><br /> {accountInfo?.name}</p>
      <p><strong>Address</strong><br />
        {accountInfo?.address?.line1}<br />
        {accountInfo?.address?.city}<br />
        {accountInfo?.address?.postal_code}
      </p>
    </div>
  );

  if (loading) { 
    return (
      <div className="flex flex-col items-center h-screen w-full gap-6 bg-gray-100">
        <Card className="w-[90%] max-w-3xl space-y-6 p-6" radius="lg">
          <Skeleton isLoaded={!loading} className="rounded-lg">
            <div className="h-64 w-full rounded-lg bg-secondary"></div>
          </Skeleton>
          <div className="space-y-4">
            <Skeleton isLoaded={!loading} className="w-full rounded-lg">
              <div className="h-6 w-full rounded-lg bg-secondary"></div>
            </Skeleton>
            <Skeleton isLoaded={!loading} className="w-4/5 rounded-lg">
              <div className="h-6 w-full rounded-lg bg-secondary-300"></div>
            </Skeleton>
            <Skeleton isLoaded={!loading} className="w-3/5 rounded-lg">
              <div className="h-6 w-full rounded-lg bg-secondary-200"></div>
            </Skeleton>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!userData || !accountInfo) {
    return <div>No account information available</div>;
  }

  return (
    <>
    {/* Change Password Modal */}
    <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={closePasswordModal} />

    <div className="flex flex-col items-center py-10 bg-white">
      <Card className="w-[90%] max-w-md space-y-6 p-6 rounded-lg shadow-lg bg-gray-50">
        <h1 className="text-2xl font-bold text-center">Account Information</h1>
        
        {/* Logo Display Section */}
        <div className="relative flex flex-col items-center">
          {logoUrl ? (
            <div className="relative">
              {/* Restricting logo to a max of 300x300 without distorting the aspect ratio */}
              <img src={logoUrl} alt="Company Logo" className="max-w-[300px] max-h-[150px] object-contain border rounded-lg bg-white" />
              <button
                className="absolute -bottom-8 -right-4 bg-blue-500 text-white rounded-full p-2"
                onClick={handleLogoChange}
              >
                +
              </button>
            </div>
          ) : (
            <div className="relative h-[150px] w-[150px] bg-gray-200 flex justify-center items-center rounded-full">
              <button onClick={handleLogoChange} className="text-gray-500 text-2xl">
                + Add Logo
              </button>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          accept="image/*"
        />

        <div className="flex flex-col items-center space-y-4 text-left pt-6 text-xl">
          {/* Conditionally render based on business_type */}
          {userData.business_type === 'individual' && renderIndividualInfo()}
          {(userData.business_type === 'company' || userData.business_type === 'non_profit') && renderCompanyInfo()}
        </div>

        <div className="w-full text-center">
          {/* Edit Button */}
          <Link href="/account/verification" className="text-xl text-blue-500">
            Edit
          </Link>
        </div>

        {/* VAT Number Input */}
        <div className="pt-6 relative">
          <label htmlFor="vat" className="block text-xl font-medium text-gray-700">VAT Number</label>
          <div className="relative">
            <input
              id="vat"
              type="text"
              value={vatNumber || ''}
              onChange={(e) => setVatNumber(e.target.value)}
              onBlur={updateVatNumber}
              className="mt-1 block w-full p-2 pr-12 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter VAT number"
            />
            <button
              className="absolute inset-y-0 right-0 px-4 py-2 bg-green-500 text-white rounded-r-md focus:outline-none"
              onClick={updateVatNumber}
            >
              <FontAwesomeIcon icon={byPrefixAndName.fal['check']} />
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            To send VAT invoices you must add your VAT number.<br/> Click the <FontAwesomeIcon className='text-green-800' icon={byPrefixAndName.fal['check']} /> once you have added/updated.
          </p>
        </div>

        {/* Change Password Link */}
        <div className="pt-4">
          {/* Change Password Link that opens the modal */}
          <button className="text-blue-500 hover:underline" onClick={openPasswordModal}>
            Change Password
          </button>
        </div>
        </Card>
    </div>
    </>
  );
}
