'use client';

import { AccountInfo } from '@/types';
import useCheckUser from '../../hooks/useCheckUser';
import { Card } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { useEffect, useState } from 'react';

export default function Settings() {
  const { userData, error, loading, setLoading } = useCheckUser();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);

  useEffect(() => { 
    if (userData) {
      console.log(userData);
      try {
        // Parse the account field into an object
        const parsedAccount = JSON.parse(userData.account);
        setAccountInfo(parsedAccount);
      } catch (e) {
        console.error('Error parsing account:', e);
      }
    }
  }, [userData]);

  if (loading) { 
    return (
      <div className="flex flex-col items-center h-screen w-full gap-6 bg-gray-100">
        {/* Full-screen skeleton container */}
        <Card className="w-[90%] max-w-3xl space-y-6 p-6" radius="lg">
          {/* Emulating a large image or content box */}
          <Skeleton isLoaded={!loading} className="rounded-lg">
            <div className="h-64 w-full rounded-lg bg-secondary"></div>
          </Skeleton>

          <div className="space-y-4">
            {/* Emulating text rows */}
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
    <div className="flex flex-col items-center h-screen w-full gap-6 bg-gray-100">
      <Card className="w-[90%] max-w-3xl space-y-6 p-6" radius="lg">
        <h1 className="text-2xl font-bold">Account Information</h1>
        <div className="space-y-4">
          {/* Common fields */}
          <p><strong>Full Name:</strong> {userData.fullName}</p>

          {/* Conditionally render based on business_type */}
          {userData.business_type === 'individual' && (
            <>
              <p><strong>Address:</strong> {accountInfo.address?.line1}, {accountInfo.address?.city}, {accountInfo.address?.postal_code}</p>
            </>
          )}

          {(userData.business_type === 'company' || userData.business_type === 'non_profit') && (
            <>
              <p><strong>Company Name:</strong> {accountInfo.name}</p>
              <p><strong>Address:</strong> {accountInfo.address?.line1}, {accountInfo.address?.city}, {accountInfo.address?.postal_code}</p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
