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
            title: 'Search String',
            dataIndex: 'searchString',
            key: 'searchString',
            render: (value) => <Tag color="purple">{value}</Tag>,
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
            render: (value) => value ? new Date(value).toLocaleString() : '-',
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
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
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Total Searches</p>
                        <p className="text-3xl font-semibold">{uniqueSearches.length}</p>
                    </div>
                    <Search
                        placeholder="Search by query..."
                        allowClear
                        onSearch={setKeyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        style={{ maxWidth: 320 }}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <Table
                    rowKey={(record) => record.id || record._id}
                    columns={columns}
                    dataSource={filteredSearches}
                    loading={loading}
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                />
            </div>
        </div>
    );
};

export default OperationsPage;
