// src/types/index.ts

// --- User Interface ---
export interface User {
  id: string; // Or number
  name: string;
  email: string;
  roles: string[];
  phone?: string | null;
  profileImage?: string | null;
  createdAt?: string | null;
}

// --- Property Interface ---
// This matches your PropertyResponse DTO
export interface Property {
  id: string; // Or number
  title: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  rent: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  amenities?: string[];
  images: string[]; // List of image URLs
  status: 'available' | 'rented' | 'maintenance';
  landlord?: User; // Or a simplified User object
  createdAt?: string;
}

// --- Lease Interface ---
export interface Lease {
  id: string; // Or number
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  status: 'active' | 'expired' | 'terminated';
}

// --- Payment Interface ---
export interface Payment {
  id: string; // Or number
  leaseId: string;
  amount: number;
  dueDate: string;
  paidDate?: string | null;
  status: 'pending' | 'paid' | 'overdue';
}


// --- API Payloads ---

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  roles: string[];
  phone?: string;
  profileImage?: string;
}

export interface CreateTenantRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// --- THIS IS THE FIX ---
// Payload for creating a new property (text data only)
export interface PropertyRequest {
  title: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  rent: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  amenities?: string[];
  // 'images' field is removed from here
}
// --- END FIX ---


// --- API Responses ---
export interface LoginResponse {
  token: string;
  user: User;
}