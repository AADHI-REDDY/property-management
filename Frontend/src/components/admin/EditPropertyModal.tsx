import React, { useState, useEffect } from 'react';
import { propertiesAPI } from '../../services/api';
import { Property, PropertyRequest } from '../../types';

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onPropertyUpdated: () => void;
}

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({ isOpen, onClose, property, onPropertyUpdated }) => {
  const [formData, setFormData] = useState<PropertyRequest>({
    title: '', address: '', city: '', state: '', zipCode: '', description: '',
    rent: 0, deposit: 0, bedrooms: 0, bathrooms: 0, squareFeet: 0, amenities: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description || '',
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        rent: property.rent,
        deposit: property.deposit,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.squareFeet || 0,
        amenities: property.amenities || [],
      });
    }
  }, [property]);

  if (!isOpen || !property) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = ['rent', 'deposit', 'bedrooms', 'bathrooms', 'squareFeet'];
    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await propertiesAPI.update(property.id, formData);
      onPropertyUpdated();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError("Failed to update property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-semibold mb-6">Edit Property</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required placeholder="Title" />
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Description" />
          
          <div className="grid grid-cols-2 gap-4">
             <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" required placeholder="Address"/>
             <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded" required placeholder="City"/>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
             <input type="number" name="rent" value={formData.rent} onChange={handleChange} className="w-full p-2 border rounded" required placeholder="Rent"/>
             <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full p-2 border rounded" required placeholder="Beds"/>
             <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full p-2 border rounded" required placeholder="Baths"/>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? 'Updating...' : 'Update Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};