import React, { useState, useEffect } from 'react';
import { Users, Building, DollarSign, TrendingUp, AlertTriangle, Shield, Database, Activity } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLandlords: 0,
    totalTenants: 0,
    totalProperties: 0,
    totalRevenue: 0,
    activeLeases: 0,
    pendingPayments: 0,
    systemHealth: 'good',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading admin stats
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        totalLandlords: 89,
        totalTenants: 1158,
        totalProperties: 342,
        totalRevenue: 2847500,
        activeLeases: 298,
        pendingPayments: 23,
        systemHealth: 'good',
      });
      setLoading(false);
    }, 1000);
  }, []);

  const recentActivities = [
    { id: 1, type: 'user', message: 'New landlord registered: Sarah Johnson', time: '5 minutes ago', severity: 'info' },
    { id: 2, type: 'payment', message: 'Large payment received: $15,000', time: '12 minutes ago', severity: 'success' },
    { id: 3, type: 'property', message: 'Property flagged for review: Downtown Loft', time: '1 hour ago', severity: 'warning' },
    { id: 4, type: 'system', message: 'Database backup completed successfully', time: '2 hours ago', severity: 'success' },
    { id: 5, type: 'security', message: 'Failed login attempts detected', time: '3 hours ago', severity: 'error' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      case 'property': return <Building className="w-4 h-4" />;
      case 'system': return <Database className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-gray-600">Loading admin dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-purple-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">System overview and management</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            System Healthy
          </div>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-gray-500">
                {stats.totalLandlords} landlords, {stats.totalTenants} tenants
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
              <p className="text-xs text-gray-500">{stats.activeLeases} active leases</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(stats.totalRevenue / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-gray-500">Platform lifetime</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Issues</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
              <p className="text-xs text-gray-500">Require attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Platform Growth
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Analytics Chart</p>
              <p className="text-sm text-gray-500">Integration with charts library needed</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h2>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${getSeverityColor(activity.severity)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Admin Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Users className="w-6 h-6 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900">Manage Users</p>
            <p className="text-sm text-gray-600">View and edit user accounts</p>
          </button>
          
          <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Building className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">Property Review</p>
            <p className="text-sm text-gray-600">Approve pending properties</p>
          </button>
          
          <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Shield className="w-6 h-6 text-red-600 mb-2" />
            <p className="font-medium text-gray-900">Security Center</p>
            <p className="text-sm text-gray-600">Monitor system security</p>
          </button>
          
          <button className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Database className="w-6 h-6 text-green-600 mb-2" />
            <p className="font-medium text-gray-900">System Backup</p>
            <p className="text-sm text-gray-600">Manage data backups</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;