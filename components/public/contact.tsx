'use client';

import { motion } from 'framer-motion';
import ContactForm from './contactForm';
import Footer from './footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

export default function ContactPage() {
  return (
    <>
      {/* Header Section */}
      <motion.section
        className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-8 mt-6"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-extrabold mb-4"
          variants={fadeIn}
        >
          Need to contact us?
        </motion.h1>
        <motion.p className="text-lg md:text-xl font-light mb-6" variants={fadeIn}>
          We'd love to hear from you!
        </motion.p>
      </motion.section>

      {/* Subheader */}
      <motion.section
        className="bg-gray-100 py-6 px-6 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.p className="text-lg md:text-xl font-light mb-6" variants={fadeIn}>
          We have many ways for you to reach us. If you need help or have any questions, drop us a message and we'll get back to you as soon as possible.
        </motion.p>
      </motion.section>

      <motion.div
        className="min-h-screen bg-gradient-to-r from-blue-950 to-blue-600 py-16 px-6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Contact Options */}
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg"
            variants={fadeIn}
          >
            <motion.h2
              className="text-2xl font-bold text-gray-900 mb-4"
              variants={fadeIn}
            >
              Ways to Get Help
            </motion.h2>
            <motion.ul className="space-y-4 text-gray-600 text-lg" variants={staggerContainer}>
              <motion.li variants={fadeIn}>
                📧 Email me at{' '}
                <a
                  href="mailto:martyn@getpaidontheweb.com"
                  className="text-blue-500 underline"
                >
                  martyn@getpaidontheweb.com
                </a>
              </motion.li>
              <motion.li variants={fadeIn}>
                <FontAwesomeIcon
                  className="text-green-500"
                  icon={byPrefixAndName.fab['whatsapp']}
                />{' '}
                <span className="text-green-500">WhatsApp</span> me at{' '}
                +44 7902 123456
              </motion.li>
              <motion.li variants={fadeIn}>
                <a
                  href="https://www.instagram.com/get.paid.on.the.web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  <FontAwesomeIcon
                    className="text-pink-400"
                    icon={byPrefixAndName.fab['instagram']}
                  />{' '}
                  DM me on Instagram
                </a>
              </motion.li>
              <motion.li variants={fadeIn}>Or fill out the contact form below...</motion.li>
            </motion.ul>
          </motion.div>

          {/* Contact Form Section */}
          <motion.div variants={fadeIn}>
            <ContactForm />
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </>
  );
}
