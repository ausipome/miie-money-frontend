'use client'

import Link from 'next/link';
import React, { useState } from 'react';
import useForm from '../../hooks/useForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';

export default function MiieSignupForm() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [submitError, setSubmitError] = useState<string>('');

    const { values, handleChange } = useForm({
        fullName: '',
        email: '',
        password: '',
    });

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const validatePassword = (password: string): string => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
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

    const validateEmail = (email: string): string => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Invalid email address.';
        }
        return '';
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        handleChange(e);
        const validationError = validateEmail(newEmail);
        setEmailError(validationError);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        handleChange(e);
        const validationError = validatePassword(newPassword);
        setPasswordError(validationError);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError('');
        const passwordValidationError = validatePassword(values.password);
        const emailValidationError = validateEmail(values.email);
        if (passwordValidationError || emailValidationError) {
            setPasswordError(passwordValidationError);
            setEmailError(emailValidationError);
            return;
        }
        try {
            const response = await fetch('signup-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                console.log('Form submitted successfully');
                console.log(response);
            } else {
                response.json().then(data => {
                    setSubmitError(data.error);
                }).catch(() => {
                    setSubmitError(response.statusText);
                });
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-slate-300">Sign Up</h2>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="text-center">
                    <div className='text-left'>
                        <label htmlFor="fullName" className="block text-gray-900 text-sm">Full Name</label>
                        <div className="mb-4">
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder='Full Name'
                            value={values.fullName}
                            onChange={handleChange}
                            className="stdInput"
                            required
                        />
                        </div>

                        <label htmlFor="email" className="block text-gray-900 text-sm">Email</label>
                        <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder='Email'
                            value={values.email}
                            onChange={handleEmailChange}
                            className="stdInput"
                            required
                        />
                        {emailError && <div style={{ color: 'red' }}>{emailError}</div>}
                        </div>

                        <label htmlFor="password" className="block text-gray-900 text-sm">Password</label>
                        <div className="password-container">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder='Password'
                                value={values.password}
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

                    <h3 className='text-center my-6 text-[#5752FC] mt-4'><span className='text-slate-400'>Already have an account? </span><Link href="/login">Login in here!</Link></h3>
                    <button type="submit" className="stdButton">Sign Up</button>
                    {submitError && <div style={{ color: 'red' }}>{submitError}</div>}
                </div>
            </form>
        </div>
    );
}
