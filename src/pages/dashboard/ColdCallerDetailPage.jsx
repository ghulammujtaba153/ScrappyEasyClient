import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import coldCallerData from '../../data/coldCaller';
import { ArrowLeftOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined, TrophyOutlined, LineChartOutlined } from '@ant-design/icons';

const ColdCallerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const caller = coldCallerData.find(c => c.id === parseInt(id));

  if (!caller) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-gray-400 text-xl mb-4">Caller not found</div>
        <button
          onClick={() => navigate('/dashboard/cold-caller')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Callers
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-break': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPerformanceBadge = (performance) => {
    switch (performance) {
      case 'excellent': return 'bg-green-500 text-white';
      case 'good': return 'bg-blue-500 text-white';
      case 'average': return 'bg-yellow-500 text-white';
      case 'needs-improvement': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/cold-caller')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftOutlined className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Caller Details</h1>
          <p className="text-gray-600">View complete information and performance metrics</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={caller.avatar}
            alt={caller.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl font-bold text-gray-900">{caller.name}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(caller.status)}`}>
                {caller.status.replace('-', ' ').toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPerformanceBadge(caller.performance)}`}>
                {caller.performance.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            <p className="text-lg text-gray-700 mb-2">{caller.position}</p>
            <p className="text-gray-600 mb-4">{caller.department}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <PhoneOutlined className="text-blue-600 text-lg" />
                <span className="text-gray-700">{caller.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MailOutlined className="text-green-600 text-lg" />
                <span className="text-gray-700">{caller.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockCircleOutlined className="text-purple-600 text-lg" />
                <span className="text-gray-700">{caller.shift}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrophyOutlined className="text-orange-600 text-lg" />
                <span className="text-gray-700">{caller.experience} experience</span>
              </div>
            </div>

            <div className="flex gap-2">
              {caller.language.map((lang, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="text-sm text-gray-600 mb-2">Total Calls Made</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{caller.callsMade.toLocaleString()}</div>
          <div className="text-xs text-gray-500">All time</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="text-sm text-gray-600 mb-2">Success Rate</div>
          <div className="text-3xl font-bold text-green-600 mb-1">{caller.successRate}%</div>
          <div className="text-xs text-gray-500">Conversion rate</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="text-sm text-gray-600 mb-2">Avg Call Duration</div>
          <div className="text-3xl font-bold text-purple-600 mb-1">{caller.avgCallDuration}</div>
          <div className="text-xs text-gray-500">Per call</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="text-sm text-gray-600 mb-2">Total Revenue</div>
          <div className="text-3xl font-bold text-orange-600 mb-1">{caller.totalRevenue}</div>
          <div className="text-xs text-gray-500">Generated</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <LineChartOutlined className="text-xl text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Calls Made</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Conversions</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {caller.recentActivity.map((activity, idx) => {
                const rate = ((activity.conversions / activity.calls) * 100).toFixed(1);
                return (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{activity.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{activity.calls}</td>
                    <td className="py-3 px-4 text-sm text-green-600 font-semibold">{activity.conversions}</td>
                    <td className="py-3 px-4 text-sm text-blue-600 font-semibold">{rate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes & Comments</h3>
        <p className="text-gray-700 leading-relaxed">{caller.notes}</p>
      </div>
    </div>
  );
};

export default ColdCallerDetailPage;
