import React, { useState } from 'react';
import coldCallerData from '../../data/coldCaller';
import ColdCallerCard from '../../component/dashboard/ColdCallerCard';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const ColdCallerPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [performanceFilter, setPerformanceFilter] = useState('all');

  const filteredCallers = coldCallerData.filter(caller => {
    const matchesSearch = caller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caller.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || caller.status === statusFilter;
    const matchesPerformance = performanceFilter === 'all' || caller.performance === performanceFilter;
    
    return matchesSearch && matchesStatus && matchesPerformance;
  });

  const stats = {
    total: coldCallerData.length,
    active: coldCallerData.filter(c => c.status === 'active').length,
    totalCalls: coldCallerData.reduce((sum, c) => sum + c.callsMade, 0),
    avgSuccessRate: (coldCallerData.reduce((sum, c) => sum + c.successRate, 0) / coldCallerData.length).toFixed(1)
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cold Callers</h1>
          <p className="text-gray-600">Manage and monitor your sales team performance</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-600 mb-1">Total Callers</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-600 mb-1">Active Now</div>
          <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
          <div className="text-sm text-gray-600 mb-1">Total Calls</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalCalls.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
          <div className="text-sm text-gray-600 mb-1">Avg Success Rate</div>
          <div className="text-2xl font-bold text-gray-900">{stats.avgSuccessRate}%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-break">On Break</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={performanceFilter}
            onChange={(e) => setPerformanceFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Performance</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="average">Average</option>
            <option value="needs-improvement">Needs Improvement</option>
          </select>
        </div>
      </div>

      {/* Callers Grid */}
      {filteredCallers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 text-lg mb-2">No callers found</div>
          <p className="text-gray-500 text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCallers.map(caller => (
            <ColdCallerCard key={caller.id} caller={caller} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColdCallerPage;
