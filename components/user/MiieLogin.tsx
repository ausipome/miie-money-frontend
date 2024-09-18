// components/MiieLogin.tsx

'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import useForm from '../../hooks/useForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';
import { useAuth } from '../../hooks/useAuth';

export default function MiieLogin() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { values, handleChange } = useForm({
        email: '',
        password: '',
    });
    const { login, logout, submitError, setSubmitError } = useAuth();

    useEffect(() => {
        logout();
    },[]);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');
        try {
          await login(values.email, values.password);
          console.log('Logged in successfully');
        } catch (error: any) {
            
        }
      };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-slate-300">Login</h2>
            <form onSubmit={handleLogin} className="max-w-md mx-auto">
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
                        <label htmlFor="password" className="block text-gray-900 text-sm">Password</label>
                        <div className="password-container mb-4">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Password"
                                value={values.password}
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
                    <button type="submit" className="stdButton">Login</button>
                    {submitError && <div style={{ color: 'red' }}>{submitError}</div>}
                    <Link href="/forgotpassword"><h3 className="text-center my-6">Forgot your Password?</h3></Link>
                    <h3 className="text-center my-6 text-[#5752FC]"><span className="text-slate-400">Don't have an account? </span><Link href="/signup">Sign up here!</Link></h3>
                </div>
            </form>
        </div>
    );
}
