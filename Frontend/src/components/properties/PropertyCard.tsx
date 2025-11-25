import React, { useState } from 'react';
import { MapPin, Bed, Bath, Square, Building } from 'lucide-react';
import { Property } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { useSettings } from '../../context/SettingsContext';

interface PropertyCardProps {
  property: Property;
  onClick: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const { currency } = useSettings();
  const [imageFailed, setImageFailed] = useState(false);

  // --- THIS IS THE FIX ---
  // 1. Get the API Base URL
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
  
  // 2. Calculate the Server Root by removing '/api' from the end
  // This turns 'http://localhost:8081/api' into 'http://localhost:8081'
  const SERVER_ROOT = API_URL.replace(/\/api\/?$/, '');
  // --- END FIX ---

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Use the SERVER_ROOT (without /api) + path (which starts with /uploads)
    return `${SERVER_ROOT}${path}`;
  };

  const handleImageError = () => {
    setImageFailed(true);
  };

  const imageUrl = (property.images && property.images.length > 0) 
                   ? getImageUrl(property.images[0]) 
                   : '';

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(property)}
    >
      <div className="h-48 bg-gray-200 relative">
        {(imageUrl && !imageFailed) ? (
          <img 
            src={imageUrl} 
            alt={property.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="flex items-center justify-center h-full flex-col">
            <Building className="w-12 h-12 text-gray-400" />
            <span className="text-sm text-gray-500 mt-2">No Image</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={property.title}>
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate" title={`${property.address}, ${property.city}`}>
            {property.address}, {property.city}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{property.squareFeet || 'N/A'} sq ft</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-green-600 font-semibold">
            <span>{formatCurrency(property.rent, currency)}/month</span>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;