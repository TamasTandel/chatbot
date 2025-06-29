// frontend/src/components/layout/Navbar.jsx
'use client';

import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path as needed

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl text-indigo-400 hover:text-indigo-300">
              AZ-Books
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                {/* Add other public links like Products, About, Contact here */}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-300 text-sm mr-3">
                    Hello, {user?.firstName || user?.email}
                  </span>
                  <Link href="/profile" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="ml-4 text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </Link>
                  <Link href="/register" className="ml-4 text-gray-300 bg-indigo-600 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
          {/* Mobile menu button (can be implemented later) */}
          <div className="-mr-2 flex md:hidden">
            <button type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed. */}
              {/* Heroicon name: outline/menu */}
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open. */}
              {/* Heroicon name: outline/x */}
              <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state (can be implemented later with useState) */}
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Home
          </Link>
          {/* Add other mobile links here */}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          {isAuthenticated ? (
            <>
              <div className="flex items-center px-5">
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">{user?.firstName || user?.email}</div>
                  <div className="text-sm font-medium leading-none text-gray-400">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
                  Your Profile
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="px-2 space-y-1">
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
                    Login
                </Link>
                <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
                    Register
                </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
