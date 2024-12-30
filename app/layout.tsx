import { ReactNode } from 'react';
import { AuthProvider } from '../hooks/useAuth';
import {NextUIProvider} from "@nextui-org/system";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import NavProgressBar from '@/components/navigation/ProgressBar';
import CookieConsent from '@/components/public/cookieConsent';
import TopNav from '@/components/navigation/TopNav';
config.autoAddCss = false

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Get Paid On The Web",
  description: "Get Paid Instantly, Invoice Customers Securely, and Manage Your Business Finances Online.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    
    <AuthProvider>
    <html lang="en">
      <body className={roboto.className}>
      <NextUIProvider>
        <TopNav />
        <NavProgressBar />
        {children}
        <CookieConsent />
        </NextUIProvider>
        </body>
    </html>
    </AuthProvider>
  
  );
}