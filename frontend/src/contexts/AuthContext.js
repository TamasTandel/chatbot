// frontend/src/contexts/AuthContext.js
'use client'; // This directive is necessary for Context API with App Router

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import for App Router
import { loginUser as apiLogin, registerUser as apiRegister, fetchUserProfile } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // For initial auth state check
  const [error, setError] = useState(null); // For login/register errors
  const router = useRouter();

  useEffect(() => {
    // Try to load token and user from localStorage on initial mount
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Optionally, re-fetch user profile here to ensure data is fresh
        // fetchUserProfile(storedToken).then(data => setUser(data.user)).catch(() => logout());
      } catch (e) {
        // Handle error if JSON parsing fails (e.g. corrupted data)
        console.error("Error parsing stored user data:", e);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin({ email, password });
      if (data.access_token && data.user) {
        setToken(data.access_token);
        setUser(data.user);
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('authUser', JSON.stringify(data.user)); // Store user object
        router.push('/'); // Redirect to home or dashboard after login
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.data?.msg || err.error || 'Login failed. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRegister(userData);
      if (data.user && data.msg === "User registered successfully") {
        // Optionally, log the user in directly after registration
        // For now, redirect to login page with a success message
        router.push('/login?registered=true'); // Or handle success message display
        return true;
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.data?.msg || err.error || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    router.push('/login'); // Redirect to login page after logout
    // If using a token blacklist on the backend, call a logout endpoint here
  };

  const refreshUserProfile = async () => {
    if (token) {
      try {
        const data = await fetchUserProfile(token);
        setUser(data.user);
        localStorage.setItem('authUser', JSON.stringify(data.user));
      } catch (err) {
        console.error("Failed to refresh user profile", err);
        // Potentially logout if token is invalid (e.g., 401 error)
        if (err.status === 401) {
          logout();
        }
      }
    }
  };


  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    loading, // Expose loading state for UI feedback
    error,   // Expose error state for UI feedback
    setError, // Allow components to clear errors
    refreshUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) { // Check for null as well, as initial value is null
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
