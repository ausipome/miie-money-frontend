'use client';


import Link from 'next/link';
import WordCloud from './wordCloud';
import SecurePayInvoiceDemo from '../invoice/SecurePayInvoiceDemo';
import TopNav from '../navigation/TopNav';
import { motion } from 'framer-motion';
import LinkBuilderDemo from '../links/LinkDemo';
import CustomSubscriptionForm from './subscribe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';
import Footer from './footer';

const textItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: { transition: { staggerChildren: 0.3 } },
};

// Variants for the boxes
const boxVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  
  return (
    <>
      <TopNav />
      <div className="pt-[30px]">
        {/* Hero Section */}
        <section className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
            Payment Components For The Web
          </h1>
          <p className="text-2xl md:text-3xl font-semibold mb-4">
            Instantly ready, endlessly adaptable
          </p>
          <p className="text-lg md:text-xl font-light mb-6">
            Use out of the box or integrate into your own projects.
          </p>
          <div className="space-x-4">
            <Link href="/signup">
              <button className="px-6 py-3 text-lg font-semibold bg-white text-blue-500 rounded-full shadow hover:bg-blue-100">
                Get Started
              </button>
            </Link>
            <Link href="/docs">
              <button className="px-6 py-3 text-lg font-semibold bg-transparent border border-white rounded-full hover:bg-white hover:text-blue-500">
                See Docs
              </button>
            </Link>
          </div>
        </section>

        {/* Showcase Section */}
        <section className="py-6 bg-gray-100 text-center min-h-[400px]">
          <WordCloud />
        </section>

        {/* Payment Demo Section */}
        <section className="py-16 bg-gradient-to-r from-blue-950 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-800 opacity-20 pointer-events-none"></div>
        <div className="max-w-[98%] 2xl:max-w-[80%] mx-auto px-6 md:grid md:grid-cols-1 lg:grid-cols-2 lg:gap-10 h-full flex items-center justify-center">
          {/* Left Side: Static Container with Animated Text */}
          <motion.div
            className="bg-gradient-to-br from-blue-700 to-blue-800 p-10 rounded-lg shadow-lg flex flex-col justify-between"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            style={{ height: 'fit-content' }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-md"
              variants={textItem}
            >
              Powerful payment components for invoices, links, subscriptions, or whatever your business needs.
            </motion.h2>
            <motion.p
              className="mt-6 text-lg font-light"
              variants={textItem}
            >
              Streamline payments with seamless components that work for you. From professional invoices to versatile payment links and subscription management, we can adapt our solutions to any business model.
            </motion.p>
            <motion.h3
              className="mt-10 text-2xl font-semibold text-blue-300"
              variants={textItem}
            >
              Country-dependent payment options available:
            </motion.h3>
            <motion.ul
              className="mt-6 space-y-2 text-lg"
              variants={staggerContainer}
            >
              {[
                'Credit and Debit Cards',
                'International Card Payments',
                'Stripe Link',
                'Buy Now Pay Later (Afterpay, Klarna, ZIP)',
                'Google Pay',
                'Apple Pay',
                'BACS and ACH Direct Debits',
                'iDEAL',
              ].map((option, index) => (
                <motion.li key={index} variants={textItem}>
                  {option}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right Side: Invoice Component */}
          <div className="flex justify-center mt-10 lg:mt-0">
            <div className="w-full relative overflow-hidden">
              <div className="relative z-10">
                <SecurePayInvoiceDemo />
              </div>
            </div>
          </div>
        </div>
      </section>


              {/* About Section */}
        <section className="py-16 bg-gray-100 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={boxVariants} // Animate the title
        >
          GET PAID ON THE WEB DOT COM
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 max-w-[98%]  xl:max-w-[90%] 2xl:max-w-[80%] mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer} // Animate the boxes with staggered effect
        >
          {/* Top Row: 3 Equal Boxes */}
          <motion.div
            className="p-6 bg-blue-800 text-white rounded-lg shadow-lg"
            variants={boxVariants}
          >
            <h3 className="text-2xl font-bold mb-4">
              Build Professional Invoices, Quotes, and Subscriptions
            </h3>
            <p className="text-lg">
              getpaidontheweb.com provides tools to easily create professional-looking invoices, quotes, and subscription management, helping you present a polished image to your clients.
            </p>
          </motion.div>
          <motion.div
            className="p-6 bg-blue-400 text-white rounded-lg shadow-lg"
            variants={boxVariants}
          >
            <h3 className="text-2xl font-bold mb-4">AI-Powered Communication</h3>
            <p className="text-lg">
              The platform uses AI technology to assist you in writing effective communications, such as invoice emails and payment links, saving you time and ensuring consistent messaging.
            </p>
          </motion.div>
          <motion.div
            className="p-6 bg-teal-300 text-black rounded-lg shadow-lg"
            variants={boxVariants}
          >
            <h3 className="text-2xl font-bold mb-4">Secure Payments</h3>
            <p className="text-lg">
              Payments made through getpaidontheweb.com are much more secure than traditional bank transfers, providing peace of mind and protecting your business and your customers' sensitive information.
            </p>
          </motion.div>

          {/* Bottom Row: 2 Larger Boxes */}
          <motion.div
            className="p-8 sm:col-span-1 bg-orange-600 text-white rounded-lg shadow-lg"
            variants={boxVariants}
          >
            <h3 className="text-2xl font-bold mb-4">Save Time on Business Management</h3>
            <p className="text-lg">
              getpaidontheweb.com's all-in-one platform allows you to streamline your business operations, freeing up your time to focus on what really matters - growing your business and serving your customers.
            </p>
          </motion.div>
          <motion.div
            className="p-8 sm:col-span-1 lg:col-span-2 bg-blue-800 text-white rounded-lg shadow-lg"
            variants={boxVariants}
          >
            <h3 className="text-2xl font-bold mb-4">Improved Customer Experience</h3>
            <p className="text-lg">
              By using getpaidontheweb.com, you can provide your customers with a seamless and professional experience, from invoicing to payment processing, leading to increased satisfaction and loyalty.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* AI-Powered Demo Section */}
<section className="py-16 bg-gradient-to-r from-gray-900 to-gray-700 text-white relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-800 opacity-20 pointer-events-none"></div>
  <div className="max-w-[98%] 2xl:max-w-[80%] mx-auto px-6 md:grid md:grid-cols-1 lg:grid-cols-2 lg:gap-10 h-full flex items-center justify-center">
    {/* Left Side: AI-Powered Demo Component */}
    <div className="flex justify-center mt-10 lg:mt-0 text-black">
      <div className="w-full relative overflow-hidden">
        <div className="relative z-10">
          <LinkBuilderDemo />
        </div>
      </div>
    </div>

    {/* Right Side: Description */}
    <motion.div
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-lg shadow-lg flex flex-col justify-between"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      style={{ height: 'fit-content' }}
    >
      <motion.h2
        className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-md"
        variants={textItem}
      >
        Save Time and Elevate Your Communication with AI
      </motion.h2>
      <motion.p
        className="mt-6 text-lg font-light"
        variants={textItem}
      >
        Harness the power of AI to generate payment links and communications that are not only professional but also personalized for your customers. Let AI handle the tedious details, so you can focus on running your business.
      </motion.p>
      <motion.h3
        className="mt-10 text-2xl font-semibold text-blue-300"
        variants={textItem}
      >
        Why Choose AI-Powered Solutions?
      </motion.h3>
      <motion.ul
        className="mt-6 space-y-2 text-lg"
        variants={staggerContainer}
      >
        {[
          'Save valuable time by automating repetitive tasks.',
          'Ensure consistent and professional messaging.',
          'Improve customer satisfaction with tailored communication.',
          'Boost your brand image with polished and error-free interactions.',
        ].map((benefit, index) => (
          <motion.li key={index} variants={textItem}>
            {benefit}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  </div>
</section>

{/* Community Subscription Section */}
<section className="py-16 bg-gradient-to-r from-teal-600 to-green-500 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-green-900 opacity-20 pointer-events-none"></div>
      <div className="max-w-[98%] 2xl:max-w-[80%] mx-auto px-6 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-md"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
        >
          Join Our Community
        </motion.h2>
        <motion.p
          className="text-xl md:text-2xl font-light mb-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
        >
          Sign up now and get <strong>free content for life</strong>. Be part of a growing community of creators and business owners who want to get paid on the web.
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
          }}
          className="mx-auto max-w-[700px]"
        >
          <CustomSubscriptionForm />
        </motion.div>
        <motion.p
          className="mt-6 text-lg font-light"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
        >
          Weekly newsletter with tips and tricks on getting paid. Courses on building platforms, shops, web components, and more...
        </motion.p>

        {/* Community Benefits */}
        <motion.div
          className="mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
          }}
        >
          <ul className="space-y-3 text-left max-w-[600px] mx-auto text-slate-800 text-lg">
            {[
              "Exclusive access to tutorials and courses.",
              "Weekly tips for building your online presence.",
              "First look at new features and tools.",
              "Direct support from our team.",
              "Connect with like-minded creators and entrepreneurs.",
            ].map((benefit, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 bg-green-700 text-white rounded-full flex items-center justify-center">
                  ✓
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Social Media Badges */}
        <motion.div
          className="mt-12 flex justify-center space-x-6 text-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
          }}
        >
          <a href="https://www.tiktok.com/@get.paid.on.the.web" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={byPrefixAndName.fab['tiktok']} />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={byPrefixAndName.fab['facebook']} />
          </a>
          <a href="https://www.instagram.com/get.paid.on.the.web" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={byPrefixAndName.fab['instagram']} />
          </a>
        </motion.div>
      </div>
    </section>

    <Footer />

      </div>
    </>
  );
}
