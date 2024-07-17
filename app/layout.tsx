import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Image from 'next/image';
import './globals.css';

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
    <html lang="en">
      <body className={roboto.className}>
      <header className="headerStyle border-slate-400 border-b-1 border-solid">
      <div className="ml-4">
        <Image src="/icon_01_background.png" alt="Miie Money logo which is a pink and blue smile formed in the shape of an M" width={60} height={60} />
      </div>
    </header>
        {children}
        </body>
    </html>
  );
}