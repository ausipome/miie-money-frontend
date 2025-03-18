import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-5">
      <div className="container mx-auto flex flex-wrap justify-between px-4">
        {/* Contact Section */}
        <div className="w-full sm:w-1/4 mb-4 sm:mb-0">
          <h4 className="text-lg font-bold mb-2 text-pink-200">Contact</h4>
          <ul className="space-y-1">
          <li>
              <Link href="/help" className="hover:underline">Say hello</Link>
            </li>
            <li>
              <Link href="/help" className="hover:underline">Help</Link>
            </li>
            <li>
              <a href="mailto:martyn@getpaidontheweb.com" className="hover:underline">martyn@getpaidontheweb.com</a>
            </li>
          </ul>
        </div>

        {/* Info Section */}
        <div className="w-full sm:w-1/4 mb-4 sm:mb-0">
          <h4 className="text-lg font-bold mb-2 text-pink-200">Info</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/docs" className="hover:underline">Docs</Link>
            </li>
            <li>
              <Link href="/learn" className="hover:underline">Learn</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">Terms</Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:underline">Pricing</Link>
            </li>
          </ul>
        </div>

        {/* Account Section */}
        <div className="w-full sm:w-1/4 mb-4 sm:mb-0">
          <h4 className="text-lg font-bold mb-2 text-pink-200">Account</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/account" className="hover:underline">Account</Link>
            </li>
            <li>
              <Link href="/login" className="hover:underline">Login</Link>
            </li>
            <li>
              <Link href="/signup" className="hover:underline">Sign-Up</Link>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="w-full sm:w-1/4">
          <h4 className="text-lg font-bold mb-2 text-pink-200">Follow Us</h4>
          <ul className="space-y-1">
            <li>
              <a href="https://www.tiktok.com/@get.paid.on.the.web" target="_blank" rel="noopener noreferrer" className="hover:underline"><FontAwesomeIcon icon={byPrefixAndName.fab['tiktok']} /></a>
            </li>
            <li>
              <a href="https://www.instagram.com/get.paid.on.the.web" target="_blank" rel="noopener noreferrer" className="hover:underline"><FontAwesomeIcon icon={byPrefixAndName.fab['instagram']} /></a>
            </li>
            <li>
              <a href="https://www.facebook.com/getpaidontheweb" target="_blank" rel="noopener noreferrer" className="hover:underline"><FontAwesomeIcon icon={byPrefixAndName.fab['facebook']} /></a>
            </li>
            <li>
              <a href="https://www.youtube.com/@GetPaidOnTheWeb" target="_blank" rel="noopener noreferrer" className="hover:underline"><FontAwesomeIcon icon={byPrefixAndName.fab['youtube']} /></a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-4 text-sm text-gray-400">
        <p>© getpaidontheweb.com</p>
      </div>
    </footer>
  );
};

export default Footer;
