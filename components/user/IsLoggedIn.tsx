'use client';

import { useAuth } from '../../hooks/useAuth'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';
import Link from 'next/link';
import { useState } from 'react';

export default function IsLoggedIn() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null;
    }

    return (
        <>
            {isAuthenticated ? <div 
                                className="relative" 
                                onMouseEnter={() => setDropdownVisible(true)} 
                                onMouseLeave={() => setDropdownVisible(false)}
                                >
                                <Link className="text-white py-2 hover:text-pink-200 px-4 text-2xl mr-4" href="account">
                                    <FontAwesomeIcon icon={byPrefixAndName.fal['user']} />
                                </Link>
                                {dropdownVisible && (
                                    <div className="absolute mt-1 bg-white shadow-lg rounded right-0">
                                    <Link className="block px-4 py-2 text-gray-800 hover:bg-gray-100" href="/account">Account</Link>
                                    <Link className="block px-4 py-2 text-gray-800 hover:bg-gray-100" href="/account/settings">Settings</Link>
                                    <Link className="block px-4 py-2 text-gray-800 hover:bg-gray-100" href="/logout">Logout</Link>
                                    </div>
                                )}
                                </div> 
            : <><Link className="text-white py-2 hover:text-pink-200 px-4 text-xl" href="signup">Signup</Link><Link className="text-white py-2 hover:text-pink-200 px-4 text-xl" href="login">Login</Link></>}
        </>
    );
}