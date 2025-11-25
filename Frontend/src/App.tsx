import React, { useState, useEffect } from 'react'; // Import useEffect
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import AuthPage from './pages/AuthPage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import PropertiesList from './components/properties/PropertiesList';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import AdminProperties from './components/admin/AdminProperties';
import AdminAnalytics from './components/admin/AdminAnalytics';
import AdminSettings from './components/admin/AdminSettings';
import { TenantsManagement } from './components/tenants/TenantsManagement';
import PaymentsManagement from './components/payments/PaymentsManagement';
import LeasesManagement from './components/leases/LeasesManagement';
import Settings from './components/settings/Settings';
import MaintenanceRequests from './components/maintenance/MaintenanceRequests';

const AppContent: React.FC = () => {
  // --- FIX 1: Get the 'user' object ---
  const { isAuthenticated, loading, user } = useAuth(); 
  
  // Set 'dashboard' as a temporary default
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // --- FIX 2: Add a useEffect to set the correct dashboard based on role ---
  useEffect(() => {
    // This runs after loading is false AND the user object is available
    if (!loading && user) {
      // Check if the user's roles array includes LANDLORD or ADMIN
      const isLandlordOrAdmin = user.roles.includes('ROLE_LANDLORD') || user.roles.includes('ROLE_ADMIN');
      
      if (isLandlordOrAdmin) {
        setActiveTab('admin-dashboard'); // Set default tab to admin dashboard
      } else {
        setActiveTab('dashboard'); // Set default tab to tenant dashboard
      }
    }
  }, [loading, user]); // This effect depends on 'loading' and 'user'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        // --- FIX 3: This case will now only be hit by tenants ---
        return <Dashboard />; 
      case 'properties':
        return <PropertiesList />;
      case 'admin-dashboard':
        // --- This case will now be hit by landlords/admins ---
        return <AdminDashboard />;
      case 'admin-users':
        return <UserManagement />;
      case 'admin-properties':
        return <AdminProperties />;
      case 'admin-analytics':
        return <AdminAnalytics />;
      case 'admin-settings':
        return <AdminSettings />;
      case 'tenants':
        return <TenantsManagement />;
      case 'maintenance':
        return <MaintenanceRequests />;
      case 'payments':
        return <PaymentsManagement />;
      case 'leases':
        return <LeasesManagement />;
      case 'settings':
        return <Settings />;
      default:
        // Default to tenant dashboard if something goes wrong
        return <Dashboard />;
    }
  };

  return (
    <div className={`flex h-screen bg-gray-100 transition-all duration-200`}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-200 ${sidebarCollapsed ? 'md:ml-0' : ''}`}>
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;