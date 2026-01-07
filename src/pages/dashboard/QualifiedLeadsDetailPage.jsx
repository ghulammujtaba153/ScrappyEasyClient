import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Table, Tag, Spin, message, Space, Tooltip, Modal, Input, Form, Select, Checkbox, Alert, InputNumber } from 'antd';
import { MdArrowBack, MdStar, MdFilterList, MdOpenInNew, MdDownload, MdCheckCircle, MdClose, MdFavorite, MdPhone, MdMessage, MdRefresh, MdSearch } from 'react-icons/md';
import { BsWhatsapp } from 'react-icons/bs';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const { Option } = Select;

// Default filters matching OperationDetailPage
const defaultFilters = {
    whatsappStatus: '',
    ratingMin: null,
    ratingMax: null,
    reviewsMin: null,
    reviewsMax: null,
    hasWebsite: '',
    hasPhone: '',
    hasVerifiedWhatsApp: '',
    favorite: '',
    callStatus: '',
    messageStatus: '',
    leadStatus: '',
    searchText: ''
};

const QualifiedLeadsDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [leadData, setLeadData] = useState(null);
    
    // Campaign creation modals
    const [coldCallModalVisible, setColdCallModalVisible] = useState(false);
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const [campaignLoading, setCampaignLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [coldCallForm] = Form.useForm();
    const [messageForm] = Form.useForm();
    
    // Filters - matching OperationDetailPage structure
    const [filters, setFilters] = useState({ ...defaultFilters });
    
    // Pagination state for row numbering
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const fetchLeadDetails = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/qualified-leads/get-by-id/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data) {
                setLeadData(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch lead details:', error);
            message.error('Failed to fetch qualified lead details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeadDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Transform entries to flat data for table
    const getTableData = () => {
        if (!leadData?.entries) return [];
        return leadData.entries.map((entry, index) => ({
            key: entry._id || index,
            entryId: entry._id,
            leadId: entry.leadId?._id,
            // Lead data from populated leadId
            title: entry.leadId?.title || '',
            rating: entry.leadId?.rating || '',
            reviews: entry.leadId?.reviews || '',
            phone: entry.leadId?.phone || '',
            address: entry.leadId?.address || '',
            city: entry.leadId?.city || '',
            website: entry.leadId?.website || '',
            googleMapsLink: entry.leadId?.googleMapsLink || '',
            whatsappStatus: entry.leadId?.whatsappStatus || 'not-checked',
            favorite: entry.leadId?.favorite || false,
            screenshotUrl: entry.leadId?.screenshotUrl || '',
            leadStatus: entry.leadId?.status || 'not-reached',
            // Status tracking from entry
            callStatus: entry.callStatus || 'not-called',
            lastCalledAt: entry.lastCalledAt,
            callNotes: entry.callNotes,
            callAttempts: entry.callAttempts || 0,
            messageStatus: entry.messageStatus || 'not-sent',
            lastMessagedAt: entry.lastMessagedAt,
            messageNotes: entry.messageNotes,
            messageAttempts: entry.messageAttempts || 0,
        }));
    };

    // Get filtered table data based on all filters
    const getFilteredTableData = () => {
        let data = getTableData();
        
        // Search text filter (business name, address, city)
        if (filters.searchText) {
            const searchLower = filters.searchText.toLowerCase();
            data = data.filter(item =>
                item.title?.toLowerCase().includes(searchLower) ||
                item.address?.toLowerCase().includes(searchLower) ||
                item.city?.toLowerCase().includes(searchLower) ||
                item.phone?.includes(filters.searchText)
            );
        }
        
        // WhatsApp status filter
        if (filters.whatsappStatus) {
            data = data.filter(item => {
                const status = item.whatsappStatus;
                if (filters.whatsappStatus === 'verified') {
                    return status === 'verified';
                } else if (filters.whatsappStatus === 'not-verified') {
                    return status === 'not-verified';
                } else if (filters.whatsappStatus === 'not-checked') {
                    return !status || status === 'not-checked' || status === '';
                }
                return true;
            });
        }
        
        // Rating filters
        if (filters.ratingMin !== null) {
            data = data.filter(item => {
                const rating = parseFloat(item.rating);
                return !Number.isNaN(rating) && rating >= filters.ratingMin;
            });
        }
        if (filters.ratingMax !== null) {
            data = data.filter(item => {
                const rating = parseFloat(item.rating);
                return !Number.isNaN(rating) && rating <= filters.ratingMax;
            });
        }
        
        // Reviews filters
        if (filters.reviewsMin !== null) {
            data = data.filter(item => {
                const reviews = parseInt(item.reviews, 10);
                return !Number.isNaN(reviews) && reviews >= filters.reviewsMin;
            });
        }
        if (filters.reviewsMax !== null) {
            data = data.filter(item => {
                const reviews = parseInt(item.reviews, 10);
                return !Number.isNaN(reviews) && reviews <= filters.reviewsMax;
            });
        }
        
        // Has website filter
        if (filters.hasWebsite) {
            data = data.filter(item => {
                const hasWebsite = item.website && item.website.trim() !== '';
                return filters.hasWebsite === 'yes' ? hasWebsite : !hasWebsite;
            });
        }
        
        // Has phone filter
        if (filters.hasPhone) {
            data = data.filter(item => {
                const hasPhone = item.phone && item.phone.trim() !== '';
                return filters.hasPhone === 'yes' ? hasPhone : !hasPhone;
            });
        }
        
        // Has verified WhatsApp filter
        if (filters.hasVerifiedWhatsApp) {
            data = data.filter(item => {
                const hasVerified = item.phone && item.whatsappStatus === 'verified';
                return filters.hasVerifiedWhatsApp === 'yes' ? hasVerified : !hasVerified;
            });
        }
        
        // Favorite filter
        if (filters.favorite) {
            data = data.filter(item => {
                const isFavorite = !!item.favorite;
                return filters.favorite === 'yes' ? isFavorite : !isFavorite;
            });
        }
        
        // Call status filter
        if (filters.callStatus) {
            data = data.filter(item => item.callStatus === filters.callStatus);
        }
        
        // Message status filter
        if (filters.messageStatus) {
            data = data.filter(item => item.messageStatus === filters.messageStatus);
        }
        
        // Lead status filter
        if (filters.leadStatus) {
            data = data.filter(item => item.leadStatus === filters.leadStatus);
        }
        
        return data;
    };

    // Check if any filter is active
    const hasActiveFilters = () => {
        return filters.searchText ||
            filters.whatsappStatus ||
            filters.ratingMin !== null ||
            filters.ratingMax !== null ||
            filters.reviewsMin !== null ||
            filters.reviewsMax !== null ||
            filters.hasWebsite ||
            filters.hasPhone ||
            filters.hasVerifiedWhatsApp ||
            filters.favorite ||
            filters.callStatus ||
            filters.messageStatus ||
            filters.leadStatus;
    };

    // Create Cold Call Campaign from this qualified leads list
    const handleCreateColdCallCampaign = async (values) => {
        setCampaignLoading(true);
        try {
            const payload = {
                name: values.name,
                userId: user._id || user.id,
                qualifiedLeadsId: id, // Link to this qualified leads list
                callScript: values.callScript || ''
            };

            const res = await axios.post(`${BASE_URL}/api/coldcall/create`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                message.success(`Cold call campaign "${values.name}" created successfully!`);
                coldCallForm.resetFields();
                setColdCallModalVisible(false);
                // Optionally navigate to cold caller page
                if (values.navigateToCampaign) {
                    navigate('/dashboard/cold-caller');
                }
            }
        } catch (error) {
            console.error('Failed to create cold call campaign:', error);
            message.error(error.response?.data?.message || 'Failed to create cold call campaign');
        } finally {
            setCampaignLoading(false);
        }
    };

    // Create Message Campaign from this qualified leads list
    const handleCreateMessageCampaign = async (values) => {
        setCampaignLoading(true);
        try {
            const payload = {
                name: values.name,
                userId: user._id || user.id,
                qualifiedLeadsId: id, // Link to this qualified leads list
                message: values.message || ''
            };

            const res = await axios.post(`${BASE_URL}/api/automate/create`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 201) {
                message.success(`Message campaign "${values.name}" created successfully!`);
                messageForm.resetFields();
                setMessageModalVisible(false);
                // Optionally navigate to message automation page
                if (values.navigateToCampaign) {
                    navigate('/dashboard/message-automation');
                }
            }
        } catch (error) {
            console.error('Failed to create message campaign:', error);
            message.error(error.response?.data?.error || 'Failed to create message campaign');
        } finally {
            setCampaignLoading(false);
        }
    };

    // Get active filters for display
    const getActiveFilters = () => {
        if (!leadData?.filters) return [];
        const filters = leadData.filters;
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

    const tableData = getTableData();
    const filteredTableData = getFilteredTableData();

    // Calculate stats for leads with phone
    const leadsWithPhone = tableData.filter(d => d.phone);
    const notCalledLeads = leadsWithPhone.filter(d => d.callStatus === 'not-called');
    const notMessagedLeads = leadsWithPhone.filter(d => d.messageStatus === 'not-sent');

    const exportToCSV = () => {
        if (!filteredTableData.length) {
            message.warning('No data to export');
            return;
        }

        const headers = ['Business Name', 'Rating', 'Reviews', 'Phone', 'Address', 'City', 'Website', 'WhatsApp Status', 'Call Status', 'Message Status'];
        const rows = filteredTableData.map(item => [
            item.title || '',
            item.rating || '',
            item.reviews || '',
            item.phone || '',
            item.address || '',
            item.city || '',
            item.website || '',
            item.whatsappStatus || '',
            item.callStatus || '',
            item.messageStatus || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${leadData.name || 'qualified-leads'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        message.success('CSV exported successfully');
    };

    const getCallStatusColor = (status) => {
        const colors = {
            'not-called': 'default',
            'pending': 'processing',
            'successful': 'success',
            'failed': 'error',
            'no-answer': 'warning',
            'callback': 'purple'
        };
        return colors[status] || 'default';
    };

    const getMessageStatusColor = (status) => {
        const colors = {
            'not-sent': 'default',
            'pending': 'processing',
            'sent': 'cyan',
            'delivered': 'blue',
            'read': 'success',
            'failed': 'error'
        };
        return colors[status] || 'default';
    };

    const getLeadStatusColor = (status) => {
        const colors = {
            'not-reached': 'default',
            'interested': 'success',
            'not-interested': 'error',
            'no-response': 'warning'
        };
        return colors[status] || 'default';
    };

    // Handle lead status update (overall status in LeadData)
    const handleLeadStatusChange = async (leadId, newStatus) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/data/update-lead-status`, {
                leadId,
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                message.success('Lead status updated');
                fetchLeadDetails();
            }
        } catch (error) {
            console.error('Lead status update error:', error);
            message.error('Failed to update lead status');
        }
    };

    const columns = [
        {
            title: '#',
            width: 60,
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Business Name',
            dataIndex: 'title',
            key: 'title',
            width: 250,
            sorter: (a, b) => (a.title || '').localeCompare(b.title || ''),
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            width: 100,
            render: (rating) => rating ? (
                <Tag color="green">⭐ {rating}</Tag>
            ) : '-',
            sorter: (a, b) => (parseFloat(a.rating) || 0) - (parseFloat(b.rating) || 0),
        },
        {
            title: 'Reviews',
            dataIndex: 'reviews',
            key: 'reviews',
            width: 100,
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
            title: 'City',
            dataIndex: 'city',
            key: 'city',
            width: 120,
            render: (city) => city ? <Tag color="blue">{city}</Tag> : '-',
        },
        {
            title: 'WhatsApp',
            dataIndex: 'whatsappStatus',
            key: 'whatsappStatus',
            width: 130,
            render: (status) => {
                if (status === 'verified') {
                    return <Tag color="success" icon={<MdCheckCircle />}>Verified</Tag>;
                }
                if (status === 'not-verified') {
                    return <Tag color="error" icon={<MdClose />}>No WhatsApp</Tag>;
                }
                return <Tag color="default">Not Checked</Tag>;
            },
        },
        {
            title: 'Lead Status',
            dataIndex: 'leadStatus',
            key: 'leadStatus',
            width: 150,
            render: (status, record) => (
                <Select
                    value={status || 'not-reached'}
                    onChange={(value) => handleLeadStatusChange(record.leadId, value)}
                    style={{ width: 140 }}
                    size="small"
                    options={[
                        { value: 'not-reached', label: '⏳ Not Reached' },
                        { value: 'interested', label: '✅ Interested' },
                        { value: 'not-interested', label: '❌ Not Interested' },
                        { value: 'no-response', label: '📵 No Response' },
                    ]}
                />
            ),
        },
        {
            title: 'Call Status',
            dataIndex: 'callStatus',
            key: 'callStatus',
            width: 130,
            render: (status, record) => (
                <Tooltip title={record.callAttempts > 0 ? `${record.callAttempts} attempt(s)` : ''}>
                    <Tag color={getCallStatusColor(status)} icon={<MdPhone />}>
                        {status?.replace('-', ' ') || 'Not Called'}
                    </Tag>
                </Tooltip>
            ),
        },
        {
            title: 'Message Status',
            dataIndex: 'messageStatus',
            key: 'messageStatus',
            width: 130,
            render: (status, record) => (
                <Tooltip title={record.messageAttempts > 0 ? `${record.messageAttempts} attempt(s)` : ''}>
                    <Tag color={getMessageStatusColor(status)} icon={<MdMessage />}>
                        {status?.replace('-', ' ') || 'Not Sent'}
                    </Tag>
                </Tooltip>
            ),
        },
        {
            title: 'Website',
            dataIndex: 'website',
            key: 'website',
            width: 100,
            render: (website) => website ? (
                <a href={website} target="_blank" rel="noopener noreferrer" className="text-[#0F792C] hover:text-[#0a5a20]">
                    <MdOpenInNew className="inline" /> Link
                </a>
            ) : '-',
        },
        {
            title: 'Maps',
            dataIndex: 'googleMapsLink',
            key: 'googleMapsLink',
            width: 80,
            render: (link) => link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#0F792C] hover:text-[#0a5a20]">
                    <MdOpenInNew className="inline" />
                </a>
            ) : '-',
        },
        {
            title: '❤️',
            dataIndex: 'favorite',
            key: 'favorite',
            width: 60,
            render: (favorite) => favorite ? (
                <MdFavorite className="text-red-500 text-xl" />
            ) : '-',
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spin size="large" />
            </div>
        );
    }

    const activeFilters = getActiveFilters();

    // Calculate stats
    const verifiedWhatsApp = tableData.filter(d => d.whatsappStatus === 'verified').length;
    const calledCount = tableData.filter(d => d.callStatus !== 'not-called').length;
    const messagedCount = tableData.filter(d => d.messageStatus !== 'not-sent').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <Button
                        icon={<MdArrowBack />}
                        onClick={() => navigate('/dashboard/qualified-leads')}
                        className="mb-2"
                    >
                        Back to Qualified Leads
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MdStar className="text-yellow-500" />
                        {leadData?.name || 'Qualified Lead Details'}
                    </h1>
                    {leadData && (
                        <p className="text-gray-600">
                            {leadData.totalRecords || tableData.length || 0} records • Created {leadData.createdAt ? new Date(leadData.createdAt).toLocaleString() : 'N/A'}
                        </p>
                    )}
                </div>

                <Space wrap>
                    <Button
                        icon={<MdRefresh />}
                        onClick={fetchLeadDetails}
                        loading={loading}
                    >
                        Refresh
                    </Button>
                    <Button
                        icon={<MdDownload />}
                        onClick={exportToCSV}
                        disabled={!filteredTableData.length}
                    >
                        Export CSV
                    </Button>
                    <Button
                        type="primary"
                        icon={<MdPhone />}
                        onClick={() => setColdCallModalVisible(true)}
                        disabled={leadsWithPhone.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                    >
                        Create Cold Call Campaign
                    </Button>
                    <Button
                        type="primary"
                        icon={<BsWhatsapp />}
                        onClick={() => setMessageModalVisible(true)}
                        disabled={leadsWithPhone.length === 0}
                        className="bg-[#0F792C] hover:bg-[#0a5a20] border-[#0F792C]"
                    >
                        Create Message Campaign
                    </Button>
                </Space>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                    <p className="text-sm text-gray-500">Total Records</p>
                    <p className="text-3xl font-bold text-[#0F792C]">{leadData?.totalRecords || tableData.length || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                    <p className="text-sm text-gray-500">WhatsApp Verified</p>
                    <p className="text-3xl font-bold text-green-600">{verifiedWhatsApp}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                    <p className="text-sm text-gray-500">Called</p>
                    <p className="text-3xl font-bold text-blue-600">{calledCount}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                    <p className="text-sm text-gray-500">Messaged</p>
                    <p className="text-3xl font-bold text-purple-600">{messagedCount}</p>
                </div>
            </div>

            {/* Search Query */}
            {leadData?.searchString && (
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                    <p className="text-sm text-gray-500">Search Query</p>
                    <p className="text-lg font-semibold text-gray-800">{leadData.searchString}</p>
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

            {/* Comprehensive Filters Section */}
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
                            onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
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
                                onChange={(value) => setFilters({ ...filters, whatsappStatus: value || '' })}
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
                                onChange={(value) => setFilters({ ...filters, hasWebsite: value || '' })}
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
                                onChange={(value) => setFilters({ ...filters, ratingMin: value ?? null })}
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
                                onChange={(value) => setFilters({ ...filters, ratingMax: value ?? null })}
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
                                onChange={(value) => setFilters({ ...filters, reviewsMin: value ?? null })}
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
                                onChange={(value) => setFilters({ ...filters, reviewsMax: value ?? null })}
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
                                onChange={(value) => setFilters({ ...filters, hasPhone: value || '' })}
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
                                onChange={(value) => setFilters({ ...filters, hasVerifiedWhatsApp: value || '' })}
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
                                onChange={(value) => setFilters({ ...filters, favorite: value || '' })}
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
                                onChange={(value) => setFilters({ ...filters, callStatus: value || '' })}
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
                                onChange={(value) => setFilters({ ...filters, messageStatus: value || '' })}
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
                                onChange={(value) => setFilters({ ...filters, leadStatus: value || '' })}
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
                    {hasActiveFilters() && (
                        <Button
                            onClick={() => setFilters({ ...defaultFilters })}
                            size="small"
                            className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        >
                            Clear All Filters
                        </Button>
                    )}
                    <span className="text-gray-500 text-sm ml-auto">
                        Showing {filteredTableData.length} of {tableData.length} records
                    </span>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <Table
                    columns={columns}
                    dataSource={filteredTableData}
                    loading={loading}
                    scroll={{ x: 1800 }}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} records`,
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        },
                    }}
                />
            </div>

            {/* Cold Call Campaign Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <MdPhone className="text-blue-600 text-xl" />
                        <span>Create Cold Call Campaign</span>
                    </div>
                }
                open={coldCallModalVisible}
                onCancel={() => {
                    setColdCallModalVisible(false);
                    coldCallForm.resetFields();
                }}
                footer={null}
                destroyOnClose
            >
                <Alert
                    type="info"
                    showIcon
                    message={`${leadsWithPhone.length} leads with phone numbers`}
                    description={`${notCalledLeads.length} not yet called. This campaign will be linked to "${leadData?.name}" for status tracking.`}
                    className="mb-4"
                />
                
                <Form
                    form={coldCallForm}
                    layout="vertical"
                    onFinish={handleCreateColdCallCampaign}
                >
                    <Form.Item
                        name="name"
                        label="Campaign Name"
                        rules={[{ required: true, message: 'Please enter a campaign name' }]}
                        initialValue={`${leadData?.name} - Cold Calls`}
                    >
                        <Input placeholder="e.g. Real Estate Leads - Karachi" />
                    </Form.Item>
                    
                    <Form.Item
                        name="callScript"
                        label="Call Script (optional)"
                    >
                        <Input.TextArea 
                            rows={4} 
                            placeholder="Enter your call script here..."
                        />
                    </Form.Item>
                    
                    <Form.Item
                        name="navigateToCampaign"
                        valuePropName="checked"
                    >
                        <Checkbox>Go to Cold Caller page after creating</Checkbox>
                    </Form.Item>
                    
                    <Form.Item className="mb-0">
                        <div className="flex justify-end gap-2">
                            <Button onClick={() => {
                                setColdCallModalVisible(false);
                                coldCallForm.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={campaignLoading}
                                className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                            >
                                Create Campaign
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Message Campaign Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <BsWhatsapp className="text-green-600 text-xl" />
                        <span>Create Message Campaign</span>
                    </div>
                }
                open={messageModalVisible}
                onCancel={() => {
                    setMessageModalVisible(false);
                    messageForm.resetFields();
                }}
                footer={null}
                destroyOnClose
            >
                <Alert
                    type="info"
                    showIcon
                    message={`${leadsWithPhone.length} leads with phone numbers`}
                    description={`${notMessagedLeads.length} not yet messaged. Use {name} to personalize with business name.`}
                    className="mb-4"
                />
                
                <Form
                    form={messageForm}
                    layout="vertical"
                    onFinish={handleCreateMessageCampaign}
                >
                    <Form.Item
                        name="name"
                        label="Campaign Name"
                        rules={[{ required: true, message: 'Please enter a campaign name' }]}
                        initialValue={`${leadData?.name} - Messages`}
                    >
                        <Input placeholder="e.g. Verified Lawyers - WhatsApp" />
                    </Form.Item>
                    
                    <Form.Item
                        name="message"
                        label="Message Template"
                    >
                        <Input.TextArea 
                            rows={4} 
                            placeholder="Hello {name}, we have a special offer for you..."
                        />
                    </Form.Item>
                    
                    <Form.Item
                        name="navigateToCampaign"
                        valuePropName="checked"
                    >
                        <Checkbox>Go to Message Automation page after creating</Checkbox>
                    </Form.Item>
                    
                    <Form.Item className="mb-0">
                        <div className="flex justify-end gap-2">
                            <Button onClick={() => {
                                setMessageModalVisible(false);
                                messageForm.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={campaignLoading}
                                className="bg-[#0F792C] hover:bg-[#0a5a20] border-[#0F792C]"
                            >
                                Create Campaign
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QualifiedLeadsDetailPage;