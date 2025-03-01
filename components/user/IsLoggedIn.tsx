'use client';

import { useAuth } from '../../hooks/useAuth'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';
import Link from 'next/link';
import { useState } from 'react';

interface IsLoggedInProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;
}

export default function IsLoggedIn({ isMenuOpen, setIsMenuOpen }: IsLoggedInProps) {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const { isAuthenticated, loading } = useAuth();
    const closeMenu = () => {
        if (isMenuOpen) {
          setIsMenuOpen(false);
        }
      };

    if (loading) {
        return null; // Show nothing while loading
    }

    return (
        <>
            {isAuthenticated ? (
                <div 
                    className="relative"
                    onMouseEnter={() => setDropdownVisible(true)}
                    onMouseLeave={() => setDropdownVisible(false)}
                >
                    {/* User Icon Link */}
                    <Link 
                        href="/account"
                        className={`py-2 px-4 text-2xl mr-4 text-${isMenuOpen ? 'black' : 'white'} hover:${isMenuOpen ? 'bg-pink-50' : 'text-pink-200'}`}
                    >
                        <FontAwesomeIcon icon={byPrefixAndName.fal['user']} />
                    </Link>

                    {/* Dropdown Menu */}
                    {dropdownVisible && (
                        <div className="absolute mt-1 bg-white shadow-lg rounded">
                            <Link 
                                href="/account" 
                                className="block px-4 py-2 text-gray-800 hover:bg-pink-50"
                                onClick={closeMenu}
                            >
                                Account
                            </Link>
                            <Link 
                                href="/logout" 
                                className="block px-4 py-2 text-gray-800 hover:bg-pink-50"
                                onClick={closeMenu}
                            >
                                Logout
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Signup and Login Links */}
                    <Link 
                        href="/signup" 
                        className={`text-${isMenuOpen ? 'black' : 'white'} py-2 px-4 text-xl hover:${isMenuOpen ? 'bg-pink-50' : 'text-pink-200'}`}
                        onClick={closeMenu}
                    >
                        Signup
                    </Link>
                    <Link 
                        href="/login" 
                        className={`text-${isMenuOpen ? 'black' : 'white'} py-2 px-4 text-xl hover:${isMenuOpen ? 'bg-pink-50' : 'text-pink-200'}`}
                        onClick={closeMenu}
                    >
                    Login
                    </Link>
                </>
            )}
        </>
    );
}
