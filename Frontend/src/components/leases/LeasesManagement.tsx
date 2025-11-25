import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Plus, Calendar, User, Home, DollarSign } from 'lucide-react';
import { Lease } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { formatCurrency } from '../../utils/currency';

interface LeaseWithDetails extends Lease {
  tenantName: string;
  propertyAddress: string;
  propertyTitle: string;
}

const LeasesManagement: React.FC = () => {
  const { currency } = useSettings();
  const [leases, setLeases] = useState<LeaseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Simulate loading leases
    setTimeout(() => {
      const mockLeases: LeaseWithDetails[] = [
        {
          id: '1',
          propertyId: '1',
          tenantId: '1',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          rentAmount: 2500,
          securityDeposit: 5000,
          status: 'active',
          tenantName: 'Jane Smith',
          propertyAddress: '123 Main St, Apt 4B',
          propertyTitle: 'Modern Downtown Apartment',
        },
        {
          id: '2',
          propertyId: '2',
          tenantId: '2',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2025-01-31'),
          rentAmount: 1800,
          securityDeposit: 3600,
          status: 'active',
          tenantName: 'Mike Johnson',
          propertyAddress: '456 Oak Ave, Unit 2A',
          propertyTitle: 'Cozy Studio Apartment',
        },
        {
          id: '3',
          propertyId: '3',
          tenantId: '3',
          startDate: new Date('2023-06-01'),
          endDate: new Date('2023-12-31'),
          rentAmount: 3200,
          securityDeposit: 6400,
          status: 'expired',
          tenantName: 'Sarah Wilson',
          propertyAddress: '789 Pine Rd, Suite 1C',
          propertyTitle: 'Luxury Penthouse',
        },
        {
          id: '4',
          propertyId: '4',
          tenantId: '4',
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-08-31'),
          rentAmount: 2200,
          securityDeposit: 4400,
          status: 'terminated',
          tenantName: 'David Brown',
          propertyAddress: '321 Elm St, Unit 3B',
          propertyTitle: 'Garden View Apartment',
        },
      ];

      setLeases(mockLeases);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredLeases = leases.filter(lease => {
    const matchesSearch = lease.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lease.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lease.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || lease.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'terminated':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilExpiry = (endDate: Date) => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeLeases = leases.filter(l => l.status === 'active');
  const totalRevenue = activeLeases.reduce((sum, l) => sum + l.rentAmount, 0);
  const expiringLeases = activeLeases.filter(l => getDaysUntilExpiry(l.endDate) <= 30);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-gray-600">Loading leases...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-8 h-8 text-blue-600" />
          Lease Management
        </h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Lease
        </button>
      </div>

      {/* Lease Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Leases</p>
              <p className="text-2xl font-bold text-gray-900">{leases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Leases</p>
              <p className="text-2xl font-bold text-green-600">{activeLeases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-emerald-600">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">{expiringLeases.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by tenant, property, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLeases.map((lease) => {
          const daysUntilExpiry = getDaysUntilExpiry(lease.endDate);
          const isExpiringSoon = daysUntilExpiry <= 30 && lease.status === 'active';
          
          return (
            <div key={lease.id} className={`bg-white p-6 rounded-lg shadow-sm border ${isExpiringSoon ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{lease.propertyTitle}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lease.status)}`}>
                  {lease.status.charAt(0).toUpperCase() + lease.status.slice(1)}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span><strong>Tenant:</strong> {lease.tenantName}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Home className="w-4 h-4" />
                  <span>{lease.propertyAddress}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span><strong>Rent:</strong> {formatCurrency(lease.rentAmount, currency)}/month</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    <strong>Term:</strong> {lease.startDate.toLocaleDateString()} - {lease.endDate.toLocaleDateString()}
                  </span>
                </div>
                
                {lease.status === 'active' && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span className={daysUntilExpiry <= 30 ? 'text-orange-600 font-medium' : 'text-gray-600'}>
                      {daysUntilExpiry > 0 
                        ? `Expires in ${daysUntilExpiry} days`
                        : `Expired ${Math.abs(daysUntilExpiry)} days ago`
                      }
                    </span>
                  </div>
                )}
              </div>
              
              {isExpiringSoon && (
                <div className="mt-4 p-3 bg-orange-100 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800 font-medium">
                    ⚠️ Lease expiring soon! Consider renewal discussions.
                  </p>
                </div>
              )}
              
              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                  View Details
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200">
                  Edit Lease
                </button>
                {lease.status === 'active' && daysUntilExpiry <= 60 && (
                  <button className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded text-sm hover:bg-green-200">
                    Renew
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredLeases.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leases found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default LeasesManagement;