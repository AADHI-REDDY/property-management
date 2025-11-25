// src/components/tenants/AddTenantModal.tsx

import React, { useState } from 'react';
// Import the specific API function needed
import { createTenant } from '../../services/api';
// Import the payload type
import { CreateTenantRequest } from '../../types';

// Define the props the modal expects
interface AddTenantModalProps {
  isOpen: boolean; // Controls visibility
  onClose: () => void; // Function to close the modal
  onTenantCreated: () => void; // Callback after successful creation (to refresh list)
}

export const AddTenantModal: React.FC<AddTenantModalProps> = ({ isOpen, onClose, onTenantCreated }) => {
  // State for form data, matches CreateTenantRequest type
  const [formData, setFormData] = useState<CreateTenantRequest>({
    name: '',
    email: '',
    phone: '', // Use 'phone' consistent with the type
    password: '',
  });
  const [loading, setLoading] = useState(false); // Loading state for submission
  const [error, setError] = useState<string | null>(null);

  // Don't render anything if the modal isn't open
  if (!isOpen) return null;

  // Handle changes in form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Clear previous errors
    setLoading(true); // Set loading state

    // Basic frontend validation (add more as needed)
    if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
    }

    try {
      // Call the API function (imported as createTenant)
      await createTenant(formData);
      onTenantCreated(); // Call the success callback (e.g., refresh tenant list)
      onClose(); // Close the modal
      // Reset form for next time (optional)
      setFormData({ name: '', email: '', phone: '', password: '' });
    } catch (err: any) { // Catch as 'any' for easier error message access
      console.error("Failed to create tenant:", err);
      // Try to get specific backend error message, otherwise show generic one
      const message = err.response?.data?.message || err.message || 'Failed to create tenant. Please try again.';
      setError(message);
    } finally {
      setLoading(false); // Ensure loading state is turned off
    }
  };

  // --- JSX for the Modal ---
  return (
    // Modal backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose} // Close modal if backdrop is clicked
    >
      {/* Modal Content - stopPropagation prevents clicks inside closing the modal */}
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Add New Tenant</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display API error */}
          {error && <p className="text-red-600 bg-red-100 p-3 rounded-md text-sm mb-4">{error}</p>}

          {/* Form Fields - Add appropriate styling (e.g., Tailwind) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
            <input
              type="text"
              name="phone" // Name matches state and type
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
              minLength={6} // Add minLength validation
            />
             <p className="text-xs text-gray-500 mt-1">Min 6 characters. Tenant can change later.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Tenant'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Optional: export default AddTenantModal;