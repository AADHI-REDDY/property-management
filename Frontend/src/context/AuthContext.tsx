// src/context/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, LoginPayload, SignupPayload, LoginResponse } from '../types'; // Import correct types
// Import the API functions defined in api.ts
import { apiLogin, apiRegisterUser, apiGetCurrentUser, apiClient } from '../services/api';

// Define the shape/type of the context value
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean; // Indicates if auth state is being determined
  error: string | null;
  isAuthenticated: boolean; // Derived state: true if user & token exist
  login: (credentials: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>; // Expects SignupPayload
  logout: () => void;
  fetchUser: () => Promise<void>; // Function to explicitly refresh user data
}

// Create the context with default/initial values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true, // Start in loading state until token check is complete
  error: null,
  isAuthenticated: false,
  // Provide dummy async functions for defaults to match type
  login: async () => { console.warn("Login function called before AuthProvider mounted"); },
  signup: async () => { console.warn("Signup function called before AuthProvider mounted"); },
  logout: () => { console.warn("Logout function called before AuthProvider mounted"); },
  fetchUser: async () => { console.warn("FetchUser function called before AuthProvider mounted"); },
});

// Auth Provider Component - Wraps your application
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // Initialize token from localStorage
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState<boolean>(true); // Start loading
  const [error, setError] = useState<string | null>(null);

  // Effect runs once on mount to check initial token validity
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        // Set token in axios headers immediately if it exists
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await fetchUser(); // Attempt to fetch user data
      } else {
        setLoading(false); // No token found, stop loading
      }
    };
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to fetch user details (e.g., after login or on refresh)
  const fetchUser = async () => {
    // Avoid fetching if already loading to prevent race conditions
    if (loading && user) return; // Already loading or user exists
    
    // Only set loading if not already loading during initial check
    if (!loading) setLoading(true); 
    setError(null);
    try {
      // apiGetCurrentUser should return the User object directly
      const fetchedUser: User = await apiGetCurrentUser();
      setUser(fetchedUser);
    } catch (err) {
      console.error("Failed to fetch current user (token might be invalid):", err);
      // If fetching user fails (e.g., invalid token), log out
      logout();
      // Optionally set an error, but logout usually handles the state change
      // setError("Session expired or invalid.");
    } finally {
      setLoading(false); // Always stop loading after attempt
    }
  };


  // Login Function
  const login = async (credentials: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      // apiLogin returns LoginResponse { token: string; user: User }
      const response: LoginResponse = await apiLogin(credentials);

      const receivedToken = response.token;
      const loggedInUser = response.user;

      if (!receivedToken || !loggedInUser) {
        throw new Error("Invalid login response structure from API");
      }

      // Store token
      localStorage.setItem('authToken', receivedToken);
      // Set Authorization header for future requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;

      // Update state
      setToken(receivedToken);
      setUser(loggedInUser);

    } catch (err: any) { // Catch as 'any' or 'unknown' for better error handling
      console.error("AuthContext login failed:", err);
      const message = err.response?.data?.message || err.message || "Login failed. Check credentials.";
      setError(message);
      throw err; // Re-throw so the calling component (form) knows it failed
    } finally {
      setLoading(false);
    }
  };

  // Signup Function - Expects SignupPayload
  const signup = async (payload: SignupPayload) => {
    setLoading(true);
    setError(null);
    try {
      // apiRegisterUser expects SignupPayload and should return the created User
      const createdUser: User = await apiRegisterUser(payload);

      console.log("Signup successful:", createdUser);
      // After signup, you might want to automatically log the user in
      // or redirect them to the login page with a success message.
      // For now, it just logs success.

    } catch (err: any) { // Catch as 'any' or 'unknown'
      console.error("AuthContext signup failed:", err);
       const message = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
      setError(message);
      throw err; // Re-throw for the form
    } finally {
      setLoading(false);
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization']; // Remove auth header
    setToken(null);
    setUser(null);
    setError(null); // Clear any previous errors
    // Optionally navigate to login page using react-router-dom if needed elsewhere
    // navigate('/login');
  };

  // --- Provide the context value ---
  // Calculate isAuthenticated based on current state
  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
    fetchUser
  };

  // Render provider with calculated value, only rendering children when not initially loading
  // or provide loading state down if children need to handle it
  return (
      <AuthContext.Provider value={value}>
        {/* You might want a global loading spinner here based on 'loading' state */}
        {children}
      </AuthContext.Provider>
  );
};

// --- Custom hook to easily use the Auth context ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This error means you're trying to useAuth outside of an AuthProvider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};