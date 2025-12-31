import React from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

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

const RatingPieChart = ({ data = [], loading = false }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-72 bg-gray-100 rounded animate-pulse"></div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Rating Distribution</h3>
                <div className="h-72 flex items-center justify-center text-gray-500">
                    No rating data available
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Rating Distribution</h3>
            <div className="h-72 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            fill="#8884d8"
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-800">{total.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">Total</span>
                </div>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-xs text-gray-600">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingPieChart;
