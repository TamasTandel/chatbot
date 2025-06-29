// frontend/src/app/(auth)/register/page.js
'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext'; // Adjusted path
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '../../../components/ui/Input'; // Adjusted path
import Button from '../../../components/ui/Button'; // Adjusted path

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pageError, setPageError] = useState(''); // For form-level errors like password mismatch

  const { register, error: authError, loading, setError: setAuthError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPageError('');
    setAuthError(null); // Clear previous auth errors

    if (password !== confirmPassword) {
      setPageError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setPageError('Password must be at least 6 characters long.');
      return;
    }

    const success = await register({ email, password, firstName, lastName });
    // On successful registration, AuthContext's register function redirects to login.
    // No explicit router.push needed here if AuthContext handles it.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {pageError && <p className="text-sm text-red-600 dark:text-red-400 text-center">{pageError}</p>}
          {authError && <p className="text-sm text-red-600 dark:text-red-400 text-center">{authError}</p>}

          {/* Input fields will use their default rounded-md styling from Input.jsx */}
          {/* The parent div with -space-y-px will stack them closely. */}
          <div className="rounded-md shadow-sm -space-y-px"> {/* This div helps manage borders for grouped inputs */}
            <div>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                // className="rounded-t-md" // Removed: rely on Input's own styling or more advanced Tailwind
              />
            </div>
            <div>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                // className="rounded-b-md" // Removed
              />
            </div>
          </div>

          <div>
            <Button type="submit" disabled={loading} className="group relative">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
