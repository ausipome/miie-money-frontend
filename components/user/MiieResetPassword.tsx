'use client';

import React, { useState, useEffect } from 'react';
import useForm from '../../hooks/useForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';

export default function MiieResetPassword() {
    const [authToken, setAuthToken] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
          setAuthToken(token);
          console.log("Token from URL:", token);
        }
      }, [token]);

      export const getServerSideProps = async (context) => {
        const { token } = context.query;
        return {
          props: {
            token: token || '',
          },
        };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const { values, handleChange } = useForm({
        email: '',
        newPassword: '',
        token: authToken,
    });

    const handleReset = async (e: any) => {
        e.preventDefault();
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
            } else {
                setError('Error changing password');
            }
        } catch (error) {
            setError('Error changing password');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-slate-300">Login</h2>
            <form onSubmit={handleReset} className="max-w-md mx-auto">
                <div className="mb-4 text-center">
                    <div className="text-left">
                        <label htmlFor="email" className="block text-gray-900 text-sm">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={values.email}
                            onChange={handleChange}
                            className="stdInput mb-4"
                            required
                        />

                        <label htmlFor="newPassword" className="block text-gray-900 text-sm">New Password</label>
                        <div className="password-container mb-4">
                            <input
                                type={passwordVisible ? 'text' : 'newPassword'}
                                id="newPassword"
                                name="newPassword"
                                placeholder="newPassword"
                                value={values.newPassword}
                                onChange={handleChange}
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
                        
                    </div>
                    <button type="submit" className="stdButton">Reset Password</button>
                    <p className="text-red-500">{error}</p>
                </div>
            </form>
        </div>
    );
}
