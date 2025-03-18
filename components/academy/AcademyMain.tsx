'use client';

import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { Modal, ModalContent, ModalBody, ModalFooter } from '@nextui-org/modal';
import useSubscriptionStatus from '@/hooks/useSubscriptionStatus';
import StripeSubscriptionCheckout from '../gpotw/subscriptions/SecureSubscription';
import { Skeleton } from '@nextui-org/skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';
import { Book } from "@/types";
import { books } from './eBooks';
import { courses } from './courses';
import { guides } from './guides';
import Footer from '../public/footer';
import { motion, useAnimation, useInView } from 'framer-motion';

import { ReactNode } from 'react';

const AnimatedItem = ({ children }: { children: ReactNode }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
    >
      {children}
    </motion.div>
  );
};

export default function Library() {
  const [xsrfToken] = useState(Cookies.get('XSRF-TOKEN') || '');
  const { subscription, loading, error } = useSubscriptionStatus();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setDownloadModalOpen] = useState<boolean>(false);
  const [downloadData, setDownloadData] = useState<{ downloads: number, subscription_renew: number } | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [booksDisplayed, setBooksDisplayed] = useState<number>(8);

  const subscribed = subscription && (subscription.status === 'active'  || subscription.status === 'complete' || subscription.status === 'life');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    const filtered = books.filter(book => book.title.toLowerCase().includes(query));
    setFilteredBooks(filtered);
    setActiveTag(null); // Clears any active tag on search
    setBooksDisplayed(8); // Reset the number of books displayed
  };

  const filterByTag = (tag: string | null) => {
    if (tag) {
      const filtered = books.filter(book => book.tags.includes(tag));
      setFilteredBooks(filtered);
      setActiveTag(tag);
    } else {
      setFilteredBooks(books); // Reset to show all books
      setActiveTag(null);
    }
    setBooksDisplayed(8); // Reset the number of books displayed
  };

  const openModal = (book: Book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const loadMoreBooks = () => {
    setBooksDisplayed(prev => prev + 8);
  };

  const handleDownloadClick = async () => {
    if (!selectedBook) return;
    const response = await fetch('/api/account/check-downloads', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': xsrfToken,
      },
      credentials: 'include',
  });
    const data = await response.json();
    setDownloadData(data);
    setDownloadModalOpen(true);
  };

  const confirmAndDownload = async () => {
    if (!selectedBook) return;
  
    const response = await fetch('/api/account/confirm-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': xsrfToken,
      },
      credentials: 'include',
    });
  
    const data = await response.json();
  
    if (data.confirm) {
      const link = document.createElement('a');
      link.href = selectedBook.download;
      link.download = selectedBook.title; // Optional: Set the download attribute to suggest a filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadModalOpen(false);
    } else {
      alert('Download could not be confirmed. Please try again later.');
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
};

  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-4">
        {/* Search Bar Skeleton */}
        <Skeleton isLoaded={!loading} className="rounded-lg">
          <div className="h-10 w-1/3 bg-gray-300 rounded"></div>
        </Skeleton>
  
        {/* Filter Buttons Skeleton */}
        <div className="flex space-x-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} isLoaded={!loading} className="rounded-lg">
              <div className="h-10 w-24 bg-gray-300 rounded"></div> {/* Button Placeholder */}
            </Skeleton>
          ))}
        </div>
  
        {/* Book Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-6 mt-6 lg:w-5/6 mx-auto">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} isLoaded={!loading} className="rounded-lg">
              <div className="h-64 w-full bg-gray-300 rounded-lg"></div> {/* Book Cover Placeholder */}
            </Skeleton>
          ))}
        </div>
      </div>
    );
  }
  

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <div className="pt-4">
        <div className="flex justify-center items-center pb-4">
          <FontAwesomeIcon icon={byPrefixAndName.fal['graduation-cap']} className="w-12 h-12 mr-4 text-4xl"/> 
          <h1 className="text-4xl font-bold text-center text-blue-900">Academy</h1>
        </div>

        {!subscribed && (
        <div className="flex flex-col items-center bg-white p-4 w-full mt-4">
          <div className="bg-white shadow-lg rounded-lg max-w-7xl text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Unlock Your Digital Potential</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Dive into an extensive collection of resources tailored to guide you through every step of your digital entrepreneurship journey. From expert tutorials and actionable strategies to community support, our academy is designed to help you thrive in the digital marketplace.
          </p>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Subscribe today and start transforming your online business ideas into reality.
          </p>
            <StripeSubscriptionCheckout />
          </div>
        </div>
      )}

        <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-8 px-4 w-full pt-12"> 
          <div className="flex flex-col items-center space-y-4 max-w-6xl mx-auto border-b-1 pb-6">
            <h2 className="text-2xl font-semibold text-black bg-white px-4 py-2 rounded-full">eBooks</h2> 
          </div>
          <div className="flex flex-col items-center space-y-4 max-w-6xl mx-auto border-b-1 pb-6 mt-6"> 
            <input
              type="text"
              placeholder="Search by title..."
              onChange={handleSearch}
              className="w-1/3 px-4 py-2 border rounded focus:outline-none focus:shadow-outline"
            />
            <div>
              <button
                onClick={() => filterByTag(null)}
                className={`mx-1 py-2 px-4 rounded font-bold transition-colors duration-300 ease-in-out ${!activeTag ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
              >
                All
              </button>
              {['Business', 'Social media', 'Marketing', 'eCommerce'].map(tag => (
                <button
                  key={tag}
                  onClick={() => filterByTag(tag)}
                  className={`mx-1 py-2 px-4 rounded font-bold transition-colors duration-300 ease-in-out ${activeTag === tag ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-6 mt-6 lg:w-5/6 mx-auto`}> 
            {filteredBooks.slice(0, booksDisplayed).map(book => (
              <AnimatedItem key={book.id}>
                <motion.div
                  className="cursor-pointer transform transition duration-500 hover:scale-105 shadow-lg rounded-lg overflow-hidden"
                  onClick={() => openModal(book)}
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={book.image} alt={book.title} style={{ aspectRatio: '0.773' }} className="w-full object-cover" />
                </motion.div>
              </AnimatedItem>
            ))}
          </div>
          {subscribed && booksDisplayed < filteredBooks.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMoreBooks}
                className="text-2xl px-4 py-2 bg-white text-black rounded hover:bg-pink-100"
              >
                More
              </button>
            </div>
          )}
        </div>

        {/* Courses Section */}
        <div className="bg-gradient-to-r from-teal-600 to-green-500 py-8 px-4 w-full pt-12">
          <div className="flex flex-col items-center space-y-4 max-w-6xl mx-auto border-b-1 pb-6">
            <h2 className="text-2xl font-semibold text-black bg-white px-4 py-2 rounded-full">Courses</h2>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-6 mt-6 lg:w-5/6 mx-auto`}>
            {courses.map(course => (
              <AnimatedItem key={course.id}>
                <motion.div
                  className="cursor-pointer transform transition duration-500 hover:scale-105 shadow-lg rounded-lg overflow-hidden"
                  onClick={() => openModal(course)}
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={course.image} alt={course.title} style={{ aspectRatio: '0.773' }} className="w-full object-cover" />
                </motion.div>
              </AnimatedItem>
            ))}
          </div>
        </div>

        {/* Guides Section */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-500 py-8 px-4 w-full pt-12">
          <div className="flex flex-col items-center space-y-4 max-w-6xl mx-auto border-b-1 pb-6">
            <h2 className="text-2xl font-semibold text-black bg-white px-4 py-2 rounded-full">Guides</h2>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-6 mt-6 lg:w-5/6 mx-auto`}>
            {guides.map(guide => (
              <AnimatedItem key={guide.id}>
                <motion.div
                  className="cursor-pointer transform transition duration-500 hover:scale-105 shadow-lg rounded-lg overflow-hidden"
                  onClick={() => openModal(guide)}
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={guide.image} alt={guide.title} style={{ aspectRatio: '0.773' }} className="w-full object-cover" />
                </motion.div>
              </AnimatedItem>
            ))}
          </div>
        </div>

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
                {subscribed && (
                  <button
                    className="px-2 py-2 md:px-4 bg-green-500 text-white rounded hover:bg-green-700 text-sm md:text-base"
                    onClick={handleDownloadClick}
                  >
                    Download
                  </button>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {downloadData && (
          <Modal isOpen={isDownloadModalOpen} size="md" onClose={() => setDownloadModalOpen(false)} className="w-full sm:w-3/4">
            <ModalContent>
              <ModalBody className="max-h-[80vh] overflow-y-auto p-4">
                <h2 className="text-lg font-semibold mb-4">Download Limit: 10 items per month</h2>
                {downloadData?.downloads >= 10 ? (
                  <p>
                    You have reached your download limit for this month. It will reset on {formatTimestamp(downloadData.subscription_renew)}.
                  </p>
                ) : (
                  <>
                    <p>Current downloads this month: {downloadData?.downloads}</p>
                    <p>Download limit will reset on: {formatTimestamp(downloadData?.subscription_renew)}</p>
                    <button
                      onClick={confirmAndDownload}
                      className="px-2 py-2 md:px-4 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm md:text-base mb-4 mt-4 text-center"
                    >
                      Download Now
                    </button>
                  </>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
        <Footer />
      </div>
    </div>
  );
}