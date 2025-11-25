import React from 'react';
import { Property } from '../../types';
import { X, MapPin, Bed, Bath, Square, Calendar } from 'lucide-react';

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ isOpen, onClose, property }) => {
  if (!isOpen || !property) return null;

  const getImageUrl = (path: string) => {
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
    const SERVER_ROOT = API_URL.replace(/\/api\/?$/, '');
    if (path.startsWith('http')) return path;
    return `${SERVER_ROOT}${path}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        
        <div className="relative h-64 bg-gray-200">
          {property.images && property.images.length > 0 ? (
            <img 
              src={getImageUrl(property.images[0])} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">No Image Available</div>
          )}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
            {property.status ? property.status.toUpperCase() : 'UNKNOWN'}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Bedrooms</p>
                <p className="font-semibold">{property.bedrooms}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Bathrooms</p>
                <p className="font-semibold">{property.bathrooms}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Square className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Square Feet</p>
                <p className="font-semibold">{property.squareFeet || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Listed Date</p>
                <p className="font-semibold">
                  {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {property.description || "No description provided."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg flex justify-between items-center">
              <span className="text-gray-600">Monthly Rent</span>
              <span className="text-xl font-bold text-green-600">${property.rent.toLocaleString()}</span>
            </div>
            <div className="p-4 border rounded-lg flex justify-between items-center">
              <span className="text-gray-600">Security Deposit</span>
              <span className="text-lg font-semibold text-gray-800">${property.deposit.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};