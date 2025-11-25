// src/components/tenants/TenantsManagement.tsx

import React, { useState, useEffect } from 'react';
import { User } from '../../types'; // Ensure User type uses roles: string[] and id: string
// Import your actual API service function
import { apiGetTenants } from '../../services/api'; // Assuming this function exists in api.ts
import { AddTenantModal } from './AddTenantModal'; // Import the modal

export const TenantsManagement: React.FC = () => {
  const [tenants, setTenants] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  // Function to fetch tenants from the API
  const fetchTenants = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the imported API function
      const data = await apiGetTenants(); // Assumes apiGetTenants returns Promise<User[]>
      setTenants(data);
    } catch (err: any) { // Catch as 'any'
      console.error("Failed to fetch tenants:", err);
      const message = err.response?.data?.message || err.message || "Could not load tenant data.";
      setError(message);
      setTenants([]); // Clear tenants on error
    } finally {
      setLoading(false);
    }
  };

  // Load tenants when the component mounts
  useEffect(() => {
    fetchTenants();
  }, []); // Empty array means run once on mount

  // Filter tenants based on search term (case-insensitive)
   const filteredTenants = tenants.filter(tenant =>
     (tenant.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
     (tenant.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
   );

  // Helper function to format role names for display
  const displayRoles = (roles: string[]): string => {
    if (!roles || roles.length === 0) return 'N/A';
    // Remove "ROLE_" prefix and capitalize first letter
    return roles
      .map(r => r.startsWith('ROLE_') ? r.substring(5) : r)
      .map(r => r.charAt(0).toUpperCase() + r.slice(1).toLowerCase())
      .join(', ');
  };

  // Helper function to format date strings safely
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      // Create Date object from ISO string and format it
      return new Date(dateString).toLocaleDateString(undefined, { // Use user's locale
          year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return 'Invalid Date';
    }
  };

  // --- JSX Rendering ---
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Tenant Management</h1>
        <button
          onClick={() => setIsModalOpen(true)} // Open the AddTenantModal
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
        >
          {/* Optional: Add an icon like UserPlus */}
          + Add Tenant
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Loading State Indicator */}
      {loading && (
          <div className="text-center py-10">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-500">Loading tenants...</p>
          </div>
      )}

      {/* Error Message Display */}
      {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
      )}

      {/* Tenants Table - Shown when not loading and no error */}
      {!loading && !error && (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Head */}
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role(s)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Member Since</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTenants.length > 0 ? (
                filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    {/* Name & Email Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                       <div className="text-sm text-gray-500">{tenant.email}</div>
                    </td>
                    {/* Phone Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tenant.phone || <span className="text-gray-400 italic">Not Provided</span>}
                    </td>
                    {/* Roles Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tenant.roles.includes('ROLE_LANDLORD') ? 'bg-green-100 text-green-800' :
                          tenant.roles.includes('ROLE_ADMIN') ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800' // Default for Tenant
                       }`}>
                         {displayRoles(tenant.roles)}
                       </span>
                    </td>
                    {/* Created At Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(tenant.createdAt)}
                    </td>
                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-800 mr-3 transition duration-150 ease-in-out">View</button>
                      <button className="text-yellow-600 hover:text-yellow-800 mr-3 transition duration-150 ease-in-out">Edit</button>
                      <button className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                // Row shown when no tenants match search or list is empty
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">
                    {searchTerm ? 'No tenants found matching your search.' : 'No tenants available.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Render Add Tenant Modal --- */}
      {/* Conditionally render the modal based on isModalOpen state */}
      <AddTenantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Pass function to close modal
        onTenantCreated={() => {
          fetchTenants(); // Refresh the list when a tenant is successfully created
        }}
      />
    </div>
  );
};

// If needed, export the component:
// export default TenantsManagement;