'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import useCheckUser from '../../hooks/useCheckUser';
import Link from 'next/link';
import { Card } from '@nextui-org/card';
import { Skeleton } from '@nextui-org/skeleton';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import Settings from './Settings';
import AccountInfo from './AccountInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';

export default function AccountMain() {
    const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');
    const [stripeAccountId, setStripeAccountId] = useState<string | undefined>(undefined);
    const [requiredInfo, setRequiredInfo] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
    const { userData, error, loading } = useCheckUser();

    // Button to open settings modal
    const openSettingsButton = (
        <button
            className="bg-gray-400 text-white py-2 px-4 rounded-md shadow-md"
            onClick={() => setSettingsModalOpen(true)}
        >
            <FontAwesomeIcon icon={byPrefixAndName.far['gear']} />
        </button>
    );

    useEffect(() => {
        if (userData?.stripe_account_id) {
            setStripeAccountId(userData?.stripe_account_id);
            const getConnected = async () => {
                const response = await fetch('/api/account/get-connected', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': xsrfToken,
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        account: userData?.stripe_account_id,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.requirements.currently_due.length > 0) setRequiredInfo(true);
                    if (data.requirements.disabled_reason.length != '') setDisabled(true);
                }
            };
            getConnected();
        }
    }, [userData]);

    if (loading) {
        return (
            <div className="flex flex-col items-center h-screen w-full gap-6 bg-gray-100 p-8">
                <Card className="w-full max-w-7xl space-y-8 p-8 bg-gradient-to-r from-blue-50 to-gray-100 rounded-lg shadow-lg">
                    {/* Skeleton for Account Balance */}
                    <div className="space-y-4">
                        <Skeleton isLoaded={!loading} className="h-8 w-1/4 rounded-md"></Skeleton>
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton isLoaded={!loading} className="h-6 w-1/4 rounded-md"></Skeleton>
                                <Skeleton isLoaded={!loading} className="h-6 w-1/4 rounded-md"></Skeleton>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton isLoaded={!loading} className="h-6 w-1/4 rounded-md"></Skeleton>
                                <Skeleton isLoaded={!loading} className="h-6 w-1/4 rounded-md"></Skeleton>
                            </div>
                        </div>
                    </div>
    
                    {/* Skeleton for Payment Assets */}
                    <div className="space-y-4">
                        <Skeleton isLoaded={!loading} className="h-8 w-1/3 rounded-md"></Skeleton>
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-4">
                                <Skeleton isLoaded={!loading} className="h-6 w-full rounded-md"></Skeleton>
                                <Skeleton isLoaded={!loading} className="h-6 w-full rounded-md"></Skeleton>
                                <Skeleton isLoaded={!loading} className="h-6 w-full rounded-md"></Skeleton>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <Skeleton isLoaded={!loading} className="h-6 w-full rounded-md"></Skeleton>
                                <Skeleton isLoaded={!loading} className="h-6 w-full rounded-md"></Skeleton>
                                <Skeleton isLoaded={!loading} className="h-6 w-full rounded-md"></Skeleton>
                            </div>
                        </div>
                    </div>
    
                    {/* Skeleton for Recent Payouts */}
                    <div className="space-y-4">
                        <Skeleton isLoaded={!loading} className="h-8 w-1/3 rounded-md"></Skeleton>
                        <div className="space-y-2">
                            <div className="grid grid-cols-4 gap-4">
                                <Skeleton isLoaded={!loading} className="h-6 w-full rounded-md"></Skeleton>
                                <Skeleton isLoaded={!loading} className="h-6 w-full rounded-md"></Skeleton>
                                <Skeleton isLoaded={!loading} className="h-6 w-full rounded-md"></Skeleton>
                                <Skeleton isLoaded={!loading} className="h-6 w-full rounded-md"></Skeleton>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                <Skeleton isLoaded={!loading} className="h-6 w-full rounded-md"></Skeleton>
                                <Skeleton isLoaded={!loading} className="h-6 w-full rounded-md"></Skeleton>
                                <Skeleton isLoaded={!loading} className="h-6 w-full rounded-md"></Skeleton>
                                <Skeleton isLoaded={!loading} className="h-6 w-full rounded-md"></Skeleton>
                            </div>
                        </div>
                        <Skeleton isLoaded={!loading} className="h-10 w-1/5 rounded-md mt-4"></Skeleton>
                    </div>
                </Card>
            </div>
        );
    }
    

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>

        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
                <p className="text-center">
                    Enhance your business skills by visiting our new Business Academy. <br />
                    Please visit the link below to access valuable resources and courses. <br />
                    <Link href="/academy" className="text-pink-200 underline">
                        Business Academy
                    </Link>
                </p>
            </div>

            {stripeAccountId && disabled && (
                <div className="bg-orange-500 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
                    <p className="text-center">
                        Unfortunately, your account has been temporarily disabled due to some outstanding information. <br />
                        Please visit the link below to provide the necessary details and reactivate your account. <br />
                    </p>
                </div>
            )}

            {stripeAccountId && requiredInfo && (
                <div className="bg-blue-500 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
                    <p className="text-center">
                        We partner with Stripe for payment processing and compliance. To ensure seamless payment processing, we occasionally need additional information from you. <br />
                        Currently, there is some outstanding information required for your account. Please visit{' '}
                        <Link href="/account/verification" className="text-pink-200 underline">
                            here{' '}
                        </Link>
                        to provide the necessary details and avoid any disruptions to your payment processing.
                    </p>
                </div>
            )}

            {!stripeAccountId && (
                <div className="bg-blue-500 text-white p-4 rounded-md shadow-md my-2 text-xl w-3/4 mx-auto">
                    <p className="text-center">
                        We partner with Stripe for payment processing and compliance. To complete the setup of your payment processing account, we need some additional information from you. <br />
                        Please visit{' '}
                        <Link href="/account/verification" className="text-pink-200 underline">
                            here
                        </Link>{' '}
                        to provide the required details and ensure uninterrupted payment processing.
                    </p>
                </div>
            )}

            {/* Main Layout */}
            <div className="flex flex-col gap-4 w-full md:w-2/3 p-4 mx-auto">
                {/* AccountInfo Component */}
                <div className="w-full">
                <AccountInfo settingsButton={openSettingsButton} />
                </div>
            </div>

            {/* Settings Modal */}
            <Modal isOpen={isSettingsModalOpen} size={'3xl'} onClose={() => setSettingsModalOpen(false)}>
                <ModalContent className="max-h-screen overflow-y-auto">
                <ModalHeader className="border-b border-gray-200 text-center">
                    <h3 className='w-full'>Settings</h3>
                </ModalHeader>
                    <ModalBody className="border-b border-gray-200 py-10">
                        <Settings />
                    </ModalBody>
                    <ModalFooter className="border-t border-gray-200">
                        <button
                            className="bg-gray-500 text-white py-2 px-4 rounded-md"
                            onClick={() => setSettingsModalOpen(false)}
                        >
                            Close
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
