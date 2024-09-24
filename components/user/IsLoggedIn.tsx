'use client';

import { useAuth } from '../../hooks/useAuth'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';

export default function IsLoggedIn() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {isAuthenticated ? <FontAwesomeIcon icon={byPrefixAndName.fal['eye-slash']} /> : <FontAwesomeIcon icon={byPrefixAndName.fal['eye']} />}
        </>
    );
}