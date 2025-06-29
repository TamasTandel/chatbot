// frontend/src/app/(auth)/login/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext'; // Adjusted path
import { useRouter, useSearchParams } from 'next/navigation'; // Corrected import
import Link from 'next/link';
import Input from '../../../components/ui/Input'; // Adjusted path
import Button from '../../../components/ui/Button'; // Adjusted path

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // For messages like 'Registration successful'

  const { login, error: authError, loading, isAuthenticated, setError: setAuthError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams(); // To get query params

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/'); // Redirect if already logged in
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Check for registration success message
    if (searchParams.get('registered') === 'true') {
      setMessage('Registration successful! Please sign in.');
      // Optional: remove the query param from URL without reload
      // router.replace('/login', { scroll: false }); // next/navigation doesn't have replace like this.
      // window.history.replaceState(null, '', '/login'); // This works but is a direct DOM manipulation
    }
  }, [searchParams, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null); // Clear previous auth errors
    setMessage(''); // Clear previous messages

    const success = await login(email, password);
    if (success) {
      // AuthContext's login function handles navigation on success
      // router.push('/'); // No need to push here, AuthContext handles it
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && <p className="text-sm text-green-600 dark:text-green-400 text-center">{message}</p>}
          {authError && <p className="text-sm text-red-600 dark:text-red-400 text-center">{authError}</p>}

          <div className="rounded-md shadow-sm -space-y-px">
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
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label> */}
            </div>

            <div className="text-sm">
              {/* <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Forgot your password?
              </a> */}
            </div>
          </div>

          <div>
            <Button type="submit" disabled={loading} className="group relative">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
