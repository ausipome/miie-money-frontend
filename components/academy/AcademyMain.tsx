"use client";

    import { useState } from 'react';
    import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
    
    interface Book {
      id: number;
      title: string;
      image: string;
      tags: string[];
      description: string;
    }
    
    const books: Book[] = [
      { id: 1, title: 'Crushing It!', image: 'http://localhost:3000/test/crushing-it.jpg', tags: ['business', 'social media'], description: 'Learn how to make your personal brand stand out.' },
      { id: 2, title: 'Lean Startup', image: 'http://localhost:3000/test/lean-startup.jpg', tags: ['business', 'marketing'], description: 'A new approach to business that\'s being adopted around the world.' },
      { id: 3, title: 'Invisible Influence', image: 'http://localhost:3000/test/invisible-influence.jpg', tags: ['marketing', 'ecommerce'], description: 'The hidden forces that shape behavior.' },
      { id: 4, title: 'Hooked', image: 'http://localhost:3000/test/crushing-it.jpg', tags: ['business'], description: 'How to build habit-forming products.' },
      { id: 5, title: 'Start With Why', image: 'http://localhost:3000/test/invisible-influence.jpg', tags: ['leadership'], description: 'How great leaders inspire everyone to take action.' },
    ];
    
    export default function BookLibrary() {
      const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
      const [selectedBook, setSelectedBook] = useState<Book | null>(null);
      const [isModalOpen, setModalOpen] = useState<boolean>(false);
      const [activeTag, setActiveTag] = useState<string | null>(null);
    
      const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        const filtered = books.filter(book => book.title.toLowerCase().includes(query));
        setFilteredBooks(filtered);
        setActiveTag(null); // Clears any active tag on search
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
      };
    
      const openModal = (book: Book) => {
        setSelectedBook(book);
        setModalOpen(true);
      };
    
      return (
        <div className="p-4">
          <div className="flex flex-col items-center space-y-4">
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
              {['business', 'social media', 'marketing', 'ecommerce'].map(tag => (
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
          <div className={`grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-x-12 gap-y-6 mt-6 lg:w-4/5 mx-auto`}>  
            {filteredBooks.map(book => (
              <div
                key={book.id}
                className="cursor-pointer transform transition duration-500 hover:scale-105 shadow-lg rounded-lg overflow-hidden"
                onClick={() => openModal(book)}
              >
                <img src={book.image} alt={book.title} style={{ aspectRatio: '0.773' }} className="w-full object-cover mb-2" />
                <h3 className="text-center text-lg">{book.title}</h3>
              </div>
            ))}
          </div>
    
          {selectedBook && (
            <Modal isOpen={isModalOpen} size="3xl" onClose={() => setModalOpen(false)} className="w-full sm:w-3/4">
              <ModalContent>
                <ModalHeader>
                  <h3 className='text-center w-full'>{selectedBook.title}</h3>
                </ModalHeader>
                <ModalBody>
                  <div className="w-3/4 mx-auto">
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    style={{ aspectRatio: '0.773', maxHeight: '80vh' }}
                    className="w-full object-cover rounded-t-lg mb-4"
                  />
                  </div>
                  <p className='px-6'>{selectedBook.description}</p>
                </ModalBody>
                <ModalFooter>
                  <button
                    className="px-2 py-2 md:px-4 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm md:text-base"
                    onClick={() => setModalOpen(false)}
                  >
                    Close
                  </button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </div>
      );
    }
    