import { AuthProvider } from '../hooks/useAuth';
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Image from 'next/image';
import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Miie Money",
  description: "Get Paid Instantly, Invoice Customers Securely, and Manage Your Business Finances Online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
    <html lang="en">
      <body className={roboto.className}>
      <nav className="headerStyle p-4">
    <div className="w-full mx-auto flex justify-between items-center">
      {/* Left side */}
      <div className="flex items-center">
        <div className="flex-shrink-0">
        <Image src="/miie-money-side.png" 
        alt="Miie Money logo which is a pink and blue smile formed in the shape of an M" 
        width={200}
        height={50} 
        layout="fixed" />
        </div>
      </div>
      
      {/* Middle (centered) */}
      <div className="flex flex-grow justify-center">
        <div className="flex-shrink-0">
    
        </div>
      </div>
      
      {/* Right side (optional) */}
      <div className="flex items-center">
        {/* Your right side content here */}
      </div>
    </div>
  </nav>

        {children}
        </body>
    </html>
    </AuthProvider>
  );
}