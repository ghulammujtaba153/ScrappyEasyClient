import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Table, Tag, Spin, message, Space, Tooltip } from 'antd';
import { MdArrowBack, MdStar, MdFilterList, MdOpenInNew, MdDownload, MdCheckCircle, MdClose, MdFavorite, MdPhone, MdMessage } from 'react-icons/md';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const QualifiedLeadsDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [loading, setLoading] = useState(false);
    const [leadData, setLeadData] = useState(null);

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

    const exportToCSV = () => {
        if (!tableData.length) {
            message.warning('No data to export');
            return;
        }

        const headers = ['Business Name', 'Rating', 'Reviews', 'Phone', 'Address', 'City', 'Website', 'WhatsApp Status', 'Call Status', 'Message Status'];
        const rows = tableData.map(item => [
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

    const columns = [
        {
            title: '#',
            width: 60,
            render: (_, __, index) => index + 1,
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

                <Space>
                    <Button
                        icon={<MdDownload />}
                        onClick={exportToCSV}
                        disabled={!tableData.length}
                    >
                        Export CSV
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
                        <h3 className="text-lg font-semibold text-gray-800">Filters Applied</h3>
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

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <Table
                    columns={columns}
                    dataSource={tableData}
                    loading={loading}
                    scroll={{ x: 1600 }}
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

export default QualifiedLeadsDetailPage;
