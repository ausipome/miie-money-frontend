// types.ts

export interface UserData {
    stripe_account_id: string;
    fullName: string;
    message: string;
    business_type: 'individual' | 'company' | 'non_profit';
    account: string; 
    logo_url: string;
    taxNumber: string;
    application_fee: number;
    taxRate: number;
}

export interface AccountInfo {
    first_name?: string;
    last_name?: string;
    address?: {
      line1: string;
      city: string;
      postal_code: string;
    };
    name?: string;
  }

  
export interface Contact {
  customerId: string;
  company: string;
  fullName: string;
  address: string;
  townCity: string;
  countyState: string;
  postcodeZip: string;
  email: string;
  phone: string;
}

export interface Error {
    message: string;
}

export type SetError = (error: Error | null) => void;
export type SetLoading = (loading: boolean) => void;

export interface UseCheckUserResult {
    userData: UserData | null;
    error: Error | null;
    loading: boolean;
    setLoading: SetLoading;
}

export interface InvoiceBuilderProps {
  customer?: Contact;
  invoiceData?: Invoice;
  backButton?: React.ReactNode;
  onNewInvoice: () => void;
  onHomeClick: () => void;
}

export interface Invoice {
  customer: any;
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: string;
  receiptDate: string;
  status: "paid" | "unpaid";
  total: number;
  taxNumber: string;
  taxRate: number;
  items: InvoiceItem[];
  logoUrl: string;
  vatAmount: number;
  countryCode: string;
  applicationFee: number;
  accountId: string;
  paymentIntent: string;
  manualVat: boolean;
  creationDate: string;
  }

  export interface InvoiceItem {
    itemName: string;
    quantity: string | number;
    cost: string | number;
}
export interface PaymentLink {
  linkId: string; 
  linkUrl: string; 
  description: string; 
  amount: number; 
  customerName: string; 
  customerId?: string; 
  status: 'paid' | 'unpaid'; 
  createdDate: string; 
  expirationDate?: string; 
  taxNumber: string;
  taxRate: number;
  logoUrl: string;
  subtotal: number;
  total: number;
  customer: any;
  url: string;
  countryCode: string;
  applicationFee: number;
  creationDate: string;
  vatAmount: number;
  receiptDate: string;
  email: string;
  paymentIntent: string;
  manualVat: boolean;
}

export interface Payment {
  receiptDate: string;
  total: number;
  customer?: {
    company: string;
    fullName: string;
  };
}

export interface Payout {
  description: string;
  amount: number;
  created: number;
  arrivalDate: number;
  status: string;
}

export type LocationResponse = {
  location: string;
  country: string;
};
 