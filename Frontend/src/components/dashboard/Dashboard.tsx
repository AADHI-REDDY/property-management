import React from 'react';
// Removed TrendingUp (unused)
import { Building, Users, DollarSign, Calendar, AlertCircle } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext';
// --- FIX: Removed this entire line, as it was causing the errors ---
// import { propertiesAPI, paymentsAPI, leasesAPI } from '../../services/api'; 
import AdminDashboard from '../admin/AdminDashboard';
// Removed formatDateTime (unused)
import { formatCurrency } from '../../utils/currency'; 
import { useSettings } from '../../context/SettingsContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  // Removed timezone (unused)
  const { currency } = useSettings(); 
  
  // This logic is correct:
  const isLandlord = user?.roles.includes('ROLE_LANDLORD') ?? false;
  const isAdmin = user?.roles.includes('ROLE_ADMIN') ?? false;

  const [stats, setStats] = React.useState({
    totalProperties: 0,
    occupiedProperties: 0,
    totalTenants: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    maintenanceRequests: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // If admin, show admin dashboard (this is a good fallback, but App.tsx handles it)
  if (isAdmin) {
    return <AdminDashboard />;
  }
  
  // Fetch dashboard data
  React.useEffect(() => {
    fetchDashboardData();
  }, [isLandlord]); // Run when 'isLandlord' is determined

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching dashboard data...');
      
      // Demo data for testing
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      console.log('Dashboard data loaded successfully');
      
      if (isLandlord) {
        setStats({
          totalProperties: 12,
          occupiedProperties: 10,
          totalTenants: 15,
          monthlyRevenue: 28500,
          pendingPayments: 3,
          maintenanceRequests: 2,
        });
      } else {
        setStats({
          totalProperties: 0,
          occupiedProperties: 0,
          totalTenants: 0,
          monthlyRevenue: 1850,
          pendingPayments: 1,
          maintenanceRequests: 0,
        });
      }
    } catch (err: any) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const recentActivities = [
    { id: 1, type: 'payment', message: 'Payment received from John Doe - Unit 4B', time: '2 hours ago' },
    { id: 2, type: 'maintenance', message: 'Maintenance request submitted for Unit 2A', time: '4 hours ago' },
    { id: 3, type: 'lease', message: 'New lease signed for Unit 3C', time: '1 day ago' },
    { id: 4, type: 'payment', message: 'Payment overdue for Unit 1B', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
          <button 
            onClick={fetchDashboardData}
            className="ml-2 text-red-700 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLandlord && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                </div>
              </div>
            </div>
          )}

          {isLandlord && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tenants</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTenants}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {isLandlord ? 'Monthly Revenue' : 'Monthly Rent'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.monthlyRevenue, currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-green-600" />}
                  {activity.type === 'maintenance' && <AlertCircle className="w-4 h-4 text-orange-600" />}
                  {activity.type === 'lease' && <Calendar className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {isLandlord && (
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Add New Property</span>
                </div>
              </button>
            )}
            
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900">
                  {isLandlord ? 'Record Payment' : 'Make Payment'}
                </span>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-900">
                  {isLandlord ? 'View Maintenance Requests' : 'Submit Maintenance Request'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;