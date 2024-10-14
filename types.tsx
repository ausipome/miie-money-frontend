// types.ts

export interface UserData {
    stripe_account_id: string;
    fullName: string;
    message: string;
    business_type: 'individual' | 'company' | 'non_profit';
    account: string; 
    logo_url: string;
    vatNumber: string;
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

export interface Error {
    message: string;
    // Add other fields as necessary
}

export type SetError = (error: Error | null) => void;
export type SetLoading = (loading: boolean) => void;

export interface UseCheckUserResult {
    userData: UserData | null;
    error: Error | null;
    loading: boolean;
    setLoading: SetLoading;
}