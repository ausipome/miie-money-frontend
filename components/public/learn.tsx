'use client';

import Footer from "@/components/public/footer";
import { motion } from 'framer-motion';
import CustomSubscriptionForm from "@/components/public/subscribe";
import { Modal, ModalContent, ModalBody, ModalFooter } from '@nextui-org/modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';
import Countdown from 'react-countdown';
import { guides } from '@/components/academy/guides';
import Link from "next/link";
import { useState, useEffect } from "react";
import { Book } from "@/types";

export default function Learn() {

 const [selectedBook, setSelectedBook] = useState<Book | null>(null);
 const [isModalOpen, setModalOpen] = useState<boolean>(false);
 const [isClient, setIsClient] = useState(false);

 useEffect(() => {
   setIsClient(true);
 }, []);

 const Completionist = () => <span>This offer has now expired!</span>;

 const CountdownTimer = ({ endDate }: { endDate: string }) => {
   const countdownRenderer = ({ days, hours, minutes, seconds, completed }: { days: number, hours: number, minutes: number, seconds: number, completed: boolean }) => {
     if (completed) {
       return <Completionist />;
     } else {
       return (
         <div>
           <p className="text-lg md:text-4xl font-bold mb-6 text-red-700">
             Offer ends in {days} days, {hours} hours, {minutes} minutes, and {seconds} seconds.
           </p>
         </div>
       );
     }
   };

   return <Countdown date={new Date(endDate)} renderer={countdownRenderer} />;
 };

 const openModal = (book: Book) => {
   setSelectedBook(book);
   setModalOpen(true);
 };

 const handleDownloadClick = async () => {
   if (selectedBook) {
     
    const fileResponse = await fetch(selectedBook.download, {
      method: 'GET',
      credentials: 'include',
    });

    if (!fileResponse.ok) {
      alert('Failed to download the file. Please try again later.');
      return;
    }

    const blob = await fileResponse.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = selectedBook.title; // Optional: Set the download attribute to suggest a filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

   }
 };

 return (
   <>
    {/* Header Section */}
<section className="text-center bg-gradient-to-r from-blue-800 to-blue-500 text-white py-12 mt-6">
  <div className="md:w-2/3 sm:w-full m-auto">
    <p className="text-2xl md:text-4xl font-semibold mb-6 text-yellow-300">Academy Launches March 31</p>
    <p className="text-lg md:text-2xl font-light mb-6">
      Sign up now and receive instant lifetime access to our entire content library for free. Offer ends March 30, 2025.
    </p>
    {isClient && <CountdownTimer endDate="2025-03-30" />}
    <Link href="/signup">
          <button className="px-6 py-3 text-lg font-semibold bg-white text-blue-700 rounded-full shadow hover:bg-blue-100">
            Sign Up
          </button>
    </Link>
  </div>
</section>

     {/* Guides Section */}
     <div className="bg-gradient-to-r from-gray-700 to-gray-500 py-8 w-full pt-12">
       <h2 className="text-2xl text-white px-4 py-2 w-full text-center">
    Here are a selection of free guide books to start you on your journey. Our library is full of resources to help you start and grow your online business.
  </h2>
       <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-6 mt-6 lg:w-5/6 mx-auto`}>
         {guides.map(guide => (
           <motion.div
             className="cursor-pointer transform transition duration-500 hover:scale-105 shadow-lg rounded-lg overflow-hidden"
             onClick={() => openModal(guide)}
             whileHover={{ scale: 1.05 }}
           >
             <img src={guide.image} alt={guide.title} style={{ aspectRatio: '0.773' }} className="w-full object-cover" />
           </motion.div>
         ))}
       </div>
     </div>

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

     {selectedBook && (
       <Modal isOpen={isModalOpen} size="3xl" onClose={() => setModalOpen(false)} className="w-full sm:w-3/4">
         <ModalContent>
           <ModalBody className="max-h-[80vh] overflow-y-auto">
             <div className="w-3/4 mx-auto mt-8">
               <img
                 src={selectedBook.image}
                 alt={selectedBook.title}
                 style={{ aspectRatio: '0.773', maxHeight: '80vh' }}
                 className="w-full object-cover rounded-t-lg mb-4"
               />
             </div>
             <h3 className='text-center w-full font-bold text-lg'>{selectedBook.title}</h3>
             {selectedBook.detailedDescription ? (
               <div className='px-6'>
                 <p>{selectedBook.detailedDescription.intro}</p>
                 <h4 className='font-bold mt-4'>What&apos;s Inside:</h4>
                 <ul className='list-disc list-inside'>
                   {selectedBook.detailedDescription.whatsInside.map((item, index) => (
                     <li key={index}>{item}</li>
                   ))}
                 </ul>
                 <h4 className='font-bold mt-4'>What You Will Learn:</h4>
                 <ul className='list-disc list-inside'>
                   {selectedBook.detailedDescription.whatReadersWillLearn.map((item, index) => (
                     <li key={index}>{item}</li>
                   ))}
                 </ul>
                 {selectedBook.detailedDescription.outro && (
                   <p className='mt-4'>{selectedBook.detailedDescription.outro}</p>
                 )}
               </div>
             ) : (
               <p className='px-6'>{selectedBook.description}</p>
             )}
           </ModalBody>
           <ModalFooter>
             <button
               className="px-2 py-2 md:px-4 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm md:text-base"
               onClick={() => setModalOpen(false)}
             >
               Close
             </button>
             <button
               className="px-2 py-2 md:px-4 bg-green-500 text-white rounded hover:bg-green-700 text-sm md:text-base"
               onClick={handleDownloadClick}
             >
               Download
             </button>
           </ModalFooter>
         </ModalContent>
       </Modal>
     )}

     <Footer />
   </>
 );
}