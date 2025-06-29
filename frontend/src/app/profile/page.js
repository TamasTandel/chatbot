// frontend/src/app/profile/page.js
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { fetchUserProfile } from '../../services/api'; // Direct import for this page

export default function ProfilePage() {
  const { user, token, isAuthenticated, loading: authLoading, logout, refreshUserProfile } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadProfile = async () => {
      if (isAuthenticated && token) {
        setIsLoading(true);
        setError(null);
        try {
          // Prefer user data from AuthContext if fresh, or re-fetch
          // The fetchUserProfile in AuthContext (refreshUserProfile) updates the context's user state.
          // Here, we can either rely on the context's user or fetch specifically for this page.
          // Let's use a specific fetch for this page to demonstrate, or just use context user.

          // Option 1: Use user from context (might not be the absolute latest from DB unless refreshed)
          // setProfileData(user);
          // setIsLoading(false);

          // Option 2: Fetch fresh profile data for this page load
          const data = await fetchUserProfile(token);
          setProfileData(data.user);

        } catch (err) {
          console.error("Error fetching profile:", err);
          setError(err.data?.msg || err.error || "Failed to load profile.");
          if (err.status === 401) { // Token might be invalid/expired
            logout(); // Log out user if token is bad
          }
        } finally {
          setIsLoading(false);
        }
      } else if (!authLoading && !isAuthenticated) {
         // Handled by the first useEffect, but good to be defensive
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, token, authLoading, logout]); // Depend on token as well

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300">Loading profile...</p>
      </div>
    );
  }

  if (!isAuthenticated || !profileData) {
    // This state might be brief due to redirects, or if data fetching failed before redirect
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-700 dark:text-gray-300">Redirecting to login...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <p className="text-red-500 dark:text-red-400 mb-4">Error: {error}</p>
            <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
                Go to Homepage
            </button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">User Profile</h1>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</p>
            <p className="text-lg text-gray-900 dark:text-white">{profileData.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name:</p>
            <p className="text-lg text-gray-900 dark:text-white">{profileData.firstName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name:</p>
            <p className="text-lg text-gray-900 dark:text-white">{profileData.lastName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Role:</p>
            <p className="text-lg text-gray-900 dark:text-white">{profileData.role}</p>
          </div>
          {profileData.usr_id && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID (USR):</p>
              <p className="text-lg text-gray-900 dark:text-white">{profileData.usr_id}</p>
            </div>
          )}
          {profileData.cst_id && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer ID (CST):</p>
              <p className="text-lg text-gray-900 dark:text-white">{profileData.cst_id}</p>
            </div>
          )}
          {profileData.vnd_id && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vendor ID (VND):</p>
              <p className="text-lg text-gray-900 dark:text-white">{profileData.vnd_id}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined:</p>
            <p className="text-lg text-gray-900 dark:text-white">{new Date(profileData.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="mt-8">
            <button
                onClick={refreshUserProfile}
                className="mr-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isLoading}
            >
                {isLoading ? 'Refreshing...' : 'Refresh Profile'}
            </button>
            <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Logout
            </button>
        </div>
      </div>
    </div>
  );
}
