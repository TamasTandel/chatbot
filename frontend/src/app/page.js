// frontend/src/app/page.js
'use client';

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext"; // Adjust path as needed

export default function Home() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 sm:p-24 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
      <div className="text-center">
        {/* You can replace this with an AZ-Books specific logo later */}
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert mx-auto mb-8"
          src="/next.svg"
          alt="AZ-Books Logo Placeholder"
          width={180}
          height={37}
          priority
        />
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Welcome to AZ-Books
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-10">
          Your ultimate destination for all stationary items.
        </p>

        {isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-xl">
              Hello, {user?.firstName || user?.email}!
            </p>
            <Link href="/profile" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition duration-150 ease-in-out">
                View Your Profile
            </Link>
            {/* Add link to browse products, view orders etc. */}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 justify-center">
            <Link href="/login" className="w-full sm:w-auto inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-md transition duration-150 ease-in-out">
                Login
            </Link>
            <Link href="/register" className="w-full sm:w-auto inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-md transition duration-150 ease-in-out">
                Register
            </Link>
          </div>
        )}
      </div>

      {/* Placeholder for featured products or categories later */}
      <div className="mt-16 text-center w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Explore Our Range</h2>
        <p className="text-gray-600 dark:text-gray-400">
          (Product listings will appear here soon!)
        </p>
        {/* Example links to categories or special offers could go here */}
      </div>
    </main>
  );
}
