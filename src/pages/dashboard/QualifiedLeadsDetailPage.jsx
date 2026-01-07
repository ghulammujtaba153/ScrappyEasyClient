import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Tag, Spin, message, Tooltip, Form, Select, Checkbox } from 'antd';
import { MdOpenInNew, MdCheckCircle, MdClose, MdFavorite, MdPhone, MdMessage } from 'react-icons/md';
import { PhoneOutlined, MessageOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';
import Dialer from '../../components/Dialer';
import WhatsAppConnectModal from '../../components/dashboard/WhatsAppConnectModal';

// Import QualifiedLeads components
import {
    CallStatusModal,
    SendMessageModal,
    BatchMessagingBar,
    QualifiedLeadsFilters,
    QualifiedLeadsInfoCards,
    ColdCallCampaignModal,
    MessageCampaignModal,
    ActiveFiltersDisplay,
    QualifiedLeadsHeader
} from '../../components/QualifiedLeads';

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
    const [coldCallForm] = Form.useForm();
    const [messageForm] = Form.useForm();
    
    // Filters - matching OperationDetailPage structure
    const [filters, setFilters] = useState({ ...defaultFilters });
    
    // Pagination state for row numbering
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    
    // Dialer & Status States
    const [showDialer, setShowDialer] = useState(false);
    const [dialerNumber, setDialerNumber] = useState("");
    const [callingEntryId, setCallingEntryId] = useState(null);
    const [callingLeadId, setCallingLeadId] = useState(null);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [selectedCallStatus, setSelectedCallStatus] = useState("interested");
    const [updatingCallStatus, setUpdatingCallStatus] = useState(false);
    
    // Messaging States
    const [sendMessageModalVisible, setSendMessageModalVisible] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [messagingEntryId, setMessagingEntryId] = useState(null);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [remainingMessages, setRemainingMessages] = useState(10);
    const [selectedMessageEntries, setSelectedMessageEntries] = useState([]);
    const [batchSending, setBatchSending] = useState(false);
    const [whatsappConnectModalOpen, setWhatsappConnectModalOpen] = useState(false);
    const [whatsappInitialized, setWhatsappInitialized] = useState(false);
    const [connectedPhoneNumber, setConnectedPhoneNumber] = useState(null);
    const [disconnecting, setDisconnecting] = useState(false);

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

    // Fetch remaining messages for today
    const fetchRemainingMessages = async () => {
        try {
            const userId = user._id || user.id;
            const res = await axios.get(`${BASE_URL}/api/automate/remaining/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setRemainingMessages(res.data.remaining);
            }
        } catch (error) {
            console.error('Failed to fetch remaining messages');
        }
    };

    // Check WhatsApp connection status
    const checkWhatsAppStatus = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/verification/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && res.data.data) {
                setWhatsappInitialized(res.data.data.isConnected);
                setConnectedPhoneNumber(res.data.data.phoneNumber || null);
            }
        } catch (error) {
            console.error('WhatsApp status check failed');
        }
    };

    // Disconnect WhatsApp
    const handleDisconnectWhatsApp = async () => {
        setDisconnecting(true);
        try {
            const res = await axios.post(`${BASE_URL}/api/verification/disconnect`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                message.success('WhatsApp disconnected successfully');
                setWhatsappInitialized(false);
                setConnectedPhoneNumber(null);
            }
        } catch (error) {
            message.error(error.response?.data?.error || 'Failed to disconnect WhatsApp');
        } finally {
            setDisconnecting(false);
        }
    };

    useEffect(() => {
        fetchLeadDetails();
        fetchRemainingMessages();
        checkWhatsAppStatus();
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

    // Handle opening dialer
    const handleCall = (record) => {
        setDialerNumber(record.phone);
        setCallingEntryId(record.entryId);
        setCallingLeadId(record.leadId);
        setShowDialer(true);
    };

    // When call ends, show status modal
    const onCallEnd = () => {
        if (callingEntryId) {
            setStatusModalVisible(true);
        }
    };

    // Update call status after call ends
    const handleUpdateCallStatus = async () => {
        if (!callingEntryId) return;
        setUpdatingCallStatus(true);
        try {
            const res = await axios.put(`${BASE_URL}/api/qualified-leads/update-call-status`, {
                qualifiedLeadId: id,
                entryId: callingEntryId,
                callStatus: selectedCallStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data) {
                message.success('Call status updated');
                fetchLeadDetails();
                setStatusModalVisible(false);
                setCallingEntryId(null);
                setCallingLeadId(null);
            }
        } catch (error) {
            console.error('Update call status error:', error);
            message.error('Failed to update call status');
        } finally {
            setUpdatingCallStatus(false);
        }
    };

    // Open message modal for single entry
    const handleOpenMessageModal = (record) => {
        if (!record.phone) {
            message.warning('This lead has no phone number');
            return;
        }
        if (remainingMessages <= 0) {
            message.error('Daily message limit (10) reached. Try again tomorrow.');
            return;
        }
        setMessagingEntryId(record.entryId);
        setSendMessageModalVisible(true);
    };

    // Send single message
    const handleSendSingleMessage = async () => {
        if (!messagingEntryId || !messageContent.trim()) {
            message.warning('Please enter a message');
            return;
        }
        if (!whatsappInitialized) {
            message.warning('Please connect WhatsApp first');
            setWhatsappConnectModalOpen(true);
            return;
        }

        setSendingMessage(true);
        try {
            const userId = user._id || user.id;
            const res = await axios.post(`${BASE_URL}/api/automate/send-single`, {
                qualifiedLeadId: id,
                entryId: messagingEntryId,
                messageContent,
                userId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                message.success(`Message sent to ${res.data.businessName}`);
                setRemainingMessages(res.data.remainingMessages);
                setSendMessageModalVisible(false);
                setMessagingEntryId(null);
                fetchLeadDetails();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to send message';
            message.error(errorMsg);
            if (error.response?.data?.remainingMessages !== undefined) {
                setRemainingMessages(error.response.data.remainingMessages);
            }
        } finally {
            setSendingMessage(false);
        }
    };

    // Send batch messages to selected entries
    const handleSendBatchMessages = async () => {
        if (selectedMessageEntries.length === 0) {
            message.warning('Please select recipients to send messages');
            return;
        }
        if (!messageContent.trim()) {
            message.warning('Please enter a message content');
            return;
        }
        if (!whatsappInitialized) {
            message.warning('Please connect WhatsApp first');
            setWhatsappConnectModalOpen(true);
            return;
        }
        if (remainingMessages <= 0) {
            message.error('Daily message limit (10) reached. Try again tomorrow.');
            return;
        }

        setBatchSending(true);
        try {
            const userId = user._id || user.id;
            const res = await axios.post(`${BASE_URL}/api/automate/send-batch-limit`, {
                qualifiedLeadId: id,
                entryIds: selectedMessageEntries,
                messageContent,
                userId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                message.success(`Batch sent: ${res.data.successCount} successful, ${res.data.failedCount} failed`);
                if (res.data.skipped > 0) {
                    message.warning(`${res.data.skipped} messages skipped due to daily limit`);
                }
                setRemainingMessages(res.data.remainingMessages);
                setSelectedMessageEntries([]);
                fetchLeadDetails();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to send batch';
            message.error(errorMsg);
        } finally {
            setBatchSending(false);
        }
    };

    // Toggle entry selection for batch messaging
    const toggleMessageEntrySelection = (entryId, isSelected) => {
        if (isSelected) {
            setSelectedMessageEntries([...selectedMessageEntries, entryId]);
        } else {
            setSelectedMessageEntries(selectedMessageEntries.filter(id => id !== entryId));
        }
    };

    // Select all pending entries for messaging
    const selectAllPendingForMessaging = (checked) => {
        if (checked) {
            const pendingEntries = filteredTableData
                .filter(d => d.phone && (d.messageStatus === 'not-sent' || d.messageStatus === 'pending'))
                .map(d => d.entryId);
            setSelectedMessageEntries(pendingEntries);
        } else {
            setSelectedMessageEntries([]);
        }
    };

    // Get current lead being messaged for modal display
    const currentMessagingLead = filteredTableData.find(d => d.entryId === messagingEntryId);

    // Get current lead being called for modal display
    const currentCallingLead = filteredTableData.find(d => d.entryId === callingEntryId);

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
        {
            title: () => {
                const pendingEntries = filteredTableData.filter(d => d.phone && (d.messageStatus === 'not-sent' || d.messageStatus === 'pending'));
                const allSelected = pendingEntries.length > 0 && pendingEntries.every(d => selectedMessageEntries.includes(d.entryId));
                return (
                    <Tooltip title="Select for batch messaging">
                        <Checkbox
                            checked={allSelected}
                            indeterminate={selectedMessageEntries.length > 0 && !allSelected}
                            onChange={(e) => selectAllPendingForMessaging(e.target.checked)}
                        />
                    </Tooltip>
                );
            },
            key: 'select',
            width: 50,
            render: (_, record) => {
                if (!record.phone || record.messageStatus === 'sent' || record.messageStatus === 'delivered' || record.messageStatus === 'read') {
                    return null;
                }
                return (
                    <Checkbox
                        checked={selectedMessageEntries.includes(record.entryId)}
                        onChange={(e) => toggleMessageEntrySelection(record.entryId, e.target.checked)}
                    />
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            render: (_, record) => record.phone ? (
                <Space size="small">
                    <Tooltip title="Call">
                        <Button
                            type="primary"
                            icon={<PhoneOutlined />}
                            size="small"
                            onClick={() => handleCall(record)}
                            style={{ backgroundColor: '#0F792C', borderColor: '#0F792C' }}
                        />
                    </Tooltip>
                    <Tooltip title={
                        record.messageStatus === 'sent' || record.messageStatus === 'delivered' || record.messageStatus === 'read'
                            ? 'Already sent'
                            : remainingMessages <= 0
                                ? 'Daily limit reached'
                                : 'Send message'
                    }>
                        <Button
                            icon={<MessageOutlined />}
                            size="small"
                            onClick={() => handleOpenMessageModal(record)}
                            disabled={record.messageStatus === 'sent' || record.messageStatus === 'delivered' || record.messageStatus === 'read' || remainingMessages <= 0}
                            style={{ 
                                backgroundColor: record.messageStatus === 'sent' ? '#ccc' : '#25D366',
                                borderColor: record.messageStatus === 'sent' ? '#ccc' : '#25D366',
                                color: 'white'
                            }}
                        />
                    </Tooltip>
                </Space>
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

    const verifiedWhatsApp = tableData.filter(d => d.whatsappStatus === 'verified').length;
    const calledCount = tableData.filter(d => d.callStatus !== 'not-called').length;
    const messagedCount = tableData.filter(d => d.messageStatus !== 'not-sent').length;

    return (
        <div className="space-y-6">
            {/* Dialer Overlay */}
            {showDialer && (
                <Dialer
                    phoneNumber={dialerNumber}
                    onClose={() => setShowDialer(false)}
                    onCallEnd={onCallEnd}
                />
            )}

            {/* Call Status Update Modal */}
            <CallStatusModal
                visible={statusModalVisible}
                onOk={handleUpdateCallStatus}
                onCancel={() => setStatusModalVisible(false)}
                confirmLoading={updatingCallStatus}
                currentLead={currentCallingLead}
                selectedStatus={selectedCallStatus}
                onStatusChange={setSelectedCallStatus}
            />

            {/* Send Message Modal */}
            <SendMessageModal
                visible={sendMessageModalVisible}
                onOk={handleSendSingleMessage}
                onCancel={() => {
                    setSendMessageModalVisible(false);
                    setMessagingEntryId(null);
                }}
                confirmLoading={sendingMessage}
                currentLead={currentMessagingLead}
                messageContent={messageContent}
                onMessageChange={setMessageContent}
                remainingMessages={remainingMessages}
                whatsappInitialized={whatsappInitialized}
                onConnectWhatsApp={() => setWhatsappConnectModalOpen(true)}
            />

            {/* WhatsApp Connect Modal */}
            <WhatsAppConnectModal
                visible={whatsappConnectModalOpen}
                onCancel={() => setWhatsappConnectModalOpen(false)}
                onConnected={() => {
                    setWhatsappConnectModalOpen(false);
                    setWhatsappInitialized(true);
                    checkWhatsAppStatus(); // Refresh to get phone number
                }}
                onDisconnected={() => {
                    setWhatsappInitialized(false);
                    setConnectedPhoneNumber(null);
                }}
            />

            {/* Header */}
            <QualifiedLeadsHeader
                leadData={leadData}
                tableDataLength={tableData.length}
                loading={loading}
                leadsWithPhoneCount={leadsWithPhone.length}
                filteredDataLength={filteredTableData.length}
                onBack={() => navigate('/dashboard/qualified-leads')}
                onRefresh={fetchLeadDetails}
                onExportCSV={exportToCSV}
                onCreateColdCallCampaign={() => setColdCallModalVisible(true)}
                onCreateMessageCampaign={() => setMessageModalVisible(true)}
            />

            {/* Info Cards */}
            <QualifiedLeadsInfoCards
                totalRecords={leadData?.totalRecords || tableData.length || 0}
                verifiedWhatsApp={verifiedWhatsApp}
                calledCount={calledCount}
                messagedCount={messagedCount}
            />

            {/* Active Filters Display */}
            <ActiveFiltersDisplay
                filters={leadData?.filters}
                searchString={leadData?.searchString}
            />

            {/* Comprehensive Filters Section */}
            <QualifiedLeadsFilters
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={() => setFilters({ ...defaultFilters })}
                hasActiveFilters={hasActiveFilters()}
                filteredCount={filteredTableData.length}
                totalCount={tableData.length}
            />

            {/* WhatsApp Connection Status Bar */}
            <div className={`rounded-xl p-4 border ${whatsappInitialized 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            whatsappInitialized ? 'bg-[#25D366]' : 'bg-gray-300'
                        }`}>
                            <MdMessage className="text-white text-lg" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`font-semibold ${whatsappInitialized ? 'text-green-700' : 'text-gray-600'}`}>
                                    WhatsApp {whatsappInitialized ? 'Connected' : 'Not Connected'}
                                </span>
                                {whatsappInitialized && (
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                )}
                            </div>
                            {whatsappInitialized && connectedPhoneNumber ? (
                                <p className="text-sm text-green-600 font-medium m-0">{connectedPhoneNumber}</p>
                            ) : !whatsappInitialized && (
                                <p className="text-xs text-gray-500 m-0">Connect to send messages</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {whatsappInitialized ? (
                            <>
                                <Tag color="green" className="m-0">
                                    {remainingMessages} messages left today
                                </Tag>
                                <Button
                                    danger
                                    size="small"
                                    onClick={handleDisconnectWhatsApp}
                                    loading={disconnecting}
                                    icon={<MdClose />}
                                >
                                    Disconnect
                                </Button>
                            </>
                        ) : (
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => setWhatsappConnectModalOpen(true)}
                                style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                                icon={<MdMessage />}
                            >
                                Connect WhatsApp
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Batch Messaging Bar */}
            <BatchMessagingBar
                selectedCount={selectedMessageEntries.length}
                remainingMessages={remainingMessages}
                messageContent={messageContent}
                onMessageChange={setMessageContent}
                onSendBatch={handleSendBatchMessages}
                onClear={() => setSelectedMessageEntries([])}
                batchSending={batchSending}
                whatsappInitialized={whatsappInitialized}
                onConnectWhatsApp={() => setWhatsappConnectModalOpen(true)}
            />

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
            <ColdCallCampaignModal
                visible={coldCallModalVisible}
                onCancel={() => {
                    setColdCallModalVisible(false);
                    coldCallForm.resetFields();
                }}
                form={coldCallForm}
                onFinish={handleCreateColdCallCampaign}
                leadData={leadData}
                leadsWithPhoneCount={leadsWithPhone.length}
                notCalledCount={notCalledLeads.length}
                campaignLoading={campaignLoading}
            />

            {/* Message Campaign Modal */}
            <MessageCampaignModal
                visible={messageModalVisible}
                onCancel={() => {
                    setMessageModalVisible(false);
                    messageForm.resetFields();
                }}
                form={messageForm}
                onFinish={handleCreateMessageCampaign}
                leadData={leadData}
                leadsWithPhoneCount={leadsWithPhone.length}
                notMessagedCount={notMessagedLeads.length}
                campaignLoading={campaignLoading}
            />
        </div>
    );
};

export default QualifiedLeadsDetailPage;