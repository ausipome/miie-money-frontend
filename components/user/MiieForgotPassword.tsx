'use client';

import React, { useState } from 'react';
import useForm from '../../hooks/useForm';


export default function MiieForgotPassword() {
    const [error, setError] = useState('');
    const { values, handleChange } = useForm({
        email: '',
    });

    const handleForgot = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch('/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (res.ok) {
                setError('Password reset email sent');
            } else {
                setError('Invalid email');
            }
        } catch (error) {
            setError('Invalid email');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-slate-300">Request Reset</h2>
            <form onSubmit={handleForgot} className="max-w-md mx-auto">
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
                        
                    </div>
                    <button type="submit" className="stdButton">Request Reset Token</button>
                    <p className="text-red-500">{error}</p>
                </div>
            </form>
        </div>
    );
}