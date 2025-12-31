import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
                <p className="text-gray-600 font-medium mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }} className="text-sm">
                        {entry.name}: {entry.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const LeadsAreaChart = ({ data = [], loading = false }) => {
    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-72 bg-gray-100 rounded animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Leads Overview</h3>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="whatsappGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis 
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="leads"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#leadsGradient)"
                            name="Total Leads"
                        />
                        <Area
                            type="monotone"
                            dataKey="whatsapp"
                            stroke="#10B981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#whatsappGradient)"
                            name="WhatsApp Available"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LeadsAreaChart;
