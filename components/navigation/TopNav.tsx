import Link from "next/link";
import Image from "next/image";
import IsLoggedIn from "../user/IsLoggedIn";

export default function TopNav() {
    return (
      <div className="fixed top-0 bg-white w-full h-[80px] z-50">
    <nav className="fixed top-3 w-[97%] left-[1.5%] bg-[rgba(90,135,170)] rounded-full p-4">
        <div className="w-full mx-auto flex justify-between items-center">
      {/* Left side */}
      <div className="flex items-center">
        <div className="flex-shrink-0">
        <Link href="/">
        <Image 
        src="/miie-money-side.png" 
        alt="Miie Money logo which is a pink and blue smile formed in the shape of an M" 
        width={200}
        height={40} 
        />
        </Link>
        </div>
      </div>
      
      {/* Middle (centered) */}
      <div className="flex flex-grow justify-left ml-20 text-xl">
        <div className="flex-shrink-0 flex items-center space-x-4">
          <div className="relative group">
            <Link href="#" className="text-white py-2 hover:text-gray-300 px-4 rounded">Components</Link>
            <div className="absolute hidden group-hover:block bg-white shadow-lg mt-1 rounded text-lg">
              <Link href="/component1" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Component 1</Link>
              <Link href="/component2" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Component 2</Link>
              <Link href="/component3" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Component 3</Link>
            </div>
          </div>
          <Link href="docs" className="text-white px-4 hover:text-gray-300">Docs</Link>
          <Link href="learn" className="text-white px-4 hover:text-gray-300">Learn</Link>
          <Link href="contact" className="text-white px-4 hover:text-gray-300">Contact</Link>
        </div>
      </div>
      
      {/* Right side (optional) */}
      <div className="flex items-center">
        <IsLoggedIn />
      </div>
    </div>
  </nav>
  </div>
    );
   }