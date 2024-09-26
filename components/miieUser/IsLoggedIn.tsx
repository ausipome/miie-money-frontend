'use client';

import { useAuth } from '../../hooks/useAuth'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';
import Link from 'next/link';

export default function IsLoggedIn() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {isAuthenticated ? <><Link className="text-white py-2 hover:text-gray-700 px-4 text-2xl mr-4" href="account"><FontAwesomeIcon icon={byPrefixAndName.fal['user']} /></Link></> : <><Link className="text-white py-2 hover:text-gray-700 px-4 text-xl" href="signup">Signup</Link><Link className="text-white py-2 hover:text-gray-700 px-4 text-xl" href="login">Login</Link></>}
        </>
    );
}