// types.ts

export interface UserData {
    id: string;
    name: string;
    email: string;
    message: string;
}

export type Loading = boolean;

export interface Error {
    message: string;
    // Add other fields as necessary
}

export type SetError = (error: Error | null) => void;
export type SetLoading = (loading: boolean) => void;

export interface UseCheckUserResult {
    userData: UserData | null;
    loading: Loading;
    error: Error | null;
    setError: SetError;
    setLoading: SetLoading;
}