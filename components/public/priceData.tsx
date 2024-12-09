type PricingCategory = {
    description: string;
    rate: string;
  };

export type PricingData = {
    [key: string]: {
      [category: string]: PricingCategory[];
    };
  };

export const pricingData: PricingData = {
    UK: {
      "Credit and Debit Cards": [
        { description: "Standard UK cards", rate: "2.5% + 20p" },
        { description: "Premium UK cards", rate: "2.9% + 20p" },
      ],
      "International Card Payments": [
        { description: "EEA cards", rate: "3.5% + 20p" },
        { description: "Currency conversion", rate: "+ 2%" },
        { description: "International cards", rate: "4.25% + 20p" },
      ],
      Link: [
        { description: "UK cards", rate: "2.2% + 20p" },
        { description: "Other cards", rate: "Regular pricing applies" },
      ],
      "3D Secure Authentication": [
        { description: "Standard", rate: "Included" },
        { description: "Custom pricing", rate: "3p per attempt" },
      ],
      "Local Payment Methods": [
        { description: "Bacs Direct Debit", rate: "1.5% (min 20p, £8.00 cap)" },
      ],
      "Buy Now Pay Later": [
        { description: "Klarna", rate: "Starting at 4.99% + 35p" },
      ],
    },
    US: {
      "Cards and Wallets": [
        { description: "Domestic cards", rate: "3.9% + 30¢" },
        { description: "Manually entered cards", rate: "+ 0.5%" },
        { description: "International cards", rate: "+ 1.5%" },
        { description: "Currency conversion", rate: "+ 1%" },
      ],
      Link: [
        { description: "Domestic cards", rate: "3.9% + 30¢" },
        { description: "Instant Bank Payments", rate: "3.6% + 30¢" },
      ],
      "Bank Debits and Transfers": [
        { description: "ACH Direct Debit", rate: "1.3% (max $10.00 cap)" },
      ],
      "International Payment Methods": [
        { description: "iDEAL", rate: "Starting at 80¢" },
      ],
      "Buy Now Pay Later": [
        { description: "Klarna", rate: "Starting at 5.99% + 30¢" },
      ],
      "3D Secure Authentication": [
        { description: "Standard", rate: "Included" },
        { description: "Custom pricing", rate: "3¢ per attempt" },
      ],
      "Instant Payouts": [
        { description: "Instant payouts volume", rate: "1.5% (min 50¢)" },
      ],
      Disputes: [
        { description: "Chargeback dispute", rate: "$15.00 per dispute" },
      ],
    },
    CA: {
      "Cards and Wallets": [
        { description: "Domestic cards", rate: "3.9% + C$0.30" },
        { description: "Manually entered cards", rate: "+ 0.5%" },
        { description: "International cards", rate: "+ 0.8%" },
        { description: "Currency conversion", rate: "+ 2%" },
      ],
      "Bank Debits and Transfers": [
        { description: "Pre-authorized debits", rate: "1.5% + C$0.40 (C$10.00 cap)" },
        { description: "Instant verification", rate: "+ C$2.00" },
        { description: "Failures and disputes", rate: "C$10.00" },
      ],
      "International Payment Methods": [
        { description: "iDEAL", rate: "Starting at C$0.80" },
      ],
      "Buy Now Pay Later": [
        { description: "Klarna", rate: "Starting at 5.99% + C$0.30" },
      ],
      "3D Secure Authentication": [
        { description: "Standard", rate: "Included" },
        { description: "Custom pricing", rate: "C$0.04 per attempt" },
      ],
      "Instant Payouts": [
        { description: "Instant payouts volume", rate: "1% (min C$0.60)" },
      ],
      Disputes: [
        { description: "Chargeback dispute", rate: "C$15.00 per dispute" },
      ],
    },
    AU: {
      "Cards and Wallets": [
        { description: "Domestic cards", rate: "2.7% + A$0.30" },
        { description: "International cards", rate: "4.5% + A$0.30" },
        { description: "Currency conversion", rate: "+ 2%" },
      ],
      "Bank Debits and Transfers": [
        { description: "BECS Direct Debit", rate: "1.5% + A$0.30 (A$7 cap)" },
        { description: "Failures and disputes", rate: "A$2.50" },
      ],
      "International Payment Methods": [
        { description: "iDEAL", rate: "Starting at A$0.80" },
      ],
      "Buy Now Pay Later": [
        { description: "Zip", rate: "Starting at 5.49% + A$0.30" },
      ],
      "Multi-currency Settlement": [
        { description: "Pay out in additional currencies", rate: "1% or A$4.00 cap" },
      ],
      "3D Secure Authentication": [
        { description: "Standard", rate: "Included" },
        { description: "Custom pricing", rate: "A$0.04 per attempt" },
      ],
      Disputes: [
        { description: "Chargeback dispute", rate: "A$25.00 per dispute" },
      ],
    },
    NZ: {
      "Cards and Wallets": [
        { description: "Domestic cards", rate: "3.7% + NZ$0.30" },
        { description: "International cards", rate: "4.7% + NZ$0.30" },
        { description: "Currency conversion", rate: "+ 2%" },
      ],
      "International Payment Methods": [
        { description: "iDEAL", rate: "Starting at NZ$0.80" },
      ],
      "Buy Now Pay Later": [
        { description: "Klarna", rate: "Starting at 4.99% + NZ$0.65" },
      ],
      "3D Secure Authentication": [
        { description: "Standard", rate: "Included" },
        { description: "Custom pricing", rate: "NZ$0.04 per attempt" },
      ],
      Disputes: [
        { description: "Chargeback dispute", rate: "NZ$25.00 per dispute" },
      ],
    },
  };
  