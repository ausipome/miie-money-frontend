'use client';

import ContactForm from './contactForm';
import Footer from './footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';

export default function ContactPage() {
  return (
    <>
    {/* Header Section */}
    <section className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-8 mt-6">
    <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Need to contact us?</h1>
    <p className="text-lg md:text-xl font-light mb-6">
        We'd love to hear from you! 
        </p>
  </section>

  {/* Subheader */}
  <section className="bg-gray-100 py-6 px-6 text-center">
  <p className="text-lg md:text-xl font-light mb-6">
  We have many ways for you to reach us. If you need help or have any questions, drop us a message and we'll get back to you as soon as possible.
    </p>
      </section>

    <div className="min-h-screen bg-gradient-to-r from-blue-950 to-blue-600 py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Contact Form Section */}
        <div>
          <ContactForm />
        </div>

        {/* Additional Contact Options */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Other Ways to Get Help</h2>
          <ul className="space-y-4 text-gray-600 text-lg">
            <li>
              📧 Email me at{' '}
              <a
                href="mailto:martyn@getpaidontheweb.com"
                className="text-blue-500 underline"
              >
                martyn@getpaidontheweb.com
              </a>
            </li>
            <li>
            <FontAwesomeIcon className='text-green-500' icon={byPrefixAndName.fab['whatsapp']} /><span className='text-green-500'> WhatsApp</span> me at{' '}
              +44 7902 123456
            </li>
            <li><a href="https://www.instagram.com/get.paid.on.the.web" target="_blank" rel="noopener noreferrer" className="hover:underline">
            <FontAwesomeIcon className='text-pink-400' icon={byPrefixAndName.fab['instagram']} /> DM me on Instagram
            </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
