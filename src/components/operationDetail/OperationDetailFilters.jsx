import React from 'react';
import { Button, Input, InputNumber, Select } from 'antd';
import { MdSearch, MdFavorite } from 'react-icons/md';
import { DEFAULT_FILTERS } from './constants';
import { hasActiveFilters } from './leadFilters';

const { Option } = Select;

export default function OperationDetailFilters({ filters, setFilters }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100 table-container">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <MdSearch className="text-primary text-xl" />
        </div>
        Smart Filters
      </h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Location</label>
            <Input
              placeholder="Search City, State or Country..."
              value={filters.locationSearch}
              onChange={(e) => setFilters({ ...filters, locationSearch: e.target.value })}
              prefix={<MdSearch className="text-gray-400" />}
              allowClear
              className="h-12 border-gray-200 rounded-xl hover:border-primary focus:border-primary transition-all shadow-sm"
            />
          </div>

          <FilterSelect
            label="WhatsApp Availability"
            placeholder="Choose status"
            value={filters.whatsappStatus}
            onChange={(value) => setFilters({ ...filters, whatsappStatus: value || '' })}
            options={[
              ['verified', 'Authorized WhatsApp'],
              ['not-verified', 'Unavailable'],
              ['not-checked', 'Pending Check'],
            ]}
          />

          <FilterSelect
            label="Website"
            placeholder="Website status"
            value={filters.hasWebsite}
            onChange={(value) => setFilters({ ...filters, hasWebsite: value || '' })}
            options={[
              ['yes', 'Has Website'],
              ['no', 'No Website'],
            ]}
          />

          <FilterSelect
            label="Favorites"
            placeholder="Collection status"
            value={filters.favorite}
            onChange={(value) => setFilters({ ...filters, favorite: value || '' })}
            options={[
              ['yes', <span key="fav" className="flex items-center gap-2"><MdFavorite className="text-red-500" /> Favorites Only</span>],
              ['no', 'All Leads'],
            ]}
          />

          <FilterSelect
            label="Minimum Rating"
            placeholder="Choose rating"
            value={filters.ratingMin !== null ? filters.ratingMin : undefined}
            onChange={(value) => setFilters({ ...filters, ratingMin: value ?? null })}
            options={[0, 1, 2, 3, 4, 5].map((val) => [val, `${val}.0+`])}
          />

          <FilterSelect
            label="Maximum Rating"
            placeholder="Choose rating"
            value={filters.ratingMax !== null ? filters.ratingMax : undefined}
            onChange={(value) => setFilters({ ...filters, ratingMax: value ?? null })}
            options={[0, 1, 2, 3, 4, 5].map((val) => [val, `${val}.0`])}
          />

          <FilterSelect
            label="Contact Discovery"
            placeholder="Phone availability"
            value={filters.hasPhone}
            onChange={(value) => setFilters({ ...filters, hasPhone: value || '' })}
            options={[
              ['yes', 'With Phone'],
              ['no', 'Missing Phone'],
            ]}
          />

          <FilterSelect
            label="Has Email"
            placeholder="Email availability"
            value={filters.hasEmail}
            onChange={(value) => setFilters({ ...filters, hasEmail: value || '' })}
            options={[
              ['yes', 'With Email'],
              ['no', 'Missing Email'],
            ]}
          />

          <FilterSelect
            label="Has Socials"
            placeholder="Socials availability"
            value={filters.hasSocials}
            onChange={(value) => setFilters({ ...filters, hasSocials: value || '' })}
            options={[
              ['yes', 'With Socials'],
              ['no', 'Missing Socials'],
            ]}
          />

          <FilterSelect
            label="Website Ads Status"
            placeholder="Ads availability"
            value={filters.addsRunning}
            onChange={(value) => setFilters({ ...filters, addsRunning: value || '' })}
            options={[
              ['running', 'Running Ads'],
              ['not-running', 'No Ads'],
              ['not-available', 'Not Available'],
            ]}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Reviews</label>
            <InputNumber
              placeholder="Min reviews"
              className="w-full h-12 border-gray-200 rounded-xl shadow-sm flex items-center"
              value={filters.reviewsMin}
              onChange={(val) => setFilters({ ...filters, reviewsMin: val })}
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Reviews</label>
            <InputNumber
              placeholder="Max reviews"
              className="w-full h-12 border-gray-200 rounded-xl shadow-sm flex items-center"
              value={filters.reviewsMax}
              onChange={(val) => setFilters({ ...filters, reviewsMax: val })}
              min={0}
            />
          </div>
        </div>
      </div>

      {hasActiveFilters(filters) && (
        <div className="mt-4">
          <Button onClick={() => setFilters({ ...DEFAULT_FILTERS })} size="small" className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, placeholder, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <Select
        placeholder={placeholder}
        style={{ width: '100%' }}
        value={value || undefined}
        onChange={onChange}
        allowClear
        className="custom-select-premium h-12"
      >
        {options.map(([val, text]) => (
          <Option key={val} value={val}>
            {text}
          </Option>
        ))}
      </Select>
    </div>
  );
}
