import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';
import { useSocket } from '../../context/SocketContext';
import { Table, Select, message, Popconfirm, Tooltip, Tag, Button, Alert } from 'antd';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaUsers, FaPhone, FaLink, FaEye } from 'react-icons/fa';
import { MdCheckCircle, MdClose } from 'react-icons/md';
import { BsWhatsapp } from 'react-icons/bs';
import Loader from '../../components/common/Loader';
import TeamDataModal from '../../components/dashboard/TeamDataModal';
import WhatsAppConnectModal from '../../components/dashboard/WhatsAppConnectModal';
import Dialer from '../../components/Dialer';

const TeamDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const { onlineUsers } = useSocket();

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

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        phone: [],
        link: '',
        status: 'new'
    });

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
        try {
            const res = await axios.post(`${BASE_URL}/api/verification/disconnect`, {}, {
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

    // Fetch team details
    const fetchTeam = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/team/get/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeam(res.data);
        } catch (error) {
            console.error('Error fetching team:', error);
            message.error('Failed to fetch team details');
        }
    };

    // Fetch team data
    const fetchTeamData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/team-data/get/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeamData(res.data);
        } catch (error) {
            console.error('Error fetching team data:', error);
            message.error('Failed to fetch team data');
        } finally {
            setLoading(false);
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

        // Create a map of phone numbers to their data IDs and full data
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
                { phoneNumbers, teamId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success && res.data.data && res.data.data.results) {
                const results = res.data.data.results;
                const updates = [];

                // Prepare bulk update data
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

                if (updates.length === 0) {
                    message.destroy();
                    message.warning('No valid results to update');
                    return;
                }

                // Single API call to update all records at once
                const updateRes = await axios.post(
                    `${BASE_URL}/api/team-data/bulk-update`,
                    { updates },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                message.destroy();

                if (updateRes.data.success) {
                    message.success(`Verified and saved ${updateRes.data.data.successful} numbers successfully!`);
                    if (updateRes.data.data.failed > 0) {
                        message.warning(`Failed to save ${updateRes.data.data.failed} entries`);
                    }
                    fetchTeamData();
                } else {
                    message.error(updateRes.data.error || 'Failed to save verification results');
                }
            } else {
                message.destroy();
                message.error(res.data.error || 'Failed to verify WhatsApp numbers');
            }
        } catch (error) {
            message.destroy();
            console.error('Batch verification error:', error);
            message.error('Failed to verify numbers: ' + (error.response?.data?.error || error.message));
        }
    };

    useEffect(() => {
        if (id && token) {
            fetchTeam();
            fetchTeamData();
            checkWhatsAppStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, token]);

    const handleOpenModal = (data = null, viewOnly = false) => {
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

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => text || '-'
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
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
            ellipsis: true,
            render: (text) => text || '-'
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
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
            render: (status, record) => (
                <Select
                    value={status}
                    onChange={(value) => handleStatusChange(record._id, value)}
                    size="small"
                    style={{ width: 120 }}
                    options={[
                        { value: 'new', label: <span className="text-blue-600">New</span> },
                        { value: 'contacted', label: <span className="text-orange-600">Contacted</span> },
                        { value: 'qualified', label: <span className="text-green-600">Qualified</span> },
                        { value: 'unqualified', label: <span className="text-red-600">Unqualified</span> }
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
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {
                const hasPhone = Array.isArray(record.phone) && record.phone.length > 0;
                const firstPhone = hasPhone ? record.phone[0]?.number : '';
                return (
                    <div className="flex gap-1 flex-wrap">
                        <button
                            onClick={() => handleOpenModal(record, true)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="View"
                        >
                            <FaEye />
                        </button>
                        <button
                            onClick={() => handleOpenModal(record, false)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <FaEdit />
                        </button>
                        {/* {hasPhone && record.whatsappStatus !== 'verified' && record.whatsappStatus !== 'not-verified' && (
                            <Tooltip title="Verify WhatsApp">
                                <button
                                    onClick={() => handleVerifyWhatsApp(record._id, firstPhone)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Verify WhatsApp"
                                >
                                    <MdCheckCircle />
                                </button>
                            </Tooltip>
                        )}
                        {hasPhone && record.whatsappStatus !== 'not-verified' && (
                            <Tooltip title="Not WhatsApp">
                                <button
                                    onClick={() => handleMarkNotWhatsApp(record._id)}
                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                    title="Mark as not WhatsApp"
                                >
                                    <MdClose />
                                </button>
                            </Tooltip>
                        )} */}
                        <Popconfirm
                            title="Delete this data?"
                            description="This action cannot be undone."
                            onConfirm={() => handleDelete(record._id)}
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                        >
                            <button
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <FaTrash />
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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto">
                {/* WhatsApp Connection Status */}
                {whatsappInitialized ? (
                    <div className="bg-white rounded-lg shadow-md p-6 border border-green-100 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <Alert
                                type="success"
                                showIcon
                                message="WhatsApp Connected"
                                description="You can verify phone numbers in bulk from this team."
                                className="bg-green-50 border-green-100 text-green-800 flex-1"
                            />
                            <Button
                                danger
                                icon={<MdClose />}
                                onClick={disconnectWhatsApp}
                            >
                                Disconnect WhatsApp
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6 border border-yellow-100 mb-8">
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800">Connect WhatsApp</h3>
                                <p className="text-gray-600 mt-2">
                                    Link your WhatsApp account to verify phone numbers.
                                </p>
                            </div>
                            <Button
                                type="primary"
                                icon={<BsWhatsapp />}
                                onClick={() => setIsConnectModalOpen(true)}
                                size="large"
                                className="bg-[#0F792C] hover:bg-[#0a5a20] border-none"
                            >
                                Connect WhatsApp
                            </Button>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard/team')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                    >
                        <FaArrowLeft /> Back to Teams
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <FaUsers className="text-primary" />
                                {team?.name}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {team?.members?.length || 0} members • Owner: {team?.owner?.name || team?.owner?.email}
                            </p>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <button
                                onClick={handleVerifyAllWhatsApp}
                                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <MdCheckCircle />
                                Verify All WhatsApp
                            </button>
                            <button
                                onClick={() => handleOpenDialer()}
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <FaPhone />
                                Show Dialer
                            </button>
                            <button
                                onClick={() => handleOpenModal()}
                                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <FaPlus />
                                Add Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Team Members */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Team Members</h3>
                    <div className="flex flex-wrap gap-2">
                        {/* Owner */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                            <div className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${(onlineUsers.some(u => u.userId === team?.owner?._id) || team?.owner?._id === user?._id)
                                    ? 'bg-green-400'
                                    : 'hidden'
                                    }`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${(onlineUsers.some(u => u.userId === team?.owner?._id) || team?.owner?._id === user?._id)
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                                    }`}></span>
                            </div>
                            {team?.owner?.name || team?.owner?.email} (Owner)
                        </div>

                        {/* Members */}
                        {team?.members?.map((member) => {
                            const isOnline = onlineUsers.some(u => u.userId === member._id) || member._id === user?._id;

                            return (
                                <div
                                    key={member._id}
                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${member._id === user._id
                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                        : 'bg-gray-50 text-gray-700 border-gray-200'
                                        }`}
                                >
                                    <Tooltip title={isOnline ? "Online" : "Offline"}>
                                        <div className="relative flex h-2 w-2 cursor-help">
                                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-green-400' : 'hidden'
                                                }`}></span>
                                            <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-green-500' : 'bg-gray-300'
                                                }`}></span>
                                        </div>
                                    </Tooltip>
                                    {member.name || member.email}
                                    {member._id === user._id && ' (You)'}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
            </div>
        </div>
    );
};

export default TeamDetailPage;
