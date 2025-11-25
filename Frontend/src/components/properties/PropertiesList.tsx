import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Property } from '../../types';
import { useAuth } from '../../context/AuthContext';
import PropertyCard from './PropertyCard';
import { propertiesAPI } from '../../services/api'; // Import the API object

const PropertiesList: React.FC = () => {
  const { user } = useAuth();
  
  // --- THIS IS THE FIX ---
  // Check the 'roles' array, not a singular 'role' property
  const isLandlord = user?.roles.includes('ROLE_LANDLORD') ?? false;
  // --- END FIX ---

  const [searchTerm, setSearchTerm] = useState('');
  // Default filter to 'available' for tenants, 'all' for landlords
  const [filterStatus, setFilterStatus] = useState(isLandlord ? 'all' : 'available');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, [isLandlord]); // Run when component loads and if 'isLandlord' status changes

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError('');
      
      let data: Property[];
      
      // --- THIS IS THE FIX ---
      // Landlords see all properties, Tenants see only available ones
      if (isLandlord) {
        // Landlord (or Admin) sees all properties
        data = await propertiesAPI.getAll(); 
      } else {
        // Tenant sees ONLY available properties
        data = await propertiesAPI.getAvailable(); 
      }
      // --- END FIX ---

      // Format status from backend (e.g., "AVAILABLE") to lowercase
      const formattedData = data.map(prop => ({
        ...prop,
        status: (prop.status || 'maintenance').toLowerCase() as 'available' | 'rented' | 'maintenance'
      }));
      
      setProperties(formattedData);
    } catch (err: any) {
      setError('Failed to fetch properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch =
      (property.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (property.address?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (property.city?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    // If user is a tenant, they should only ever see 'available' properties
    // The filter bar is mostly for landlords in this view
    const matchesFilter = filterStatus === 'all' || property.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handlePropertyClick = (property: Property) => {
    console.log('Property clicked:', property);
    // In real app, this would navigate to /properties/:id
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
          <button 
            onClick={fetchProperties}
            className="ml-2 text-red-700 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isLandlord ? 'My Properties' : 'Available Properties'}
        </h1>
        {isLandlord && (
          <button 
             onClick={() => console.log('TODO: Open Add Property Modal from this component')}
             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title, address, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Only show the filter dropdown to landlords */}
        {isLandlord && (
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        )}
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-600">Loading properties...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={handlePropertyClick}
            />
          ))}
        </div>
      )}

      {/* No Properties Found Message */}
      {!loading && filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No properties found' : 'No properties available'}
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Please check back later for new listings.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertiesList;