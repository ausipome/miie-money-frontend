'use client';

import { motion } from "framer-motion";
import CustomSubscriptionForm from "./subscribe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { byPrefixAndName } from "@awesome.me/kit-515ba5c52c/icons";
import Footer from "./footer";

export default function Docs() {
    return (
        <>
        {/* Header Section */}
        <section className="text-center bg-gradient-to-r from-blue-950 to-blue-600 text-white py-8 mt-6">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-pink-200">Documentation Coming Soon!</h1>
        <div className="md:w-2/3 sm:w-full m-auto">
          <p className="text-lg md:text-xl font-light mb-6">
            Full documentation is currently being written on how to use our invoice builder and link generator components. We will also shortly be launching our subscription builder component which can be either used on our site or implemented on to your own website.
          </p>
          <p className="text-lg md:text-xl font-light">
            Stay in the loop and be the first to know when these updates go live! Subscribe to our community or follow us using the links below. By joining, you’ll gain access to updates, exclusive content, and special offers for our components. Your journey starts here—let’s build something amazing together!
          </p>
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
          <a href="https://www.facebook.com/getpaidontheweb" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={byPrefixAndName.fab['facebook']} />
          </a>
          <a href="https://www.instagram.com/get.paid.on.the.web" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={byPrefixAndName.fab['instagram']} />
          </a>
          <a href="https://www.youtube.com/@GetPaidOnTheWeb" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={byPrefixAndName.fab['youtube']} />
          </a>
        </motion.div>
      </div>
    </section>

    <Footer />
        </>

        
       
    );
}