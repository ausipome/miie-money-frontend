'use client'

import Link from 'next/link';
import React, { useState } from 'react';
import useForm from '../../hooks/useForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons'


export default function MiieLogin() {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const { values, handleChange } = useForm({
        email: '',
        password: '',
      });
    
      // Handle login which returns a Json Web Token if successful
      const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          const response = await fetch('/login-endpoint', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
            credentials: 'include',
          });
          if (response.ok) {
            console.log('Logged in successfully');
          } else {
            setError(response.statusText);
            console.error('Form submission error:', response.statusText);
          }
        } catch (error) {
          setError('Network error');
          console.error('Form submission error:', error);
        }
      };

        return (

            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-slate-300">Login</h2>
            <form onSubmit={handleLogin} className="max-w-md mx-auto">
                <div className="mb-4 text-center">

                <div className='text-left'>
                <label htmlFor="email" className="block text-gray-900 text-sm">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
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
                    {passwordVisible ? <FontAwesomeIcon icon={byPrefixAndName.fal['eye-slash']} /> : <FontAwesomeIcon icon={byPrefixAndName.fal['eye']} /> }
                </span>
                </div>
                </div>

                <button type="submit" className="stdButton">Login</button>
                <p className="text-red-500">{error}</p>
                <Link href="/forgotpassword"><h3 className='text-center my-6'>Forgot your Password?</h3></Link>
            <h3 className='text-center my-6 text-[#5752FC]'><span className='text-slate-400'>Don't have an account? </span><Link href="/signup">Sign up here!</Link></h3>
            </div>
            </form>
            </div>
        )

}

    