'use client'

import Link from 'next/link';
import React, { useState } from 'react';
import useForm from '../../hooks/useForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons'
export default function MiieSignupForm() {

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const { values, handleChange } = useForm({
        fullName: '',
        email: '',
        password: '',
        country: '',
      });
    
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
            console.error('Form submission error:', response.statusText);
          }
        } catch (error) {
          console.error('Form submission error:', error);
        }
      };

        return (

            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-slate-300">Sign Up</h2>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-4 text-center">

                <div className='text-left'>

                <label htmlFor="fullName" className="block text-gray-900 text-sm">Full Name</label>
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

                <label htmlFor="country" className="block text-gray-900 text-sm">Country</label>
                <input
                    type="text"
                    id="country"
                    name="country"
                    value="United Kingdom"
                    disabled
                    className="stdInput"
                    required
                />

                <label htmlFor="email" className="block text-gray-900 text-sm">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder='Email'
                    value={values.email}
                    onChange={handleChange}
                    className="stdInput"
                    required
                />

                <label htmlFor="password" className="block text-gray-900 text-sm">Password</label>
                <div className="password-container">
                <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder='Password'
                    value={values.password}
                    onChange={handleChange}
                    className="stdInput password-input"
                    required
                />
                <span
                className="toggle-password"
                onClick={togglePasswordVisibility}
                >
                {passwordVisible ? <FontAwesomeIcon icon={byPrefixAndName.fal['eye-slash']} /> : <FontAwesomeIcon icon={byPrefixAndName.fal['eye']} /> }
                </span>
                </div>
                </div>

                <h3 className='text-center my-6 text-[#5752FC]'><span className='text-slate-400'>Already have an account? </span><Link href="/login">Login in here!</Link></h3>
                <button type="submit" className="stdButton">Sign Up</button>
            </div>
            </form>
            </div>
        )

}

    