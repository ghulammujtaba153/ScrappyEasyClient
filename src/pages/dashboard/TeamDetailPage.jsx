import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';
import { useSocket } from '../../context/SocketContext';
import { Table, Select, message, Popconfirm, Tooltip, Tag, Button, Alert } from 'antd';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaUsers, FaPhone, FaLink, FaEye, FaFileDownload } from 'react-icons/fa';
import { MdCheckCircle, MdClose } from 'react-icons/md';
import { BsWhatsapp } from 'react-icons/bs';
import Loader from '../../components/common/Loader';
import TeamDataModal from '../../components/dashboard/TeamDataModal';
import WhatsAppConnectModal from '../../components/dashboard/WhatsAppConnectModal';
import Dialer from '../../components/Dialer';
import SubscriptionRestrictedModal from '../../components/SubscriptionRestrictedModal';
import { checkAccessStatus } from '../../api/subscriptionApi';

const TeamDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token, setActiveTeam } = useAuth();
    const { onlineUsers } = useSocket();

    // Effect to clear activeTeam on unmount
    useEffect(() => {
        return () => {
            setActiveTeam(null);
        };
    }, [setActiveTeam]);

    const [team, setTeam] = useState(null);
    const [teamData, setTeamData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [currentData, setCurrentData] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Dialer State
    const [isDialerOpen, setIsDialerOpen] = useState(false);
    const [dialerNumber, setDialerNumber] = useState('');
    const [selectedDataId, setSelectedDataId] = useState(null);

    // WhatsApp Connection State
    const [whatsappInitialized, setWhatsappInitialized] = useState(false);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

    // Subscription State
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
    const [lockedFeature, setLockedFeature] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        phone: [],
        link: '',
        status: 'new'
    });

    // Helper to gate premium actions
    const requireSubscription = (featureName) => {
        if (!isAuthorized) {
            setLockedFeature(featureName);
            setIsLockedModalOpen(true);
            return false;
        }
        return true;
    };

    // Check if user has access to this team
    const hasAccess = () => {
        if (!team || !user) return false;
        const isOwner = team.owner?._id === user._id;
        const isMember = team.members?.some(m => m._id === user._id);
        return isOwner || isMember;
    };

    // Check WhatsApp connection status
    const checkWhatsAppStatus = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/verification/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && res.data.data) {
                const status = res.data.data;
                setWhatsappInitialized(status.isConnected);
                return status;
            }
        } catch (error) {
            console.error('WhatsApp status check failed:', error);
        }
        return null;
    };

    // Disconnect WhatsApp
    const disconnectWhatsApp = async () => {
        const userId = user?._id || user?.id;
        try {
            const res = await axios.post(`${BASE_URL}/api/verification/disconnect`, { userId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setWhatsappInitialized(false);
                message.success('WhatsApp disconnected successfully. You can now link a different device.');
            }
        } catch (error) {
            console.error('Disconnect error:', error);
            message.error(error.response?.data?.error || 'Failed to disconnect WhatsApp');
        }
    };

    // Combined fetch for initial load to avoid "Access Denied" flash
    const initPage = async () => {
        try {
            setLoading(true);
            // Fetch team details and data in parallel
            const [teamRes, dataRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/team/get/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${BASE_URL}/api/team-data/get/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setTeam(teamRes.data);
            setActiveTeam(teamRes.data);
            setTeamData(dataRes.data);

            // Check WhatsApp status
            checkWhatsAppStatus();
            
            // Check subscription status
            const status = await checkAccessStatus(user?._id || user?.id, token);
            setIsAuthorized(status.isAuthorized);

        } catch (error) {
            console.error('Initialization error:', error);
            // If it's a 403/404 we might want to handle it specifically, 
            // but team fetch already has a catch inside if kept separate.
            // For now, coordinated error handling:
            if (error.response?.status === 403 || error.response?.status === 404) {
                // Keep team null, hasAccess will return false
            } else {
                message.error('Failed to load team environment');
            }
        } finally {
            setLoading(false);
        }
    };

    // Keep individual refresh functions but without individual setLoading(false) for secondary updates
    const fetchTeamData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/team-data/get/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeamData(res.data);
        } catch (error) {
            console.error('Error fetching team data:', error);
            message.error('Failed to refresh data');
        }
    };


    // Handle verify WhatsApp for a specific data entry
    const handleVerifyWhatsApp = async (dataId, phoneNumber) => {
        try {
            const res = await axios.post(
                `${BASE_URL}/api/verification/check`,
                { phoneNumbers: [phoneNumber], teamDataId: dataId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success && res.data.data && res.data.data.results.length > 0) {
                const result = res.data.data.results[0];
                const isRegistered = result?.isRegistered;
                const whatsappStatus = isRegistered ? 'verified' : 'not-verified';
                
                // Update database with verification result
                await axios.put(
                    `${BASE_URL}/api/team-data/update/${dataId}`,
                    { whatsappStatus },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (isRegistered) {
                    message.success('WhatsApp number verified!');
                } else {
                    message.info('Number does not have WhatsApp');
                }
                
                fetchTeamData();
            } else {
                message.error(res.data.error || 'Failed to verify WhatsApp number');
            }
        } catch (error) {
            console.error('Error verifying WhatsApp number:', error);
            message.error(error.response?.data?.error || 'Failed to verify WhatsApp number');
        }
    };

    // Handle mark as not WhatsApp for a specific data entry
    const handleMarkNotWhatsApp = async (dataId) => {
        try {
            await axios.put(
                `${BASE_URL}/api/team-data/update/${dataId}`,
                { whatsappStatus: 'not-verified' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success('Marked as not WhatsApp');
            fetchTeamData();
        } catch (error) {
            console.error('Error updating WhatsApp status:', error);
            message.error('Failed to update status');
        }
    };

    // Handle verify all WhatsApp numbers in bulk
    const handleVerifyAllWhatsApp = async () => {
        const unverifiedData = teamData.filter(data => 
            Array.isArray(data.phone) && 
            data.phone.length > 0 && 
            data.whatsappStatus !== 'verified'
        );

        if (unverifiedData.length === 0) {
            message.info('All numbers are already verified or no numbers to verify');
            return;
        }

        const phoneToDataMap = {};
        const phoneNumbers = [];
        
        unverifiedData.forEach(data => {
            const phoneNumber = data.phone[0]?.number;
            if (phoneNumber) {
                phoneNumbers.push(phoneNumber);
                phoneToDataMap[phoneNumber] = data;
            }
        });

        if (phoneNumbers.length === 0) {
            message.warning('No valid phone numbers to verify');
            return;
        }

        message.loading({ content: `Verifying ${phoneNumbers.length} phone numbers...`, duration: 0 });

        try {
            const res = await axios.post(
                `${BASE_URL}/api/verification/check`,
                { phoneNumbers, teamId: id, userId: user?._id || user?.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success && res.data.data && res.data.data.results) {
                const results = res.data.data.results;
                const updates = [];

                for (const result of results) {
                    const phoneNumber = result.phoneNumber;
                    const dataEntry = phoneToDataMap[phoneNumber];
                    
                    if (dataEntry && result.success) {
                        const whatsappStatus = result.isRegistered ? 'verified' : 'not-verified';
                        
                        updates.push({
                            id: dataEntry._id,
                            data: { whatsappStatus }
                        });
                    }
                }

                if (updates.length > 0) {
                    const updateRes = await axios.post(
                        `${BASE_URL}/api/team-data/bulk-update`,
                        { updates },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    message.destroy();
                    if (updateRes.data.success) {
                        message.success(`Verified and saved results!`);
                        fetchTeamData();
                    }
                } else {
                    message.destroy();
                    message.warning('No valid results found');
                }
            } else {
                message.destroy();
                message.error(res.data.error || 'Failed to verify WhatsApp numbers');
            }
        } catch (error) {
            message.destroy();
            console.error('Batch verification error:', error);
            message.error('Failed to verify numbers');
        }
    };

    useEffect(() => {
        if (id && token && user) {
            initPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, token]);

    const handleOpenModal = (data = null, viewOnly = false) => {
        if (!viewOnly && !requireSubscription('Add/Edit Data')) return;
        if (data) {
            setIsEditMode(!viewOnly);
            setIsViewMode(viewOnly);
            setCurrentData(data);
            setFormData({
                title: data.title || '',
                description: data.description || '',
                phone: Array.isArray(data.phone) ? data.phone : [],
                link: data.link || '',
                status: data.status || 'new'
            });
        } else {
            setIsEditMode(false);
            setIsViewMode(false);
            setCurrentData(null);
            setFormData({
                title: '',
                description: '',
                phone: [],
                link: '',
                status: 'new'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentData(null);
        setFormData({
            title: '',
            description: '',
            phone: [],
            link: '',
            status: 'new'
        });
        setIsEditMode(false);
        setIsViewMode(false);
    };

    const handleSubmit = async () => {
        const phones = Array.isArray(formData.phone) ? formData.phone : [];
        if (!phones || phones.length === 0) {
            message.error('At least one phone number is required');
            return;
        }

        setSubmitting(true);
        try {
            if (isEditMode) {
                await axios.put(
                    `${BASE_URL}/api/team-data/update/${currentData._id}`,
                    { ...formData, phone: phones, team: id, user: user._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                message.success('Data updated successfully');
            } else {
                await axios.post(
                    `${BASE_URL}/api/team-data/create`,
                    { ...formData, phone: phones, team: id, user: user._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                message.success('Data created successfully');
            }
            handleCloseModal();
            fetchTeamData();
        } catch (error) {
            console.error('Error saving data:', error);
            message.error(error.response?.data?.error || 'Failed to save data');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (dataId) => {
        try {
            await axios.delete(`${BASE_URL}/api/team-data/delete/${dataId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success('Data deleted successfully');
            fetchTeamData();
        } catch (error) {
            console.error('Error deleting data:', error);
            message.error('Failed to delete data');
        }
    };

    // Handle inline status update
    const handleStatusChange = async (dataId, newStatus) => {
        try {
            await axios.put(
                `${BASE_URL}/api/team-data/update/${dataId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success('Status updated successfully');
            fetchTeamData();
        } catch (error) {
            console.error('Error updating status:', error);
            message.error('Failed to update status');
        }
    };

    const handleOpenDialer = (phoneNumber = '', dataId = null) => {
        setDialerNumber(phoneNumber);
        setSelectedDataId(dataId);
        setIsDialerOpen(true);
    };

    const handleCloseDialer = () => {
        setIsDialerOpen(false);
        setDialerNumber('');
        setSelectedDataId(null);
    };

    // Get rows with phone numbers
    const rowsWithPhone = teamData.filter(data => Array.isArray(data.phone) && data.phone.length > 0);

    // Find current index based on selected data
    const currentIndex = selectedDataId
        ? rowsWithPhone.findIndex(data => data._id === selectedDataId)
        : -1;

    // Handle dialer navigation
    const handleDialerPrevious = () => {
        if (currentIndex > 0) {
            const prevData = rowsWithPhone[currentIndex - 1];
            // Use first phone number for dialer
            const firstPhone = prevData.phone[0]?.number || '';
            handleOpenDialer(firstPhone, prevData._id);
        }
    };

    const handleDialerNext = () => {
        if (currentIndex < rowsWithPhone.length - 1) {
            const nextData = rowsWithPhone[currentIndex + 1];
            // Use first phone number for dialer
            const firstPhone = nextData.phone[0]?.number || '';
            handleOpenDialer(firstPhone, nextData._id);
        }
    };

    // When call ends, optionally show next entry
    const onCallEnd = () => {
        // You can add logic here if needed, e.g., automatically navigate to next
        // For now, just keep the dialer open
    };

    // Handle CSV Export
    const handleExportCSV = () => {
        if (!requireSubscription('CSV Export')) return;
        if (!teamData || teamData.length === 0) {
            message.warning('No data available to export');
            return;
        }

        // CSV Headers
        const headers = [
            'Title',
            'Description',
            'Phones',
            'Link',
            'Status',
            'WhatsApp Status',
            'Added By',
            'Created Date'
        ];

        // Format data rows
        const rows = teamData.map(item => {
            const phones = Array.isArray(item.phone) 
                ? item.phone.map(p => `${p.title || 'Phone'}: ${p.number}`).join('; ') 
                : '';
            
            return [
                `"${(item.title || '').replace(/"/g, '""')}"`,
                `"${(item.description || '').replace(/"/g, '""')}"`,
                `"${phones.replace(/"/g, '""')}"`,
                `"${(item.link || '').replace(/"/g, '""')}"`,
                `"${(item.status || '').toUpperCase()}"`,
                `"${(item.whatsappStatus || 'not verified').toUpperCase()}"`,
                `"${(item.user?.name || item.user?.email || 'Unknown').replace(/"/g, '""')}"`,
                `"${new Date(item.createdAt).toLocaleDateString()}"`
            ];
        });

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${team?.name || 'team'}_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success('Lead database exported successfully');
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            render: (text) => text || '-'
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: 220,
            render: (phones) => {
                if (!Array.isArray(phones) || phones.length === 0) return '-';
                return (
                    <div className="space-y-1">
                        {phones.map((phone, index) => (
                            <div key={index} className="text-xs">
                                <span className="text-gray-500">{phone.title || 'Phone'}:</span> {phone.number}
                            </div>
                        ))}
                    </div>
                );
            }
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 200,
            ellipsis: true,
            render: (text) => text || '-'
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
            width: 80,
            render: (link) => link ? (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                    <FaLink /> View
                </a>
            ) : '-'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (status, record) => (
                <Select
                    value={status}
                    onChange={(value) => handleStatusChange(record._id, value)}
                    variant="borderless"
                    className={`rounded-full px-2 font-bold text-xs uppercase ${
                        status === 'new' ? 'bg-blue-50 text-blue-600' :
                        status === 'contacted' ? 'bg-orange-50 text-orange-600' :
                        status === 'qualified' ? 'bg-green-50 text-green-600' :
                        'bg-red-50 text-red-600'
                    }`}
                    style={{ width: '100%' }}
                    options={[
                        { value: 'new', label: 'New' },
                        { value: 'contacted', label: 'Contacted' },
                        { value: 'qualified', label: 'Qualified' },
                        { value: 'unqualified', label: 'Unqualified' }
                    ]}
                />
            )
        },
        {
            title: 'WhatsApp',
            dataIndex: 'whatsappStatus',
            key: 'whatsappStatus',
            width: 130,
            render: (status, record) => {
                if (status === 'verified') {
                    return <Tag color="success" icon={<MdCheckCircle />}>Verified</Tag>;
                }
                if (status === 'not-verified') {
                    return <Tag color="error" icon={<MdClose />}>No WhatsApp</Tag>;
                }
                const hasPhone = Array.isArray(record.phone) && record.phone.length > 0;
                return (
                    <Tooltip title={hasPhone ? 'Click actions to verify' : 'No phone number'}>
                        <Tag color="default">Not Checked</Tag>
                    </Tooltip>
                );
            }
        },
        {
            title: 'Added By',
            dataIndex: 'user',
            key: 'user',
            width: 120,
            render: (userData) => (
                <span className="text-gray-600">
                    {userData?.name || userData?.email || 'Unknown'}
                </span>
            )
        },
        {
            title: 'Call',
            key: 'call',
            width: 80,
            render: (_, record) => {
                const hasPhone = Array.isArray(record.phone) && record.phone.length > 0;
                const firstPhone = hasPhone ? record.phone[0]?.number : '';
                return (
                    <button
                        onClick={() => handleOpenDialer(firstPhone, record._id)}
                        disabled={!hasPhone}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={hasPhone ? `Call ${firstPhone}` : 'No phone number'}
                    >
                        <FaPhone />
                    </button>
                );
            }
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 80,
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            width: 120,
            render: (_, record) => {
                const hasPhone = Array.isArray(record.phone) && record.phone.length > 0;
                const firstPhone = hasPhone ? record.phone[0]?.number : '';
                const isVerified = record.whatsappStatus === 'verified';

                return (
                    <div className="flex gap-2">
                        {hasPhone && !isVerified && (
                             <Tooltip title="Verify WhatsApp">
                                <button
                                    onClick={() => handleVerifyWhatsApp(record._id, firstPhone)}
                                    className="w-9 h-9 flex items-center justify-center text-green-500 hover:bg-green-50 rounded-xl transition-all"
                                >
                                    <BsWhatsapp size={16} />
                                </button>
                            </Tooltip>
                        )}
                        {hasPhone && !isVerified && record.whatsappStatus !== 'not-verified' && (
                             <Tooltip title="Mark No WhatsApp">
                                <button
                                    onClick={() => handleMarkNotWhatsApp(record._id)}
                                    className="w-9 h-9 flex items-center justify-center text-orange-400 hover:bg-orange-50 rounded-xl transition-all"
                                >
                                    <MdClose size={18} />
                                </button>
                            </Tooltip>
                        )}
                        <Tooltip title="Quick View">
                            <button
                                onClick={() => handleOpenModal(record, true)}
                                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                            >
                                <FaEye size={16} />
                            </button>
                        </Tooltip>
                        <Tooltip title="Edit Record">
                            <button
                                onClick={() => handleOpenModal(record, false)}
                                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            >
                                <FaEdit size={16} />
                            </button>
                        </Tooltip>
                        <Popconfirm
                            title="Delete Lead?"
                            description="Are you sure you want to remove this lead?"
                            onConfirm={() => handleDelete(record._id)}
                            okText="Yes, Delete"
                            cancelText="No"
                            okButtonProps={{ danger: true, className: '!rounded-lg !font-bold' }}
                            cancelButtonProps={{ className: '!rounded-lg' }}
                        >
                            <button
                                className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <FaTrash size={14} />
                            </button>
                        </Popconfirm>
                    </div>
                );
            }
        }
    ];

    if (loading) {
        return <Loader />;
    }

    if (!hasAccess()) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You don't have access to this team.</p>
                    <button
                        onClick={() => navigate('/dashboard/team')}
                        className="text-primary hover:text-primary/80"
                    >
                        Back to Teams
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* WhatsApp Connection Status */}
                <div className="relative">
                    {whatsappInitialized ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                    <BsWhatsapp size={20} />
                                </div>
                                <div>
                                    <h3 className="text-md font-bold text-gray-800">WhatsApp Connected</h3>
                                    <p className="text-gray-500 text-xs">Bulk verification and automated messaging enabled.</p>
                                </div>
                            </div>
                            <button
                                onClick={disconnectWhatsApp}
                                className="px-4 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                            >
                                <MdClose /> Disconnect
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                                    <BsWhatsapp size={20} />
                                </div>
                                <div>
                                    <h3 className="text-md font-bold text-gray-800">Link WhatsApp</h3>
                                    <p className="text-gray-500 text-xs">Connect your account to unlock bulk verification tools.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { if (!requireSubscription('WhatsApp Connect')) return; setIsConnectModalOpen(true); }}
                                className="bg-[#25D366] hover:bg-[#128C7E] text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                            >
                                <BsWhatsapp /> Connect Now
                            </button>
                        </div>
                    )}
                </div>

                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard/team')}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                            <FaArrowLeft size={14} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                {team?.name}
                                <Tag color="blue" className="rounded-full px-2 py-0 border-none font-medium text-xs m-0 relative -top-0.5">
                                    {team?.members?.length || 0} MEMBERS
                                </Tag>
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Managed by {team?.owner?.name || team?.owner?.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                        >
                            <FaFileDownload size={14} />
                            Export
                        </button>
                        <button
                            onClick={() => { if (!requireSubscription('WhatsApp Verification')) return; handleVerifyAllWhatsApp(); }}
                            className="flex items-center gap-2 bg-white border border-green-500 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors font-medium text-sm"
                        >
                            <MdCheckCircle size={16} />
                            Verify
                        </button>
                        <button
                            onClick={() => { if (!requireSubscription('Dialer')) return; handleOpenDialer(); }}
                            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                        >
                            <FaPhone size={12} />
                            Dialer
                        </button>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                        >
                            <FaPlus size={14} />
                            New Record
                        </button>
                    </div>
                </div>

                {/* Team Collaboration Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            Team Collaboration
                        </h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        {/* Owner Bubble */}
                        <div className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:shadow-sm">
                            <div className="relative">
                                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold">
                                    {(team?.owner?.name || team?.owner?.email)?.[0]?.toUpperCase()}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${(onlineUsers.some(u => u.userId === team?.owner?._id) || team?.owner?._id === user?._id)
                                    ? 'bg-green-500 shadow-sm shadow-green-200'
                                    : 'bg-slate-300'
                                    }`}></div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 leading-none">
                                    {team?.owner?.name || team?.owner?.email?.split('@')[0]}
                                </p>
                                <p className="text-[10px] font-medium text-primary uppercase tracking-tighter mt-1">Workspace Owner</p>
                            </div>
                        </div>

                        {/* Member Bubbles */}
                        {team?.members?.map((member) => {
                            const isOnline = onlineUsers.some(u => u.userId === member._id) || member._id === user?._id;
                            const isMe = member._id === user._id;

                            return (
                                <Tooltip key={member._id} title={isOnline ? "Active Now" : "Currently Away"}>
                                    <div className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl border transition-all hover:shadow-sm ${isMe 
                                        ? 'bg-blue-50 border-blue-100' 
                                        : 'bg-white border-slate-100'}`}>
                                        <div className="relative">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${isMe ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                                {(member.name || member.email)?.[0]?.toUpperCase()}
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isOnline 
                                                ? 'bg-green-500 shadow-sm shadow-green-200' 
                                                : 'bg-slate-300'}`}></div>
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold leading-none ${isMe ? 'text-blue-900' : 'text-slate-800'}`}>
                                                {member.name || member.email?.split('@')[0]}
                                            </p>
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter mt-1">
                                                {isMe ? 'Current Session' : 'Team Member'}
                                            </p>
                                        </div>
                                    </div>
                                </Tooltip>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-800">Lead Database</h2>
                        <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">
                            {teamData?.length || 0} Entries
                        </span>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={teamData}
                        rowKey="_id"
                        rowClassName={(record) =>
                            selectedDataId === record._id
                                ? 'bg-blue-50 hover:bg-blue-100'
                                : ''
                        }
                        scroll={{ x: 1200 }}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                        }}
                        locale={{
                            emptyText: (
                                <div className="py-8 text-center">
                                    <FaUsers className="mx-auto text-4xl text-gray-300 mb-3" />
                                    <p className="text-gray-500">No data yet. Click "Add Data" to get started.</p>
                                </div>
                            )
                        }}
                    />
                </div>

                {/* Add/Edit/View Modal */}
                <TeamDataModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    formData={formData}
                    setFormData={setFormData}
                    isEditMode={isEditMode}
                    isViewMode={isViewMode}
                    submitting={submitting}
                />

                {/* Dialer Component */}
                {isDialerOpen && (
                    <Dialer
                        onClose={handleCloseDialer}
                        phoneNumber={dialerNumber}
                        onCallEnd={onCallEnd}
                        onPrevious={handleDialerPrevious}
                        onNext={handleDialerNext}
                        hasPrevious={currentIndex > 0}
                        hasNext={currentIndex >= 0 && currentIndex < rowsWithPhone.length - 1}
                        currentLeadName={selectedDataId
                            ? teamData.find(d => d._id === selectedDataId)?.title
                            : ''}
                    />
                )}

                {/* WhatsApp Connect Modal */}
                <WhatsAppConnectModal
                    visible={isConnectModalOpen}
                    onCancel={() => setIsConnectModalOpen(false)}
                    onConnected={() => {
                        setWhatsappInitialized(true);
                        setIsConnectModalOpen(false);
                        checkWhatsAppStatus();
                    }}
                    onDisconnected={() => {
                        setWhatsappInitialized(false);
                        checkWhatsAppStatus();
                    }}
                />

                {/* Subscription Restricted Modal */}
                <SubscriptionRestrictedModal
                    open={isLockedModalOpen}
                    onClose={() => setIsLockedModalOpen(false)}
                    featureName={lockedFeature}
                />
            </div>
        </div>
    );
};

export default TeamDetailPage;
