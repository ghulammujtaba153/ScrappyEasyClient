import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneOutlined, MailOutlined, TrophyOutlined, ClockCircleOutlined } from '@ant-design/icons';

const ColdCallerCard = ({ caller }) => {
  const navigate = useNavigate();

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
    <div
      onClick={() => navigate(`/dashboard/cold-caller/${caller.id}`)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-400 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={caller.avatar}
            alt={caller.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-gray-900">{caller.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(caller.status)}`}>
                {caller.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{caller.position}</p>
            <p className="text-xs text-gray-500">{caller.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPerformanceBadge(caller.performance)}`}>
            {caller.performance.replace('-', ' ').toUpperCase()}
          </span>
          <span className="text-xs text-gray-600">
            {caller.experience} experience
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <PhoneOutlined className="text-blue-600" />
            <span className="text-gray-700 truncate">{caller.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MailOutlined className="text-green-600" />
            <span className="text-gray-700 truncate">{caller.email}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Total Calls</span>
            <span className="text-sm font-semibold text-gray-900">{caller.callsMade.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Success Rate</span>
            <span className="text-sm font-semibold text-green-600">{caller.successRate}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Avg Duration</span>
            <span className="text-sm font-semibold text-blue-600">{caller.avgCallDuration}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Total Revenue</span>
            <span className="text-sm font-semibold text-purple-600">{caller.totalRevenue}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <ClockCircleOutlined />
              <span>{caller.shift}</span>
            </div>
            <div className="flex gap-1">
              {caller.language.map((lang, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 rounded">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColdCallerCard;