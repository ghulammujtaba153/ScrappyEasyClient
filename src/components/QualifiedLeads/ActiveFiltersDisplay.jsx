import React from 'react';
import { Tag } from 'antd';
import { MdFilterList } from 'react-icons/md';

const ActiveFiltersDisplay = ({ filters, searchString }) => {
    // Get active filters for display from the original saved filters
    const getActiveFiltersList = () => {
        if (!filters) return [];
        const active = [];
        if (filters.locationSearch) active.push(`Location: "${filters.locationSearch}"`);
        if (filters.whatsappStatus) active.push(`WhatsApp: ${filters.whatsappStatus}`);
        if (filters.ratingMin !== null && filters.ratingMin !== undefined) active.push(`Rating ≥ ${filters.ratingMin}`);
        if (filters.ratingMax !== null && filters.ratingMax !== undefined) active.push(`Rating ≤ ${filters.ratingMax}`);
        if (filters.reviewsMin !== null && filters.reviewsMin !== undefined) active.push(`Reviews ≥ ${filters.reviewsMin}`);
        if (filters.reviewsMax !== null && filters.reviewsMax !== undefined) active.push(`Reviews ≤ ${filters.reviewsMax}`);
        if (filters.hasWebsite) active.push(`Website: ${filters.hasWebsite}`);
        if (filters.hasPhone) active.push(`Phone: ${filters.hasPhone}`);
        if (filters.favorite) active.push(`Favorites: ${filters.favorite}`);
        return active;
    };

    const activeFilters = getActiveFiltersList();

    return (
        <>
            {/* Search Query */}
            {searchString && (
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                    <p className="text-sm text-gray-500">Search Query</p>
                    <p className="text-lg font-semibold text-gray-800">{searchString}</p>
                </div>
            )}

            {/* Filters Applied */}
            {activeFilters.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <MdFilterList className="text-purple-500 text-xl" />
                        <h3 className="text-lg font-semibold text-gray-800">Original Filters Applied</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {activeFilters.map((filter, index) => (
                            <Tag key={index} color="purple" className="text-sm py-1 px-3">
                                {filter}
                            </Tag>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default ActiveFiltersDisplay;
