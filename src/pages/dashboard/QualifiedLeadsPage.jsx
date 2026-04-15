import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Table, Tag, message, Popconfirm, Empty, Modal, Form } from 'antd';
import { FiRefreshCw, FiArrowRightCircle, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { MdStar, MdFilterList } from 'react-icons/md';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';


const { Search } = Input;

const QualifiedLeadsPage = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [qualifiedLeads, setQualifiedLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [keyword, setKeyword] = useState('');

    // Edit modal state
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [form] = Form.useForm();

    // Fetch qualified leads
    const fetchQualifiedLeads = async () => {
        if (!user?._id && !user?.id) return;

        setLoading(true);
        try {
            const userId = user._id || user.id;
            const res = await axios.get(`${BASE_URL}/api/qualified-leads/get/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data) {
                setQualifiedLeads(res.data);
                setFilteredLeads(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch qualified leads:', error);
            message.error('Failed to fetch qualified leads');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQualifiedLeads();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Handle Search
    const handleSearch = (value) => {
        setKeyword(value);
        if (!value) {
            setFilteredLeads(qualifiedLeads);
        } else {
            const filtered = qualifiedLeads.filter(lead =>
                lead.name?.toLowerCase().includes(value.toLowerCase()) ||
                lead.searchString?.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredLeads(filtered);
        }
    };

    // Handle Delete
    const handleDelete = async (record) => {
        const leadId = record._id;
        if (!leadId) {
            message.error('No lead selected');
            return;
        }

        setDeleteLoading(leadId);
        try {
            const res = await axios.delete(
                `${BASE_URL}/api/qualified-leads/delete/${leadId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                message.success('Qualified lead deleted successfully');
                fetchQualifiedLeads();
            }
        } catch (error) {
            console.error('Delete failed:', error);
            message.error(error.response?.data?.message || 'Failed to delete qualified lead');
        } finally {
            setDeleteLoading(null);
        }
    };

    // Handle Edit
    const handleEditClick = (record) => {
        setSelectedLead(record);
        form.setFieldsValue({ name: record.name });
        setEditModalVisible(true);
    };

    const handleEditSave = async (values) => {
        if (!selectedLead?._id) return;

        setEditLoading(true);
        try {
            const res = await axios.put(
                `${BASE_URL}/api/qualified-leads/update/${selectedLead._id}`,
                { name: values.name },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data) {
                message.success('Qualified lead updated successfully');
                setEditModalVisible(false);
                setSelectedLead(null);
                form.resetFields();
                fetchQualifiedLeads();
            }
        } catch (error) {
            console.error('Update failed:', error);
            message.error(error.response?.data?.message || 'Failed to update qualified lead');
        } finally {
            setEditLoading(false);
        }
    };

    // Get active filters display
    const getActiveFiltersCount = (filters) => {
        if (!filters) return 0;
        let count = 0;
        if (filters.locationSearch) count++;
        if (filters.whatsappStatus) count++;
        if (filters.ratingMin !== null && filters.ratingMin !== undefined) count++;
        if (filters.ratingMax !== null && filters.ratingMax !== undefined) count++;
        if (filters.reviewsMin !== null && filters.reviewsMin !== undefined) count++;
        if (filters.reviewsMax !== null && filters.reviewsMax !== undefined) count++;
        if (filters.hasWebsite) count++;
        if (filters.hasPhone) count++;
        if (filters.favorite) count++;
        return count;
    };

    const columns = [
        {
            title: '#',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (value) => (
                <div className="flex items-center gap-2">
                    <MdStar className="text-yellow-500" />
                    <span className="text-gray-800 font-medium">{value}</span>
                </div>
            ),
        },
        {
            title: 'Search Query',
            dataIndex: 'searchString',
            key: 'searchString',
            render: (value) => value ? <Tag color="blue">{value}</Tag> : '-',
        },
        {
            title: 'Total Records',
            dataIndex: 'totalRecords',
            key: 'totalRecords',
            render: (value) => <span className="font-semibold text-green-600">{value || 0}</span>,
            sorter: (a, b) => (a.totalRecords || 0) - (b.totalRecords || 0),
        },
        {
            title: 'Filters Applied',
            dataIndex: 'filters',
            key: 'filters',
            render: (filters) => {
                const count = getActiveFiltersCount(filters);
                return count > 0 ? (
                    <Tag color="purple" icon={<MdFilterList />}>
                        {count} filter{count > 1 ? 's' : ''}
                    </Tag>
                ) : <span className="text-gray-400">None</span>;
            },
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => {
                if (!value) return '-';
                const date = new Date(value);
                const options = {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                };
                return date.toLocaleString('en-US', options);
            },
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        className="bg-primary hover:bg-primary border-[#0F792C] rounded-full"
                        type="primary"
                        icon={<FiArrowRightCircle />}
                        onClick={() => navigate(`/dashboard/qualified-leads/${record._id}`)}
                    >
                        View Details
                    </Button>
                    <Button
                        icon={<FiEdit2 />}
                        onClick={() => handleEditClick(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Qualified Lead"
                        description="Are you sure you want to delete this qualified lead list?"
                        onConfirm={() => handleDelete(record)}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            icon={<FiTrash2 />}
                            loading={deleteLoading === record._id}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MdStar className="text-yellow-500" />
                        Qualified Leads
                    </h1>
                    <p className="text-gray-600">View and manage your saved qualified lead lists.</p>
                </div>
                <Space>
                    <Button
                        icon={<FiRefreshCw />}
                        onClick={fetchQualifiedLeads}
                        loading={loading}
                    >
                        Refresh
                    </Button>
                </Space>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                        <p className="text-sm text-gray-500">Total Lists</p>
                        <p className="text-3xl font-semibold text-[#0F792C]">{qualifiedLeads.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Records</p>
                        <p className="text-3xl font-semibold text-[#0F792C]">
                            {qualifiedLeads.reduce((sum, lead) => sum + (lead.totalRecords || 0), 0)}
                        </p>
                    </div>
                </div>
                <Search
                    placeholder="Search by name or query..."
                    allowClear
                    onSearch={handleSearch}
                    onChange={(e) => {
                        setKeyword(e.target.value);
                        if (e.target.value === '') {
                            handleSearch('');
                        }
                    }}
                    className="w-full md:w-96"
                    size="large"
                />
            </div>

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
                {filteredLeads.length === 0 && !loading ? (
                    <Empty
                        description="No qualified leads saved yet. Go to Operations and save filtered data as qualified leads."
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    <Table
                        rowKey={(record) => record._id}
                        columns={columns}
                        dataSource={filteredLeads}
                        loading={loading}
                        scroll={{ x: 'max-content' }}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        }}
                    />
                )}
            </div>

            {/* Edit Modal */}
            <Modal
                title="Edit Qualified Lead"
                open={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false);
                    setSelectedLead(null);
                    form.resetFields();
                }}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEditSave}
                >
                    <Form.Item
                        name="name"
                        label="List Name"
                        rules={[{ required: true, message: 'Please enter a name' }]}
                    >
                        <Input placeholder="Enter list name" />
                    </Form.Item>
                    <Form.Item className="mb-0">
                        <div className="flex justify-end gap-2">
                            <Button onClick={() => {
                                setEditModalVisible(false);
                                setSelectedLead(null);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={editLoading}
                                className="bg-[#0F792C] hover:bg-[#0a5a20] border-[#0F792C]"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QualifiedLeadsPage;
