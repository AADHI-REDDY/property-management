// src/components/admin/AddPropertyModal.tsx

import React, { useState } from 'react';
// --- THIS IS THE FIX ---
// Import the object 'propertiesAPI'
import { propertiesAPI } from '../../services/api'; 
// --- END FIX ---
import { PropertyRequest } from '../../types'; 
import { Upload, X } from 'lucide-react';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyCreated: () => void;
}

// --- THIS IS THE FIX ---
// 'images' is removed from initialState to match PropertyRequest type
const initialState: PropertyRequest = {
  title: '',
  description: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  rent: '' as any,
  deposit: '' as any,
  bedrooms: '' as any,
  bathrooms: '' as any,
  squareFeet: '' as any,
  amenities: [],
};
// --- END FIX ---

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, onPropertyCreated }) => {
  const [formData, setFormData] = useState<PropertyRequest>(initialState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = ['rent', 'deposit', 'bedrooms', 'bathrooms', 'squareFeet'];
    
    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? (value === '' ? '' : Number(value)) : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      ...formData,
      rent: Number(formData.rent) || 0,
      deposit: Number(formData.deposit) || 0,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      squareFeet: Number(formData.squareFeet) || 0,
    };

    try {
      // --- THIS IS THE FIX ---
      // Call the 'create' method on the 'propertiesAPI' object
      const newProperty = await propertiesAPI.create(payload); 
      // --- END FIX ---
      
      if (selectedFiles.length > 0) {
        // Use propertiesAPI to upload images
        await propertiesAPI.uploadImages(newProperty.id, selectedFiles);
      }

      onPropertyCreated(); 
      onClose(); 
      setFormData(initialState); 
      setSelectedFiles([]);
      setImagePreviews([]);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-2xl font-semibold mb-6">Add New Property</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-100 p-3 rounded">{error}</p>}
          
          <input type="text" name="title" placeholder="Property Title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" />
          
          <fieldset className="border p-4 rounded">
            <legend className="text-sm font-medium px-1">Location</legend>
            <div className="space-y-4">
              <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" required />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="state" placeholder="State (e.g., NY)" value={formData.state} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="zipCode" placeholder="Zip Code" value={formData.zipCode} onChange={handleChange} className="w-full p-2 border rounded" required />
              </div>
            </div>
          </fieldset>

          <fieldset className="border p-4 rounded">
             <legend className="text-sm font-medium px-1">Details & Rent</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="number" name="rent" placeholder="Monthly Rent" min="0" value={formData.rent} onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="number" name="deposit" placeholder="Security Deposit" min="0" value={formData.deposit} onChange={handleChange} className="w-full p-2 border rounded" />
              <input type="number" name="squareFeet" placeholder="Square Feet" min="0" value={formData.squareFeet} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input type="number" name="bedrooms" placeholder="Bedrooms" min="0" value={formData.bedrooms} onChange={handleChange} className="w-full p-2 border rounded" />
              <input type="number" name="bathrooms" placeholder="Bathrooms" min="0" value={formData.bathrooms} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </fieldset>
          
          <fieldset className="border p-4 rounded">
            <legend className="text-sm font-medium px-1">Property Images</legend>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                {imagePreviews.map((previewUrl, index) => (
                  <div key={index} className="relative aspect-square">
                    <img src={previewUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label htmlFor="file-upload" className="w-full flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <span className="text-blue-600 font-medium">Upload files</span>
                  <input id="file-upload" name="files" type="file" multiple onChange={handleFileChange} className="sr-only" accept="image/png, image/jpeg" />
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </label>
          </fieldset>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};