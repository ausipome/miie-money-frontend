// types.ts

export interface UserData {
    stripe_account_id: string;
    fullName: string;
    message: string;
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