import React from 'react';

const ChartFilter = ({ activeFilter, onFilterChange }) => {
    const filters = [
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' }
    ];

    return (
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    onClick={() => onFilterChange(filter.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        activeFilter === filter.value
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                    }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
};

export default ChartFilter;
