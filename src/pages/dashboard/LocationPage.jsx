import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './../../config/URL';
import { Input, Button, Table, Card, message, InputNumber, Tag, Empty, Tabs } from 'antd';
import { FiSearch, FiMapPin, FiGlobe, FiNavigation } from 'react-icons/fi';

const LocationPage = () => {
    // State search state
    const [searchName, setSearchName] = useState('');
    const [searchCountry, setSearchCountry] = useState('');
    const [searchLimit, setSearchLimit] = useState(50);
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [resultInfo, setResultInfo] = useState(null);

    // City neighbors state
    const [cityName, setCityName] = useState('');
    const [neighborCountry, setNeighborCountry] = useState('');
    const [neighborLimit, setNeighborLimit] = useState(20);
    const [neighborRadius, setNeighborRadius] = useState(null);
    const [neighbors, setNeighbors] = useState([]);
    const [targetCity, setTargetCity] = useState(null);
    const [neighborsLoading, setNeighborsLoading] = useState(false);

    // Search cities by admin_name (state/region)
    const handleSearch = async () => {
        if (!searchName) {
            message.warning('Please enter a state/region name');
            return;
        }

        setSearchLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('name', searchName);
            if (searchCountry) params.append('country', searchCountry);
            if (searchLimit) params.append('limit', searchLimit);

            const res = await axios.get(`${BASE_URL}/api/location/neighbors?${params.toString()}`);
            if (res.data.success) {
                setSearchResults(res.data.cities);
                setResultInfo({
                    admin_name: res.data.admin_name,
                    country: res.data.country,
                    count: res.data.count
                });
                message.success(`Found ${res.data.count} cities in ${res.data.admin_name}`);
            }
        } catch (err) {
            message.error(err.response?.data?.message || 'Failed to search cities');
            setSearchResults([]);
            setResultInfo(null);
        }
        setSearchLoading(false);
    };

    // Find neighbors of a city
    const handleFindNeighbors = async () => {
        if (!cityName) {
            message.warning('Please enter a city name');
            return;
        }

        setNeighborsLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('city', cityName);
            if (neighborCountry) params.append('country', neighborCountry);
            if (neighborLimit) params.append('limit', neighborLimit);
            if (neighborRadius) params.append('radius', neighborRadius);

            const res = await axios.get(`${BASE_URL}/api/location/city-neighbors?${params.toString()}`);
            if (res.data.success) {
                setNeighbors(res.data.neighbors);
                setTargetCity(res.data.target);
                message.success(`Found ${res.data.count} neighboring cities`);
            }
        } catch (err) {
            message.error(err.response?.data?.message || 'Failed to find neighbors');
            setNeighbors([]);
            setTargetCity(null);
        }
        setNeighborsLoading(false);
    };

    // Table columns for state search
    const stateColumns = [
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
            render: (text, record) => (
                <div>
                    <div className="font-medium text-gray-800">{text}</div>
                    {record.city_ascii !== text && (
                        <div className="text-xs text-gray-500">{record.city_ascii}</div>
                    )}
                </div>
            ),
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            render: (text, record) => (
                <div>
                    <div>{text}</div>
                    <div className="text-xs text-gray-500">{record.iso2} / {record.iso3}</div>
                </div>
            ),
        },
        {
            title: 'State/Region',
            dataIndex: 'admin_name',
            key: 'admin_name',
            render: (text) => text || '-',
        },
        {
            title: 'Coordinates',
            key: 'coordinates',
            render: (_, record) => (
                <div className="text-sm">
                    <span className="text-gray-600">Lat:</span> {record.lat?.toFixed(4)}<br />
                    <span className="text-gray-600">Lng:</span> {record.lng?.toFixed(4)}
                </div>
            ),
        },
        {
            title: 'Population',
            dataIndex: 'population',
            key: 'population',
            render: (pop) => pop ? pop.toLocaleString() : '-',
            sorter: (a, b) => (a.population || 0) - (b.population || 0),
        },
        {
            title: 'Capital',
            dataIndex: 'capital',
            key: 'capital',
            render: (text) => text ? <Tag color="blue">{text}</Tag> : '-',
        },
    ];

    // Table columns for city neighbors (with distance)
    const neighborColumns = [
        {
            title: 'Distance',
            dataIndex: 'distance_km',
            key: 'distance_km',
            width: 100,
            render: (dist) => (
                <Tag color="green">{dist} km</Tag>
            ),
            sorter: (a, b) => a.distance_km - b.distance_km,
        },
        ...stateColumns,
    ];

    const tabItems = [
        {
            key: 'state',
            label: (
                <span className="flex items-center gap-2">
                    <FiMapPin /> Search by State/Region
                </span>
            ),
            children: (
                <div className="space-y-4">
                    {/* Search Form */}
                    <div className="flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">State/Region Name *</label>
                            <Input
                                placeholder="e.g. California, Punjab, Tokyo..."
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                onPressEnter={handleSearch}
                                prefix={<FiMapPin className="text-gray-400" />}
                                style={{ width: 250 }}
                                allowClear
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Country (optional)</label>
                            <Input
                                placeholder="Filter by country..."
                                value={searchCountry}
                                onChange={(e) => setSearchCountry(e.target.value)}
                                onPressEnter={handleSearch}
                                prefix={<FiGlobe className="text-gray-400" />}
                                style={{ width: 180 }}
                                allowClear
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Limit</label>
                            <InputNumber
                                min={1}
                                max={1000}
                                value={searchLimit}
                                onChange={setSearchLimit}
                                style={{ width: 100 }}
                            />
                        </div>
                        <Button
                            type="primary"
                            icon={<FiSearch />}
                            onClick={handleSearch}
                            loading={searchLoading}
                        >
                            Search
                        </Button>
                    </div>

                    {/* Result Info */}
                    {resultInfo && (
                        <Card size="small" className="bg-purple-50 border-purple-200">
                            <div className="flex items-center gap-4">
                                <FiMapPin className="text-purple-600 text-xl" />
                                <div>
                                    <div className="font-medium text-purple-800">
                                        {resultInfo.admin_name}, {resultInfo.country}
                                    </div>
                                    <div className="text-sm text-purple-600">
                                        Found {resultInfo.count} cities
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Results Table */}
                    <Table
                        columns={stateColumns}
                        dataSource={searchResults}
                        loading={searchLoading}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} cities`,
                            showSizeChanger: true,
                        }}
                        locale={{
                            emptyText: <Empty description="Enter a state/region name to search" />
                        }}
                    />
                </div>
            ),
        },
        {
            key: 'neighbors',
            label: (
                <span className="flex items-center gap-2">
                    <FiNavigation /> Find City Neighbors
                </span>
            ),
            children: (
                <div className="space-y-4">
                    {/* Neighbors Search Form */}
                    <div className="flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">City Name *</label>
                            <Input
                                placeholder="e.g. San Jose, London, Tokyo..."
                                value={cityName}
                                onChange={(e) => setCityName(e.target.value)}
                                onPressEnter={handleFindNeighbors}
                                prefix={<FiNavigation className="text-gray-400" />}
                                style={{ width: 250 }}
                                allowClear
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Filter by Country</label>
                            <Input
                                placeholder="Filter neighbors..."
                                value={neighborCountry}
                                onChange={(e) => setNeighborCountry(e.target.value)}
                                onPressEnter={handleFindNeighbors}
                                prefix={<FiGlobe className="text-gray-400" />}
                                style={{ width: 180 }}
                                allowClear
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Limit</label>
                            <InputNumber
                                min={1}
                                max={100}
                                value={neighborLimit}
                                onChange={setNeighborLimit}
                                style={{ width: 80 }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Radius (km)</label>
                            <InputNumber
                                min={1}
                                placeholder="No limit"
                                value={neighborRadius}
                                onChange={setNeighborRadius}
                                style={{ width: 120 }}
                            />
                        </div>
                        <Button
                            type="primary"
                            icon={<FiSearch />}
                            onClick={handleFindNeighbors}
                            loading={neighborsLoading}
                        >
                            Find Neighbors
                        </Button>
                    </div>

                    {/* Target City Info */}
                    {targetCity && (
                        <Card size="small" className="bg-blue-50 border-blue-200">
                            <div className="flex items-center gap-4">
                                <FiNavigation className="text-blue-600 text-xl" />
                                <div>
                                    <div className="font-medium text-blue-800">
                                        {targetCity.city}, {targetCity.admin_name}, {targetCity.country}
                                    </div>
                                    <div className="text-sm text-blue-600">
                                        Lat: {targetCity.lat?.toFixed(4)}, Lng: {targetCity.lng?.toFixed(4)}
                                        {targetCity.population && ` • Population: ${targetCity.population.toLocaleString()}`}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Neighbors Table */}
                    <Table
                        columns={neighborColumns}
                        dataSource={neighbors}
                        loading={neighborsLoading}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} neighboring cities`,
                            showSizeChanger: true,
                        }}
                        locale={{
                            emptyText: <Empty description="Enter a city name to find its neighbors" />
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Location Finder</h1>
                    <p className="text-gray-600 mt-1">Search cities by state/region or find neighboring cities</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <Tabs items={tabItems} />
            </div>
        </div>
    );
};

export default LocationPage;
