import React from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#10B981', '#EF4444'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
                <p className="text-gray-800 font-medium">{payload[0].name}</p>
                <p className="text-gray-600 text-sm">
                    Count: <span className="font-semibold">{payload[0].value.toLocaleString()}</span>
                </p>
            </div>
        );
    }
    return null;
};

const WhatsAppDonutChart = ({ data = [], loading = false }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const availablePercent = total > 0 ? Math.round((data.find(d => d.name === 'Available')?.value || 0) / total * 100) : 0;

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-72 bg-gray-100 rounded animate-pulse"></div>
            </div>
        );
    }

    if (data.length === 0 || total === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">WhatsApp Availability</h3>
                <div className="h-72 flex items-center justify-center text-gray-500">
                    No WhatsApp data available
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">WhatsApp Availability</h3>
            <div className="h-72 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.name === 'Available' ? COLORS[0] : COLORS[1]}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-green-600">{availablePercent}%</span>
                    <span className="text-sm text-gray-500">Available</span>
                </div>
            </div>
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.name === 'Available' ? COLORS[0] : COLORS[1] }}
                        />
                        <span className="text-sm text-gray-600">{entry.name}</span>
                        <span className="text-sm font-semibold text-gray-800">
                            ({entry.value.toLocaleString()})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WhatsAppDonutChart;
