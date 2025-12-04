/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { Table, Select, Button, Space, Tag, message, Spin } from 'antd';
import { FiRefreshCw, FiExternalLink, FiCheck, FiX } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';
import countries from '../../data/countries';
import ukCities from '../../data/uk';

const { Option } = Select;

const OperationsPage = () => {
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        categories: [],
        countries: [],
        states: [],
        cities: [],
        whatsappStatus: '' // 'verified', 'not-verified', 'not-checked'
    });
    const [whatsappStatus, setWhatsappStatus] = useState({}); // { phone: 'verified'|'not-verified'|'checking' }
    const { user } = useAuth();

    // Fetch scraped data
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/data/${user._id || user.id}`);
            setData(res.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            message.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/category`);
            setCategories(res.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
            fetchCategories();
        }
    }, [user]);

    // Listen for WhatsApp verification results from Chrome extension
    useEffect(() => {
        const handleMessage = (event) => {
            // Only accept messages from the extension
            if (event.data.type === 'WHATSAPP_RESULT') {
                const { phone, exists } = event.data;
                setWhatsappStatus(prev => ({
                    ...prev,
                    [phone]: exists === true ? 'verified' : exists === false ? 'not-verified' : 'unknown'
                }));
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Verify WhatsApp number
    const verifyWhatsAppNumber = async (phone) => {
        if (!phone) {
            message.warning('No phone number available');
            return;
        }

        // Set checking status
        setWhatsappStatus(prev => ({ ...prev, [phone]: 'checking' }));

        try {
            // Send message to Chrome extension
            const extensionId = chrome?.runtime?.id;

            if (!extensionId) {
                message.error('Chrome extension not detected. Please install the extension.');
                setWhatsappStatus(prev => ({ ...prev, [phone]: 'unknown' }));
                return;
            }

            chrome.runtime.sendMessage(
                {
                    type: 'VERIFY_WHATSAPP',
                    number: phone
                },
                (response) => {
                    if (chrome.runtime.lastError) {
                        console.error('Extension error:', chrome.runtime.lastError);
                        message.error('Failed to verify WhatsApp number');
                        setWhatsappStatus(prev => ({ ...prev, [phone]: 'unknown' }));
                        return;
                    }

                    if (response && response.exists !== undefined) {
                        const status = response.exists === true ? 'verified' :
                            response.exists === false ? 'not-verified' : 'unknown';
                        setWhatsappStatus(prev => ({ ...prev, [phone]: status }));

                        if (status === 'verified') {
                            message.success('WhatsApp number verified!');
                        } else if (status === 'not-verified') {
                            message.info('Number does not have WhatsApp');
                        } else {
                            message.warning('Could not verify WhatsApp status');
                        }
                    }
                }
            );
        } catch (error) {
            console.error('Verification error:', error);
            message.error('Failed to verify WhatsApp number');
            setWhatsappStatus(prev => ({ ...prev, [phone]: 'unknown' }));
        }
    };

    // Verify all unverified numbers
    const verifyAllNumbers = async (phoneNumbers) => {
        if (!phoneNumbers || phoneNumbers.length === 0) {
            message.warning('No phone numbers to verify');
            return;
        }

        // Check if extension is available
        const extensionId = chrome?.runtime?.id;
        if (!extensionId) {
            message.error('Chrome extension not detected. Please install the extension.');
            return;
        }

        message.info(`Verifying ${phoneNumbers.length} phone numbers...`);

        // Verify numbers one by one with delay to avoid rate limiting
        for (let i = 0; i < phoneNumbers.length; i++) {
            const phone = phoneNumbers[i];

            // Skip if already verified or checking
            if (whatsappStatus[phone]) continue;

            // Add delay between verifications (5 seconds)
            if (i > 0) {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }

            await verifyWhatsAppNumber(phone);
        }
    };

    // Auto-verify when WhatsApp filter is set to 'verified'
    useEffect(() => {
        if (filters.whatsappStatus === 'verified') {
            // Get all phone numbers from current filtered data (excluding WhatsApp filter)
            const tempFilters = { ...filters, whatsappStatus: '' };
            const currentData = getFlattenedData();

            // Apply other filters first
            let filtered = currentData;

            if (tempFilters.categories.length > 0) {
                filtered = filtered.filter(item =>
                    tempFilters.categories.some(catId => {
                        const category = categories.find(c => c._id === catId);
                        return category && item.searchString?.toLowerCase().includes(category.name.toLowerCase());
                    })
                );
            }

            if (tempFilters.countries.length > 0) {
                filtered = filtered.filter(item =>
                    tempFilters.countries.some(country => {
                        const lowerCountry = country.toLowerCase();
                        return item.searchString?.toLowerCase().includes(lowerCountry) ||
                            item.address?.toLowerCase().includes(lowerCountry);
                    })
                );
            }

            if (tempFilters.states.length > 0) {
                filtered = filtered.filter(item =>
                    tempFilters.states.some(state => {
                        const lowerState = state.toLowerCase();
                        return item.searchString?.toLowerCase().includes(lowerState) ||
                            item.address?.toLowerCase().includes(lowerState);
                    })
                );
            }

            if (tempFilters.cities.length > 0) {
                filtered = filtered.filter(item =>
                    tempFilters.cities.some(city => {
                        const lowerCity = city.toLowerCase();
                        return item.searchString?.toLowerCase().includes(lowerCity) ||
                            item.address?.toLowerCase().includes(lowerCity);
                    })
                );
            }

            // Get unique phone numbers that haven't been verified
            const phoneNumbers = [...new Set(
                filtered
                    .map(item => item.phone)
                    .filter(phone => phone && !whatsappStatus[phone])
            )];

            if (phoneNumbers.length > 0) {
                verifyAllNumbers(phoneNumbers);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.whatsappStatus]);



    // Get all unique countries from data
    const getAllCountries = () => {
        const countryNames = countries.map(c => c.name);
        countryNames.push('United Kingdom');
        return countryNames;
    };

    // Get all states for selected countries
    const getAllStates = () => {
        const states = new Set();
        countries.forEach(country => {
            if (filters.countries.length === 0 || filters.countries.includes(country.name)) {
                if (country.states) {
                    country.states.forEach(state => states.add(state.name));
                }
            }
        });
        return Array.from(states);
    };

    // Get all cities for selected states
    const getAllCities = () => {
        const cities = new Set();

        countries.forEach(country => {
            if (filters.countries.length === 0 || filters.countries.includes(country.name)) {
                if (country.states) {
                    country.states.forEach(state => {
                        if (filters.states.length === 0 || filters.states.includes(state.name)) {
                            state.cities.forEach(city => cities.add(city));
                        }
                    });
                }
            }
        });

        // Add UK cities if UK is selected or no country filter
        if (filters.countries.length === 0 || filters.countries.includes('United Kingdom')) {
            ukCities.forEach(city => cities.add(city));
        }

        return Array.from(cities);
    };

    // Flatten data for table display
    const getFlattenedData = () => {
        const flattened = [];
        data.forEach(record => {
            if (record.data && Array.isArray(record.data)) {
                record.data.forEach((item, index) => {
                    flattened.push({
                        key: `${record._id}-${index}`,
                        recordId: record._id,
                        searchString: record.searchString,
                        createdAt: record.createdAt,
                        ...item
                    });
                });
            }
        });
        return flattened;
    };

    // Apply filters
    const getFilteredData = () => {
        let filtered = getFlattenedData();

        // Filter by categories (match with searchString)
        if (filters.categories.length > 0) {
            filtered = filtered.filter(item =>
                filters.categories.some(catId => {
                    const category = categories.find(c => c._id === catId);
                    return category && item.searchString?.toLowerCase().includes(category.name.toLowerCase());
                })
            );
        }

        // Filter by countries (match in searchString or address)
        if (filters.countries.length > 0) {
            filtered = filtered.filter(item =>
                filters.countries.some(country => {
                    const lowerCountry = country.toLowerCase();
                    return item.searchString?.toLowerCase().includes(lowerCountry) ||
                        item.address?.toLowerCase().includes(lowerCountry);
                })
            );
        }

        // Filter by states (match in searchString or address)
        if (filters.states.length > 0) {
            filtered = filtered.filter(item =>
                filters.states.some(state => {
                    const lowerState = state.toLowerCase();
                    return item.searchString?.toLowerCase().includes(lowerState) ||
                        item.address?.toLowerCase().includes(lowerState);
                })
            );
        }

        // Filter by cities (match in searchString or address)
        if (filters.cities.length > 0) {
            filtered = filtered.filter(item =>
                filters.cities.some(city => {
                    const lowerCity = city.toLowerCase();
                    return item.searchString?.toLowerCase().includes(lowerCity) ||
                        item.address?.toLowerCase().includes(lowerCity);
                })
            );
        }

        // Filter by WhatsApp status
        if (filters.whatsappStatus) {
            filtered = filtered.filter(item => {
                const status = whatsappStatus[item.phone];
                if (filters.whatsappStatus === 'verified') {
                    return status === 'verified';
                } else if (filters.whatsappStatus === 'not-verified') {
                    return status === 'not-verified';
                } else if (filters.whatsappStatus === 'not-checked') {
                    return !status || status === 'unknown';
                }
                return true;
            });
        }

        return filtered;
    };

    const columns = [
        {
            title: '#',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Search Query',
            dataIndex: 'searchString',
            key: 'searchString',
            width: 150,
            render: (text) => <Tag color="purple">{text}</Tag>,
        },
        {
            title: 'Business Name',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            sorter: (a, b) => (a.title || '').localeCompare(b.title || ''),
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            width: 80,
            render: (rating) => rating ? (
                <Tag color="gold">⭐ {rating}</Tag>
            ) : '-',
            sorter: (a, b) => (parseFloat(a.rating) || 0) - (parseFloat(b.rating) || 0),
        },
        {
            title: 'Reviews',
            dataIndex: 'reviews',
            key: 'reviews',
            width: 80,
            sorter: (a, b) => (parseInt(a.reviews) || 0) - (parseInt(b.reviews) || 0),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
            render: (phone) => phone || '-',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 250,
            ellipsis: true,
            render: (address) => address || '-',
        },
        {
            title: 'Website',
            dataIndex: 'website',
            key: 'website',
            width: 100,
            render: (website) => website ? (
                <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    <FiExternalLink className="inline" /> Link
                </a>
            ) : '-',
        },
        {
            title: 'Google Maps',
            dataIndex: 'googleMapsLink',
            key: 'googleMapsLink',
            width: 120,
            render: (link) => link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
                    <FiExternalLink className="inline" /> View
                </a>
            ) : '-',
        },
        {
            title: 'WhatsApp',
            dataIndex: 'phone',
            key: 'whatsapp',
            width: 120,
            render: (phone) => {
                if (!phone) return <Tag color="default">N/A</Tag>;

                const status = whatsappStatus[phone];

                if (status === 'checking') {
                    return <Spin size="small" />;
                }

                if (status === 'verified') {
                    return (
                        <Space>
                            <Tag color="success" icon={<FiCheck />}>Verified</Tag>
                        </Space>
                    );
                }

                if (status === 'not-verified') {
                    return (
                        <Space>
                            <Tag color="error" icon={<FiX />}>Not on WhatsApp</Tag>
                        </Space>
                    );
                }

                return (
                    <Button
                        size="small"
                        icon={<BsWhatsapp />}
                        onClick={() => verifyWhatsAppNumber(phone)}
                    >
                        Check
                    </Button>
                );
            },
        },
        {
            title: 'Scraped Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
    ];

    const filteredData = getFilteredData();

    return (
        <div className="space-y-6 overflow-x-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Operations</h1>
                    <p className="text-gray-600 mt-1">View and manage scraped data</p>
                </div>
                <Button
                    type="primary"
                    icon={<FiRefreshCw />}
                    onClick={fetchData}
                    loading={loading}
                >
                    Refresh
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>
                <div className="space-y-4">
                    {/* First Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <Select
                                mode="multiple"
                                placeholder="Select categories"
                                style={{ width: '100%' }}
                                value={filters.categories}
                                onChange={(value) => setFilters({ ...filters, categories: value })}
                            >
                                {categories.map(cat => (
                                    <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                            </label>
                            <Select
                                mode="multiple"
                                placeholder="Select countries"
                                style={{ width: '100%' }}
                                value={filters.countries}
                                onChange={(value) => setFilters({ ...filters, countries: value, states: [], cities: [] })}
                            >
                                {getAllCountries().map(country => (
                                    <Option key={country} value={country}>{country}</Option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State
                            </label>
                            <Select
                                mode="multiple"
                                placeholder="Select states"
                                style={{ width: '100%' }}
                                value={filters.states}
                                onChange={(value) => setFilters({ ...filters, states: value, cities: [] })}
                                disabled={filters.countries.length === 0}
                            >
                                {getAllStates().map(state => (
                                    <Option key={state} value={state}>{state}</Option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>
                            <Select
                                mode="multiple"
                                placeholder="Select cities"
                                style={{ width: '100%' }}
                                value={filters.cities}
                                onChange={(value) => setFilters({ ...filters, cities: value })}
                                disabled={filters.countries.length === 0}
                            >
                                {getAllCities().map(city => (
                                    <Option key={city} value={city}>{city}</Option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    {/* Third Row - WhatsApp Filter */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                WhatsApp Status
                            </label>
                            <Select
                                placeholder="Filter by WhatsApp status"
                                style={{ width: '100%' }}
                                value={filters.whatsappStatus}
                                onChange={(value) => setFilters({ ...filters, whatsappStatus: value })}
                                allowClear
                            >
                                <Option value="verified">Has WhatsApp</Option>
                                <Option value="not-verified">No WhatsApp</Option>
                                <Option value="not-checked">Not Checked</Option>
                            </Select>
                        </div>
                    </div>
                </div>

                {(filters.categories.length > 0 || filters.countries.length > 0 ||
                    filters.states.length > 0 || filters.cities.length > 0 || filters.whatsappStatus) && (
                        <div className="mt-4">
                            <Button
                                onClick={() => setFilters({ categories: [], countries: [], states: [], cities: [], whatsappStatus: '' })}
                                size="small"
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    scroll={{ x: 1500 }}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} records`,
                    }}
                />
            </div>
        </div>
    );
};

export default OperationsPage;
