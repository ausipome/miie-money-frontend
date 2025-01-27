'use client';

import React, { useState, useEffect } from 'react';
import useForm from '../../hooks/useForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {Spinner} from "@nextui-org/spinner";

export default function ResetPassword() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState<string>('');
    const [error, setError] = useState('');
    const searchParams = useSearchParams();
    const [authToken, setAuthToken] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState<boolean>(false);
    const [statusText, setStatusText] = useState<boolean>(false);

    const { values, handleChange, setValues } = useForm({
        newPassword: '',
        token: authToken,
        email: email,
    });

  useEffect(() => {
    const token = searchParams.get('token');
    const resetEmail = searchParams.get('email');
    if (token && resetEmail) {
      setAuthToken(token);
      setEmail(resetEmail);
      setValues((prevValues) => ({
        ...prevValues,
        token: authToken,
        email: email,
    }));
    }
  }, [searchParams,authToken, email, setValues]);


    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const validatePassword = (newPassword: string): string => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(newPassword);
        const hasLowerCase = /[a-z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

        if (newPassword.length < minLength) {
            return `Password must be at least ${minLength} characters long.`;
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter.';
        }
        if (!hasLowerCase) {
            return 'Password must contain at least one lowercase letter.';
        }
        if (!hasNumber) {
            return 'Password must contain at least one number.';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character.';
        }

        return '';
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checkPassword = e.target.value;
        handleChange(e);
        const validationError = validatePassword(checkPassword);
        setPasswordError(validationError);
    };

    const handleReset = async (e: any) => {
        setStatus(true);
        e.preventDefault();
        setError('');
        const passwordValidationError = validatePassword(String(values.newPassword) || '');
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            setStatus(false);
            return;
        }
        try {
            const res = await fetch('/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (res.ok) {
                setError('Password Changed');
                setStatusText(true);
                setStatus(false);
            } else {
                setError(res.statusText);
                setStatus(false);
            }
        } catch (error) {
            setError('Error changing password');
            setStatus(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-slate-300">Reset</h2>
            <form onSubmit={handleReset} className="max-w-md mx-auto">
                <div className="mb-4 text-center">
                    <div className="text-left">
                        <label htmlFor="newPassword" className="block text-gray-900 text-sm mb-2">Please set your new password</label>
                        <div className="password-container mb-4">
                            <input
                                type={passwordVisible ? 'text' : 'newPassword'}
                                id="newPassword"
                                name="newPassword"
                                placeholder="New Password"
                                value={values.newPassword}
                                onChange={handlePasswordChange}
                                className="stdInput password-input"
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={togglePasswordVisibility}
                            >
                                {passwordVisible ? <FontAwesomeIcon icon={byPrefixAndName.fal['eye-slash']} /> : <FontAwesomeIcon icon={byPrefixAndName.fal['eye']} />}
                            </span>
                        </div>
                        {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
                    </div>
                    <button
                    type="submit"
                    className={`mt-4 w-full p-2 text-white rounded ${
                        status ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={status}
                    >
                    {status ? "Please Wait..." : "Reset Password"} 
                    {status && <Spinner style={{ marginLeft: "4px", marginTop: "2px" }} color="warning" size="sm" />}
                    </button>
                    <p className="text-red-500">{error}</p>
                    {statusText && (<p className='text-center text-[#000000]'>You can now <Link className='text-[#2923dc]' href="/login">Login in</Link> with your new password</p>)}
                </div>
            </form>
        </div>
    );
}
