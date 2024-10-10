import { ReactNode } from 'react';
import { AuthProvider } from '../hooks/useAuth';
import {NextUIProvider} from "@nextui-org/system";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import NavProgressBar from '@/components/navigation/ProgressBar';
config.autoAddCss = false

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Miie Money",
  description: "Get Paid Instantly, Invoice Customers Securely, and Manage Your Business Finances Online.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    
    <AuthProvider>
    <html lang="en">
      <body className={roboto.className}>
      <NextUIProvider>
        <NavProgressBar />
        {children}
        </NextUIProvider>
        </body>
    </html>
    </AuthProvider>
  
  );
}