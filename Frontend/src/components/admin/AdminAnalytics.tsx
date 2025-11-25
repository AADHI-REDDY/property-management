import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, PieChart, Activity, DollarSign, Users, Building, Calendar } from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    monthlyGrowth: 0,
    userGrowth: 0,
    propertyGrowth: 0,
    occupancyRate: 0,
    averageRent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalytics({
        totalRevenue: 2847500,
        monthlyGrowth: 12.5,
        userGrowth: 8.3,
        propertyGrowth: 15.7,
        occupancyRate: 87.2,
        averageRent: 2340,
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const revenueData = [
    { month: 'Jan', revenue: 180000, properties: 45, users: 120 },
    { month: 'Feb', revenue: 195000, properties: 48, users: 135 },
    { month: 'Mar', revenue: 210000, properties: 52, users: 150 },
    { month: 'Apr', revenue: 225000, properties: 55, users: 165 },
    { month: 'May', revenue: 240000, properties: 58, users: 180 },
    { month: 'Jun', revenue: 255000, properties: 62, users: 195 },
  ];

  const propertyStatusData = [
    { status: 'Available', count: 89, percentage: 26.0, color: 'bg-green-500' },
    { status: 'Rented', count: 198, percentage: 57.9, color: 'bg-blue-500' },
    { status: 'Maintenance', count: 35, percentage: 10.2, color: 'bg-orange-500' },
    { status: 'Vacant', count: 20, percentage: 5.9, color: 'bg-gray-500' },
  ];

  const topPerformingProperties = [
    { id: '1', title: 'Downtown Luxury Complex', revenue: 45000, occupancy: 95 },
    { id: '2', title: 'Riverside Apartments', revenue: 38000, occupancy: 92 },
    { id: '3', title: 'City Center Studios', revenue: 32000, occupancy: 88 },
    { id: '4', title: 'Garden View Condos', revenue: 28000, occupancy: 85 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-purple-600" />
          Analytics & Reports
        </h1>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(analytics.totalRevenue / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +{analytics.monthlyGrowth}% from last month
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">User Growth</p>
              <p className="text-2xl font-bold text-gray-900">+{analytics.userGrowth}%</p>
              <p className="text-sm text-blue-600">New users this month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Property Growth</p>
              <p className="text-2xl font-bold text-gray-900">+{analytics.propertyGrowth}%</p>
              <p className="text-sm text-purple-600">New properties added</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.occupancyRate}%</p>
              <p className="text-sm text-green-600">Above industry average</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Revenue Trend
          </h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {revenueData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{
                    height: `${(data.revenue / Math.max(...revenueData.map(d => d.revenue))) * 200}px`
                  }}
                />
                <div className="text-xs text-gray-600 mt-2">{data.month}</div>
                <div className="text-xs font-medium text-gray-900">
                  ${(data.revenue / 1000).toFixed(0)}k
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            Property Status Distribution
          </h2>
          <div className="space-y-4">
            {propertyStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${item.color}`} />
                  <span className="text-sm font-medium text-gray-900">{item.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{item.count}</span>
                  <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden flex">
            {propertyStatusData.map((item, index) => (
              <div
                key={index}
                className={item.color}
                style={{ width: `${item.percentage}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Properties */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Top Performing Properties
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Property</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Monthly Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Occupancy Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Performance</th>
              </tr>
            </thead>
            <tbody>
              {topPerformingProperties.map((property, index) => (
                <tr key={property.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Building className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-900">{property.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    ${property.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${property.occupancy}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{property.occupancy}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      index === 0 ? 'bg-green-100 text-green-800' :
                      index === 1 ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {index === 0 ? 'Excellent' : index === 1 ? 'Good' : 'Average'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-600" />
          Quick Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Peak Rental Season</h3>
            <p className="text-sm text-blue-800">
              Summer months show 23% higher rental activity compared to winter.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">Average Rent Increase</h3>
            <p className="text-sm text-green-800">
              Properties have seen an average rent increase of 8.5% year-over-year.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="font-medium text-purple-900 mb-2">User Satisfaction</h3>
            <p className="text-sm text-purple-800">
              Platform maintains a 4.7/5 average rating from both landlords and tenants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;