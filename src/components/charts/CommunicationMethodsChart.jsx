import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';

const COLORS = {
    coldCall: '#3B82F6',      // Blue for cold calls
    messages: '#10B981',      // Green for messages
    both: '#8B5CF6',          // Purple for both
    none: '#9CA3AF'           // Gray for none
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
                <p className="text-gray-800 font-medium mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-semibold">{entry.value.toLocaleString()}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const CommunicationMethodsChart = ({ data = [], loading = false }) => {
    const total = data.reduce((sum, item) => sum + (item.contacted || 0), 0);

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-72 bg-gray-100 rounded animate-pulse"></div>
            </div>
        );
    }

    if (data.length === 0 || total === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Communication Methods</h3>
                <div className="h-72 flex items-center justify-center text-gray-500">
                    No communication data available
                </div>
            </div>
        );
    }

    // Format data for the chart - show contacted vs total for each method
    const chartData = [
        {
            name: 'Cold Calls',
            contacted: data.find(d => d.method === 'coldCall')?.contacted || 0,
            total: data.find(d => d.method === 'coldCall')?.total || 0,
            color: COLORS.coldCall
        },
        {
            name: 'Messages',
            contacted: data.find(d => d.method === 'messages')?.contacted || 0,
            total: data.find(d => d.method === 'messages')?.total || 0,
            color: COLORS.messages
        }
    ];

    // Calculate stats
    const totalCalls = chartData[0].contacted;
    const totalMessages = chartData[1].contacted;
    const totalContacted = totalCalls + totalMessages;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Communication Methods</h3>
                <div className="text-sm text-gray-500">
                    Total Contacted: <span className="font-semibold text-gray-700">{totalContacted.toLocaleString()}</span>
                </div>
            </div>
            
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        barCategoryGap="30%"
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="name" 
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            axisLine={{ stroke: '#E5E7EB' }}
                        />
                        <YAxis 
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            axisLine={{ stroke: '#E5E7EB' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar 
                            dataKey="contacted" 
                            name="Contacted" 
                            radius={[4, 4, 0, 0]}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                        <Bar 
                            dataKey="total" 
                            name="Total in Campaigns" 
                            fill="#E5E7EB"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${COLORS.coldCall}20` }}>
                        <svg className="w-5 h-5" style={{ color: COLORS.coldCall }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-bold" style={{ color: COLORS.coldCall }}>{totalCalls.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Cold Calls Made</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${COLORS.messages}20` }}>
                        <svg className="w-5 h-5" style={{ color: COLORS.messages }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-bold" style={{ color: COLORS.messages }}>{totalMessages.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Messages Sent</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunicationMethodsChart;
