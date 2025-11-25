// src/components/auth/LoginForm.tsx

import React, { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoginPayload } from '../../types'; // Import LoginPayload type

interface LoginFormProps {
  onToggleForm: () => void; // Function to switch between Login and Signup forms
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  // State for form inputs, matches LoginPayload structure
  const [formData, setFormData] = useState<LoginPayload>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [error, setError] = useState(''); // State for displaying login errors
  const { login, loading } = useAuth(); // Get login function and loading state from AuthContext

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default page reload
    setError(''); // Clear previous errors before attempting login

    // Basic frontend validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      // Call the login function from AuthContext, passing the form data object
      await login(formData);
      // Successful login is handled by AuthContext updating state and App routing logic

    } catch (err: any) { // Catch errors from the login function
      console.error("Login component error:", err);
      // Extract specific error message from backend if available, otherwise show generic message
      const message = err.response?.data?.message || err.message || 'Invalid email or password.';
      setError(message);
    }
  };

  // Update form state when user types in an input field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value, // Update the field corresponding to the input's name
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Display Area */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm" role="alert">
            {error}
          </div>
        )}

        {/* Email Input Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative rounded-md shadow-sm">
            {/* Email Icon */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="text-gray-400 w-5 h-5" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
              autoComplete="email" // Helps browsers autofill
            />
          </div>
        </div>

        {/* Password Input Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative rounded-md shadow-sm">
            {/* Lock Icon */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-gray-400 w-5 h-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'} // Toggle input type based on state
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
              autoComplete="current-password" // Helps browsers autofill
            />
            {/* Show/Hide Password Toggle Button */}
            <button
              type="button" // Important: type="button" prevents form submission
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'} // Accessibility label
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex items-center justify-end"> {/* Aligns the link to the right */}
          <div className="text-sm">
            <button
              type="button" // Important: type="button"
              onClick={() => {
                // TODO: Implement actual forgot password logic later
                console.log('Forgot Password clicked - Placeholder');
                alert('Forgot Password functionality is not yet implemented.');
              }}
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading} // Disable button when login is in progress
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition duration-150 ease-in-out"
        >
          {loading ? (
            // Simple loading spinner
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            // Button content when not loading
            <>
              <LogIn className="w-5 h-5" />
              Sign In
            </>
          )}
        </button>
      </form>

      {/* Link to Toggle Signup Form */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onToggleForm} // Calls the function passed from parent to switch forms
            className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;