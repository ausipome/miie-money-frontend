'use client';

import { useAuth } from '../../hooks/useAuth'; 
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import IsLoggedIn from "../user/IsLoggedIn";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';

export default function TopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated} = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) {
        setIsMenuOpen(false); // Close the menu automatically when resizing to large screens
      }
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-white w-full h-[80px] z-50">
      <nav className="m-auto w-[97%] left-[1.5%] bg-[rgba(108,159,193)] rounded-full p-4">
        <div className="w-full mx-auto flex justify-between items-center gap-6">
          {/* Left side */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src="/logo_side.png"
                  alt="Miie Money logo which is a pink and blue smile formed in the shape of an M"
                  width={286}
                  height={50}
                />
              </Link>
            </div>
          </div>

          {/* Hamburger Menu */}
          <button
            className="text-white px-4 py-2 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon
              className="text-2xl"
              icon={byPrefixAndName.far['bars']}
            />
          </button>

          {/* Middle and Right sections */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } absolute top-[95px] left-0 w-full bg-white shadow-lg lg:shadow-none lg:border-none lg:static lg:flex lg:flex-grow lg:items-center lg:justify-between lg:bg-transparent`}
          >
            {/* Middle (Links) */}
            <div
              className={`flex flex-col lg:flex-row lg:items-center text-xl lg:ml-8 ${
                isMenuOpen ? "space-y-2" : ""
              }`}
            >
              {isAuthenticated ? (
                // AccountNav Links
                <>
                  <div className="relative group">
                    <Link
                      href="#"
                      className={`py-3 px-4 ${
                        isMenuOpen
                          ? "text-black hover:bg-pink-50"
                          : "text-white"
                      }`}
                    >
                      Get Paid
                    </Link>
                    <div
                      className={`absolute ${
                        isMenuOpen ? "left-[60px]" : "left-0"
                      } hidden group-hover:block bg-white shadow-lg mt-1 rounded text-lg`}
                    >
                      <Link
                        href="/account/invoice"
                        className="block px-4 py-2 text-gray-800 hover:bg-pink-50"
                      >
                        Invoice
                      </Link>
                      <Link
                        href="/account/payment-link"
                        className="block px-4 py-2 text-gray-800 hover:bg-pink-50"
                      >
                        Payment Link
                      </Link>
                      <Link
                        href="/account/subscription"
                        className="block px-4 py-2 text-gray-800 hover:bg-pink-50"
                      >
                        Subscription
                      </Link>
                    </div>
                  </div>
                  <Link
                    href="/account/address-book"
                    className={`py-3 px-4 ${
                      isMenuOpen
                        ? "text-black hover:bg-pink-50"
                        : "text-white hover:text-pink-200"
                    }`}
                  >
                    Address Book
                  </Link>
                  <Link
                    href="/learn"
                    className={`py-3 px-4 ${
                      isMenuOpen
                        ? "text-black hover:bg-pink-50"
                        : "text-white hover:text-pink-200"
                    }`}
                  >
                    Learn
                  </Link>
                  <Link
                    href="/help"
                    className={`py-3 px-4 ${
                      isMenuOpen
                        ? "text-black hover:bg-pink-50"
                        : "text-white hover:text-pink-200"
                    }`}
                  >
                    Help
                  </Link>
                </>
              ) : (
                // TopNav Links
                <>
                  <Link
                    href="/learn"
                    className={`py-3 px-4 ${
                      isMenuOpen
                        ? "text-black hover:bg-pink-50"
                        : "text-white hover:text-pink-200"
                    }`}
                  >
                    Learn
                  </Link>
                  <Link
                    href="/help"
                    className={`py-3 px-4 ${
                      isMenuOpen
                        ? "text-black hover:bg-pink-50"
                        : "text-white hover:text-pink-200"
                    }`}
                  >
                    Help
                  </Link>
                  <Link
                    href="/pricing"
                    className={`py-3 px-4 ${
                      isMenuOpen
                        ? "text-black hover:bg-pink-50"
                        : "text-white hover:text-pink-200"
                    }`}
                  >
                    Pricing
                  </Link>
                </>
              )}

              {/* Logged In Component (Visible only in Collapsed Menu) */}
              {isMenuOpen && (
                <div className="mt-4 lg:hidden">
                  <IsLoggedIn isMenuOpen={isMenuOpen} />
                </div>
              )}
            </div>

            {/* Right Side */}
            <div className="mt-4 lg:mt-0 flex justify-center lg:justify-end items-center">
              {!isMenuOpen && <IsLoggedIn isMenuOpen={isMenuOpen} />}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
