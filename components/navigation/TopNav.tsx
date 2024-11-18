'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import IsLoggedIn from "../user/IsLoggedIn";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';

export default function TopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <div className="fixed top-0 bg-white w-full h-[80px] z-50">
      <nav className="fixed top-3 w-[97%] left-[1.5%] bg-[rgba(90,135,170)] rounded-full p-4">
        <div className="w-full mx-auto flex justify-between items-center">
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
            {isMenuOpen ? <FontAwesomeIcon className="text-2xl text-pink-200" icon={byPrefixAndName.far['bars']} /> :  <FontAwesomeIcon className="text-2xl" icon={byPrefixAndName.far['bars']} />}
          </button>

          {/* Middle and Right sections */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } absolute top-[95px] left-0 w-full bg-white shadow-lg lg:shadow-none lg:border-none lg:static lg:flex lg:flex-grow lg:items-center lg:justify-between lg:bg-transparent ${
              isMenuOpen ? "ml-10 lg:ml-20" : "ml-20 sm:ml-10 md:ml-20"
            }`}
          >
            {/* Middle (Links) */}
            <div
              className={`flex flex-col lg:flex-row lg:items-center text-xl ${
                isMenuOpen ? "space-y-2" : ""
              }`}
            >
              <Link
                href="docs"
                className={`py-3 px-4 ${
                  isMenuOpen ? "text-black hover:bg-pink-50" : "text-white hover:text-pink-200"
                }`}
              >
                Docs
              </Link>
              <Link
                href="learn"
                className={`py-3 px-4 ${
                  isMenuOpen ? "text-black hover:bg-pink-50" : "text-white hover:text-pink-200"
                }`}
              >
                Learn
              </Link>
              <Link
                href="help"
                className={`py-3 px-4 ${
                  isMenuOpen ? "text-black hover:bg-pink-50" : "text-white hover:text-pink-200"
                }`}
              >
                Help
              </Link>

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

