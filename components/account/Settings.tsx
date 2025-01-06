'use client';

import useCheckUser from '../../hooks/useCheckUser';
import Cookies from 'js-cookie';
import { Card } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { useEffect, useState, useRef } from 'react';
import { AccountInfo } from '../../types';
import Link from "next/link";
import ChangePasswordModal from '../user/ChangePasswordModal';
import { Button } from '@nextui-org/button';

export default function Settings() {
  const { userData, error, loading } = useCheckUser();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [xsrfToken, setXsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');
  const [email, setEmail] = useState(Cookies.get('email') || '');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [taxNumber, setTaxNumber] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const country = Cookies.get('country') || 'US';
  const [taxLabel, setTaxLabel] = useState<string>('Sales Tax Number');
  const [taxRate, setTaxRate] = useState<number>(0);
  const [taxMessage, setTaxMessage] = useState<string>('Enter your sales tax number.');

  // Modal functions
  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => setIsPasswordModalOpen(false);

  useEffect(() => {
    if (userData) {
      try {
        const parsedAccount: AccountInfo = JSON.parse(userData.account);
        setAccountInfo(parsedAccount);
        setLogoUrl(userData.logo_url || null);
        setTaxNumber(userData.taxNumber || '');
        setTaxRate(userData.taxRate || 0);
      } catch (e) {
        console.error('Error parsing account:', e);
      }
    }
  }, [userData]);

  // Update tax-related labels and messages based on the country
  useEffect(() => {
    switch (country) {
      case 'GB':
        setTaxLabel('VAT Number');
        setTaxMessage('To send VAT invoices you must add your VAT number. The current VAT rate is 20%.');
        break;
      case 'US':
        setTaxLabel('Sales Tax Number');
        setTaxMessage('Enter your sales tax number. Sales tax varies by state.');
        break;
      case 'AU':
        setTaxLabel('GST Number');
        setTaxMessage('To send GST invoices in Australia, add your GST number. The current GST rate is 10%.');
        break;
      case 'NZ':
        setTaxLabel('GST Number');
        setTaxMessage('To send GST invoices in New Zealand, add your GST number. The current GST rate is 15%.');
        break;
      case 'CA':
        setTaxLabel('GST Number');
        setTaxMessage('Enter your GST number to include it on invoices. GST rates vary by province.');
        break;
      default:
        setTaxLabel('Tax Number');
        setTaxMessage('Enter your tax number to include it on invoices.');
        break;
    }
  }, [country]);

  const updateTaxNumber = async () => {
    setMessage(null);
    try {
      const response = await fetch('/api/account/update-tax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ email, taxNumber, taxRate: taxRate }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Updated successfully!');
      } else {
        setMessage('Failed to update! Please try again.');
      }
    } catch (error) {
      console.error('Error updating tax number and tax rate:', error);
      setMessage('An error occurred while updating the tax number and tax rate.');
    }
  };

  const handleLogoChange = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && email) {
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

  const uploadLogo = async (email: string | Blob, file: string | Blob) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('logo', file);

    try {
      const response = await fetch('/api/account/upload-logo', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': xsrfToken,
        },
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setLogoUrl(data.logo_url);
      } else {
        console.error('Error uploading logo:', data.error);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const renderIndividualInfo = () => (
    <div>
      <p className="pb-4"><strong>Full Name</strong><br /> {accountInfo?.first_name} {accountInfo?.last_name}</p>
      <p><strong>Address</strong><br />
        {accountInfo?.address?.line1}<br />
        {accountInfo?.address?.city}<br />
        {accountInfo?.address?.postal_code}
      </p>
    </div>
  );

  const renderCompanyInfo = () => (
    <div>
      <p className="pb-4"><strong>Company Name</strong><br /> {accountInfo?.name}</p>
      <p><strong>Address</strong><br />
        {accountInfo?.address?.line1}<br />
        {accountInfo?.address?.city}<br />
        {accountInfo?.address?.postal_code}
      </p>
    </div>
  );

  {/* Empty function to handle button click/blur update */}
  const emptyFunction = () => {};

  if (loading) {
    return (
      <>
      {/* Change Password Modal Skeleton */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-8 w-1/2 bg-gray-300 mx-auto mb-4 rounded"></div> {/* Modal Title */}
            </Skeleton>
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} isLoaded={!loading} className="rounded-lg mb-2">
                <div className="h-6 w-3/4 mx-auto bg-gray-300 rounded"></div> {/* Modal Content */}
              </Skeleton>
            ))}
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-10 w-1/3 mx-auto bg-gray-300 rounded"></div> {/* Modal Button */}
            </Skeleton>
          </div>
        </div>
      )}
    
      {/* Account Information Skeleton */}
      <div className="flex flex-col items-center py-10 bg-white">
        <div className="w-[90%] max-w-xl space-y-6 p-6 rounded-lg shadow-lg bg-gray-50">
          {/* Title Skeleton */}
          <Skeleton isLoaded={!loading} className="rounded-lg">
            <div className="h-8 w-1/2 mx-auto bg-gray-300 rounded"></div> {/* Title */}
          </Skeleton>
    
          {/* Logo Section Skeleton */}
          <div className="relative flex flex-col items-center">
            <Skeleton isLoaded={!loading} className="rounded-lg">
              <div className="h-[150px] w-[150px] bg-gray-200 rounded-full"></div> {/* Logo Placeholder */}
            </Skeleton>
            <Skeleton isLoaded={!loading} className="rounded-full absolute -bottom-4 -right-4">
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div> {/* Add Logo Button */}
            </Skeleton>
          </div>
    
          {/* Form Fields Skeleton */}
          <div className="flex flex-col items-center space-y-4 pt-6">
            {[...Array(2)].map((_, index) => (
              <Skeleton key={index} isLoaded={!loading} className="rounded-lg">
                <div className="h-6 w-3/4 bg-gray-300 rounded"></div> {/* Form Field Placeholder */}
              </Skeleton>
            ))}
          </div>
    
          {/* Edit Link Skeleton */}
          <Skeleton isLoaded={!loading} className="rounded-lg">
            <div className="h-6 w-1/4 mx-auto bg-gray-300 rounded"></div> {/* Edit Link */}
          </Skeleton>
    
          {/* Tax Fields Skeleton */}
          <Skeleton isLoaded={!loading} className="rounded-lg">
            <div className="h-6 w-1/3 bg-gray-300 mx-auto rounded"></div> {/* Tax Label */}
          </Skeleton>
          <Skeleton isLoaded={!loading} className="rounded-lg">
            <div className="h-10 w-full bg-gray-300 rounded"></div> {/* Tax Input */}
          </Skeleton>
    
          {/* Tax Message Skeleton */}
          <Skeleton isLoaded={!loading} className="rounded-lg">
            <div className="h-4 w-3/4 mx-auto bg-gray-300 rounded"></div> {/* Tax Message */}
          </Skeleton>
    
          {/* Change Password Skeleton */}
          <Skeleton isLoaded={!loading} className="rounded-lg mt-4">
            <div className="h-6 w-1/4 mx-auto bg-gray-300 rounded"></div> {/* Change Password Link */}
          </Skeleton>
        </div>
      </div>
    </>    
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
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={closePasswordModal} />

      <div className="flex flex-col items-center bg-white">
        <Card className="w-full space-y-6 p-6 rounded-lg shadow-lg bg-gray-50">
          <h1 className="text-2xl font-bold text-center">Account Information</h1>

          <div className="relative flex flex-col items-center my-6">
            {logoUrl ? (
              <div className="relative">
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

          <div className='border-t-solid border-t-2 border-t-grey-500 border-b-solid border-b-2 border-b-grey-500 my-8'>
          <div className="flex flex-col space-y-4 text-left pt-6 text-xl">
            {userData.business_type === 'individual' && renderIndividualInfo()}
            {(userData.business_type === 'company' || userData.business_type === 'non_profit') && renderCompanyInfo()}
          </div>

          <div className="w-full text-center pb-4">
            <Link href="/account/verification" className="text-xl text-blue-500">
              Edit
            </Link>
          </div>
          </div>

          
          <div className="relative">
          <label htmlFor="vat" className="block text-xl font-medium text-gray-700">{taxLabel}</label>
            <input
              id="vat"
              type="text"
              value={taxNumber || ''}
              onChange={(e) => setTaxNumber(e.target.value)}
              placeholder={`Enter ${taxLabel}`}
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
            <p className="mt-0 text-sm text-gray-500">{taxMessage}</p>
          </div>

          

          {(country === 'CA' || country === 'US') && (
            <>
              <div className="relative">
              <label htmlFor="taxRate" className="block text-xl font-medium text-gray-700">Tax Rate %</label>
                <input
                  id="taxRate"
                  type="text"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  placeholder="Enter Tax Rate (%)"
                  className="block w-full p-2 border border-gray-300 rounded-md"
                />
                <p className="mt-0 text-sm text-gray-500">Please enter total tax rate. This varies dependent on state or province</p>
              </div>
            </>
          )}

            <Button color="primary" onClick={updateTaxNumber} className="mb-4">
              Update
            </Button>

            {message && <p className="mt-4 text-green-500">{message}</p>}
          <div className="pt-4">
            <button className="text-blue-500 hover:underline" onClick={openPasswordModal}>
              Change Password
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}
