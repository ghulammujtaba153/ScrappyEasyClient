import React from 'react';
import { Input, Select, InputNumber, Button } from 'antd';
import { MdSearch, MdFavorite } from 'react-icons/md';
import { BsWhatsapp } from 'react-icons/bs';

const { Option } = Select;

const QualifiedLeadsFilters = ({
    filters,
    onFilterChange,
    onClearFilters,
    hasActiveFilters,
    filteredCount,
    totalCount
}) => {
    const updateFilter = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full"><MdSearch className="text-primary" /></span>
                Filters
            </h3>
            <div className="space-y-4">
                {/* Search */}
                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                        Search (Business Name, Address, City, Phone)
                    </label>
                    <Input
                        placeholder="Search..."
                        value={filters.searchText}
                        onChange={(e) => updateFilter('searchText', e.target.value)}
                        prefix={<MdSearch className="text-gray-600" />}
                        allowClear
                    />
                </div>

                {/* Row 1: WhatsApp Status & Has Website */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            WhatsApp Status
                        </label>
                        <Select
                            placeholder="Select status"
                            style={{ width: '100%' }}
                            value={filters.whatsappStatus || undefined}
                            onChange={(value) => updateFilter('whatsappStatus', value || '')}
                            allowClear
                        >
                            <Option value="verified">Has WhatsApp</Option>
                            <Option value="not-verified">No WhatsApp</Option>
                            <Option value="not-checked">Not Checked</Option>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Has Website
                        </label>
                        <Select
                            placeholder="Filter by website"
                            style={{ width: '100%' }}
                            value={filters.hasWebsite || undefined}
                            onChange={(value) => updateFilter('hasWebsite', value || '')}
                            allowClear
                        >
                            <Option value="yes">Has Website</Option>
                            <Option value="no">No Website</Option>
                        </Select>
                    </div>
                </div>

                {/* Row 2: Rating */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Rating (min)
                        </label>
                        <InputNumber
                            min={0}
                            max={5}
                            step={0.1}
                            style={{ width: '100%' }}
                            value={filters.ratingMin}
                            placeholder="e.g. 3.5"
                            onChange={(value) => updateFilter('ratingMin', value ?? null)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Rating (max)
                        </label>
                        <InputNumber
                            min={0}
                            max={5}
                            step={0.1}
                            style={{ width: '100%' }}
                            value={filters.ratingMax}
                            placeholder="e.g. 4.8"
                            onChange={(value) => updateFilter('ratingMax', value ?? null)}
                        />
                    </div>
                </div>

                {/* Row 3: Reviews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Reviews (min)
                        </label>
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            value={filters.reviewsMin}
                            placeholder="e.g. 50"
                            onChange={(value) => updateFilter('reviewsMin', value ?? null)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Reviews (max)
                        </label>
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            value={filters.reviewsMax}
                            placeholder="e.g. 500"
                            onChange={(value) => updateFilter('reviewsMax', value ?? null)}
                        />
                    </div>
                </div>

                {/* Row 4: Has Phone & Has Verified WhatsApp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Has Phone Number
                        </label>
                        <Select
                            placeholder="Filter by phone"
                            style={{ width: '100%' }}
                            value={filters.hasPhone || undefined}
                            onChange={(value) => updateFilter('hasPhone', value || '')}
                            allowClear
                        >
                            <Option value="yes">Has Phone</Option>
                            <Option value="no">No Phone</Option>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Has Verified WhatsApp
                        </label>
                        <Select
                            placeholder="Filter by verified WhatsApp"
                            style={{ width: '100%' }}
                            value={filters.hasVerifiedWhatsApp || undefined}
                            onChange={(value) => updateFilter('hasVerifiedWhatsApp', value || '')}
                            allowClear
                        >
                            <Option value="yes">
                                <span className="flex items-center gap-2">
                                    <BsWhatsapp className="text-green-500" /> Has Verified WhatsApp
                                </span>
                            </Option>
                            <Option value="no">No Verified WhatsApp</Option>
                        </Select>
                    </div>
                </div>

                {/* Row 5: Favorites & Call Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Favorites
                        </label>
                        <Select
                            placeholder="Filter by favorites"
                            style={{ width: '100%' }}
                            value={filters.favorite || undefined}
                            onChange={(value) => updateFilter('favorite', value || '')}
                            allowClear
                        >
                            <Option value="yes">
                                <span className="flex items-center gap-2">
                                    <MdFavorite className="text-red-500" /> Favorites Only
                                </span>
                            </Option>
                            <Option value="no">Not Favorites</Option>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Call Status
                        </label>
                        <Select
                            placeholder="Filter by call status"
                            style={{ width: '100%' }}
                            value={filters.callStatus || undefined}
                            onChange={(value) => updateFilter('callStatus', value || '')}
                            allowClear
                        >
                            <Option value="not-called">Not Called</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="successful">Successful</Option>
                            <Option value="failed">Failed</Option>
                            <Option value="no-answer">No Answer</Option>
                            <Option value="callback">Callback</Option>
                            <Option value="interested">Interested</Option>
                            <Option value="not-interested">Not Interested</Option>
                        </Select>
                    </div>
                </div>

                {/* Row 6: Message Status & Lead Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Message Status
                        </label>
                        <Select
                            placeholder="Filter by message status"
                            style={{ width: '100%' }}
                            value={filters.messageStatus || undefined}
                            onChange={(value) => updateFilter('messageStatus', value || '')}
                            allowClear
                        >
                            <Option value="not-sent">Not Sent</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="sent">Sent</Option>
                            <Option value="delivered">Delivered</Option>
                            <Option value="read">Read</Option>
                            <Option value="failed">Failed</Option>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Lead Status
                        </label>
                        <Select
                            placeholder="Filter by lead status"
                            style={{ width: '100%' }}
                            value={filters.leadStatus || undefined}
                            onChange={(value) => updateFilter('leadStatus', value || '')}
                            allowClear
                        >
                            <Option value="not-reached">⏳ Not Reached</Option>
                            <Option value="interested">✅ Interested</Option>
                            <Option value="not-interested">❌ Not Interested</Option>
                            <Option value="no-response">📵 No Response</Option>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Clear Filters & Count */}
            <div className="mt-4 flex items-center justify-between">
                {hasActiveFilters && (
                    <Button
                        onClick={onClearFilters}
                        size="small"
                        className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                        Clear All Filters
                    </Button>
                )}
                <span className="text-gray-500 text-sm ml-auto">
                    Showing {filteredCount} of {totalCount} records
                </span>
            </div>
        </div>
    );
};

export default QualifiedLeadsFilters;
