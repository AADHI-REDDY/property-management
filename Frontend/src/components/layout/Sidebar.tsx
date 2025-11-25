// src/components/layout/Sidebar.tsx

import React from 'react';
// --- FIX: Removed 'Wifi' ---
import { Home, Building, Users, DollarSign, FileText, Settings, X, TrendingUp, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
// --- END FIX ---
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user } = useAuth();

  const isLandlord = user?.roles.includes('ROLE_LANDLORD') ?? false;
  const isAdmin = user?.roles.includes('ROLE_ADMIN') ?? false;
  const isManager = isLandlord || isAdmin; 
  
  let menuItems = [];

  if (isManager) {
    // --- ADMIN / LANDLORD MENU ---
    menuItems = [
      { id: 'admin-dashboard', label: 'Dashboard', icon: Home },
      { id: 'admin-properties', label: 'Properties', icon: Building },
      { id: 'tenants', label: 'Tenants', icon: Users },
      { id: 'maintenance', label: 'Maintenance', icon: Wrench },
      { id: 'payments', label: 'Payments', icon: DollarSign },
      { id: 'leases', label: 'Leases', icon: FileText },
    ];
    
    if (isAdmin) {
       menuItems.splice(2, 0, { id: 'admin-users', label: 'Manage Users', icon: Users });
       menuItems.push({ id: 'admin-analytics', label: 'Analytics', icon: TrendingUp });
       menuItems.push({ id: 'admin-settings', label: 'System Settings', icon: Settings });
    } else {
       menuItems.push({ id: 'settings', label: 'Settings', icon: Settings });
    }

  } else {
    // --- TENANT MENU ---
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'properties', label: 'My Property', icon: Building },
      { id: 'maintenance', label: 'Maintenance', icon: Wrench },
      { id: 'payments', label: 'Payments', icon: DollarSign },
      { id: 'leases', label: 'My Lease', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden" onClick={onClose} />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 ${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-200 ease-in-out md:translate-x-0 md:static md:inset-0`}>
        {/* Desktop Toggle Button */}
        <div className="hidden md:block absolute -right-3 top-6 z-40">
          <button
            onClick={onToggleCollapse}
            className="bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
        
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 md:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button onClick={onClose} className="p-2 rounded-md text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation Menu */}
        <nav className={`mt-8 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onTabChange(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'} text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    } group relative`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                    {!isCollapsed && item.label}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Collapsed state branding */}
        {isCollapsed && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;