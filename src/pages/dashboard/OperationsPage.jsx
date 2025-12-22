import React, { useEffect, useMemo, useState } from 'react';
import { Button, Input, Space, Table, Tag, message } from 'antd';
import { FiRefreshCw, FiArrowRightCircle } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const { Search } = Input;

const OperationsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [uniqueSearches, setUniqueSearches] = useState([]);
    const [uniqueCities, setUniqueCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');

    const fetchUniqueSearches = async () => {
        if (!user?._id && !user?.id) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/data/unique/${user._id || user.id}`);
            if (response.data?.success) {
                setUniqueSearches(response.data.data || []);
            } else {
                message.error(response.data?.message || 'Failed to load operations');
            }

            // Fetch unique cities from getData API
            const dataResponse = await axios.get(`${BASE_URL}/api/data/${user._id || user.id}?limit=1000`);
            if (dataResponse.data?.success && dataResponse.data?.uniqueCities) {
                setUniqueCities(dataResponse.data.uniqueCities || []);
            }
        } catch (error) {
            console.error('Failed to load operations overview:', error);
            message.error(error.response?.data?.message || 'Unable to fetch operations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUniqueSearches();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id, user?.id]);

    const filteredSearches = useMemo(() => {
        if (!keyword.trim()) {
            return uniqueSearches;
        }
        const lower = keyword.toLowerCase();
        return uniqueSearches.filter(item => item.searchString?.toLowerCase().includes(lower));
    }, [keyword, uniqueSearches]);

    const columns = [
        {
            title: '#',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'searchString',
            key: 'searchString',
            render: (value) => <span className="text-gray-800 font-medium">{value}</span>,
        },
        {
            title: 'Results Collected',
            dataIndex: 'count',
            key: 'count',
            sorter: (a, b) => (a.count || 0) - (b.count || 0),
        },
        {
            title: 'Last Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (value) => {
                if (!value) return '-';
                const date = new Date(value);
                const options = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                };
                const formattedDate = date.toLocaleString('en-US', options);
                // Format: "December 10, 2025, 11:38 AM" -> "December 10, 2025 at 11:38 AM"
                return formattedDate.replace(/, (\d{4}), /, ', $1 at ');
            },
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    className="bg-primary hover:bg-primary border-[#0F792C] rounded-full"
                    type="primary"
                    icon={<FiArrowRightCircle />}
                    onClick={() => navigate(`/dashboard/operations/${record.id}`)}
                >
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Operations Overview</h1>
                    <p className="text-gray-600">Review each unique search and drill into the full dataset.</p>
                </div>
                <Space>
                    <Button
                        icon={<FiRefreshCw />}
                        onClick={fetchUniqueSearches}
                        loading={loading}
                    >
                        Refresh
                    </Button>
                </Space>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                        <p className="text-sm text-gray-500">Total Searches</p>
                        <p className="text-3xl font-semibold text-[#0F792C]">{uniqueSearches.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Unique Cities</p>
                        <p className="text-3xl font-semibold text-[#0F792C]">{uniqueCities.length}</p>
                    </div>
                </div>
                <Search
                    placeholder="Search by query..."
                    allowClear
                    onSearch={setKeyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full md:w-96"
                    size="large"
                />
            </div>

            {uniqueCities.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Cities & Locations</h3>
                    <div className="flex flex-wrap gap-2">
                        {uniqueCities.map((city, index) => (
                            <Tag key={index} color="green" className="text-sm py-1 px-3">
                                {city}
                            </Tag>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
                <style>{`
                    .ant-pagination {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                    }
                    .ant-pagination-prev,
                    .ant-pagination-next {
                        border-radius: 20px !important;
                        background: #0F792C !important;
                        border: none !important;
                        height: 36px !important;
                        min-width: 90px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    }
                    .ant-pagination-prev button,
                    .ant-pagination-next button {
                        color: white !important;
                        font-weight: 500 !important;
                    }
                    .ant-pagination-prev:hover,
                    .ant-pagination-next:hover {
                        background: #0a5a20 !important;
                    }
                    .ant-pagination-disabled {
                        background: #d1d5db !important;
                        opacity: 0.5 !important;
                    }
                    .ant-pagination-item {
                        border-radius: 50% !important;
                        border: none !important;
                        background: white !important;
                        width: 36px !important;
                        height: 36px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        font-weight: 500 !important;
                    }
                    .ant-pagination-item:hover {
                        background: #f3f4f6 !important;
                    }
                    .ant-pagination-item-active {
                        background: #0F792C !important;
                        border: none !important;
                    }
                    .ant-pagination-item-active a {
                        color: white !important;
                    }
                    .ant-pagination-item a {
                        color: #374151 !important;
                    }
                `}</style>
                <Table
                    rowKey={(record) => record.id || record._id}
                    columns={columns}
                    dataSource={filteredSearches}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: false,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                />
            </div>
        </div>
    );
};

export default OperationsPage;
