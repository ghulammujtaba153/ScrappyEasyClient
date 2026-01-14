import React, { useEffect, useState } from 'react';
import { Table, Button, message, Popconfirm, Tag, Space, Modal, Progress, Input, Alert, Badge, Tooltip, Checkbox, Form, Spin } from 'antd';
import { FiTrash2, FiEdit2, FiPlay, FiRefreshCw, FiSend, FiUsers } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import { MessageOutlined, SendOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { BASE_URL } from '../../config/URL';
import WhatsAppConnectModal from '../../components/dashboard/WhatsAppConnectModal';
import { checkAccessStatus } from '../../api/subscriptionApi';
import SubscriptionRestrictedModal from '../../components/SubscriptionRestrictedModal';
import { MdLock } from 'react-icons/md';
import { isQualifiedLeadsCampaign, getStats } from '../../components/message-automation/utils';
import AutomationDetailModal from '../../components/message-automation/AutomationDetailModal';
import EditCampaignModal from '../../components/message-automation/EditCampaignModal';

const MessageAutomationPage = () => {
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    // Detail Modal State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [currentList, setCurrentList] = useState(null);
    const [sending, setSending] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [connectModalOpen, setConnectModalOpen] = useState(false);
    const [whatsappInitialized, setWhatsappInitialized] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Daily limit and batch selection
    const [remainingMessages, setRemainingMessages] = useState(10);
    const [selectedEntryIds, setSelectedEntryIds] = useState([]);
    const [sendingEntryId, setSendingEntryId] = useState(null);

    // Subscription/Trial State
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [accessType, setAccessType] = useState('trial');
    const [trialInfo, setTrialInfo] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
    const [lockedFeature, setLockedFeature] = useState('');

    // Edit Modal State
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [editForm] = Form.useForm();

    const handleConnectWhatsAppClick = () => {
        if (!isAuthorized) {
            setLockedFeature('WhatsApp Connection');
            setIsLockedModalOpen(true);
            return;
        }
        setConnectModalOpen(true);
    };



    const checkWhatsAppStatus = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/verification/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && res.data.data) {
                setWhatsappInitialized(res.data.data.isConnected);
            }
        } catch (fetchError) {
            console.error('Status check failed:', fetchError);
        }
    };

    const fetchRemainingMessages = async () => {
        try {
            const userId = user._id || user.id;
            const res = await axios.get(`${BASE_URL}/api/automate/remaining/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setRemainingMessages(res.data.remaining);
            }
        } catch (fetchError) {
            console.error('Failed to fetch remaining messages:', fetchError);
        }
    };

    const disconnectWhatsApp = async () => {
        try {
            const res = await axios.post(`${BASE_URL}/api/verification/disconnect`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setWhatsappInitialized(false);
                message.success('WhatsApp disconnected');
            }
        } catch (disconnectError) {
            console.error('Disconnect error:', disconnectError);
            message.error('Failed to disconnect');
        }
    };

    const fetchData = async () => {
        if (!user?._id && !user?.id) return;

        setLoading(true);
        try {
            const userId = user._id || user.id;
            const res = await axios.get(`${BASE_URL}/api/automate/all/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) {
                setData(res.data);

                // If a list is open, refresh its data too
                if (currentList) {
                    const updatedList = res.data.find(item => item._id === currentList._id);
                    if (updatedList) setCurrentList(updatedList);
                }
            }
        } catch (fetchError) {
            console.error('Fetch error:', fetchError);
            message.error('Failed to load automated message lists');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || !token) return;

        const init = async () => {
            setCheckingAuth(true);
            const status = await checkAccessStatus(user?._id || user?.id, token);
            setIsAuthorized(status.isAuthorized);
            setAccessType(status.type);
            setTrialInfo(status.trial);
            setCheckingAuth(false);

            fetchData();
            fetchRemainingMessages();
            if (status.isAuthorized) {
                checkWhatsAppStatus();
            }
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token]);

    const handleOpenDetail = (list) => {
        setCurrentList(list);
        setMessageContent(list.message || '');
        setSelectedEntryIds([]);
        setDetailModalOpen(true);
        fetchRemainingMessages();
    };

    const handleEditClick = (record) => {
        setSelectedCampaign(record);
        editForm.setFieldsValue({ name: record.name });
        setEditModalVisible(true);
    };

    const handleUpdateCampaign = async (values) => {
        setEditLoading(true);
        try {
            await axios.put(`${BASE_URL}/api/automate/update/${selectedCampaign._id}`,
                { name: values.name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success('Campaign updated successfully');
            setEditModalVisible(false);
            fetchData();
        } catch (updateError) {
            console.error('Update error:', updateError);
            message.error('Failed to update campaign');
        } finally {
            setEditLoading(false);
        }
    };

    const handleSaveMessage = async () => {
        try {
            await axios.put(`${BASE_URL}/api/automate/update/${currentList._id}`,
                { message: messageContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success('Message content updated');
            fetchData();
        } catch (saveError) {
            console.error('Save message error:', saveError);
            message.error('Failed to update message');
        }
    };

    const handleSendBatch = async () => {
        if (!isAuthorized) {
            setLockedFeature('Auto Batch Messaging');
            setIsLockedModalOpen(true);
            return;
        }
        if (!messageContent) {
            message.error('Please configure a message first');
            return;
        }

        setSending(true);
        try {
            const res = await axios.post(`${BASE_URL}/api/automate/send-batch`, {
                listId: currentList._id,
                batchSize: 10
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                message.success(`Batch processed: ${res.data.processed} messages`);
                fetchData(); // Refresh UI
            } else {
                message.warning(res.data.message || 'No messages processed');
            }
        } catch (batchError) {
            console.error('Batch send error:', batchError);
            message.error('Failed to send batch: ' + (batchError.response?.data?.error || batchError.message));
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/automate/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success('List deleted successfully');
            fetchData();
            if (currentList?._id === id) setDetailModalOpen(false);
        } catch (deleteError) {
            console.error('Delete error:', deleteError);
            message.error('Failed to delete list');
        }
    };

    // Send single message to one recipient
    const handleSendSingle = async (record) => {
        if (!isAuthorized) {
            setLockedFeature('Single Messaging');
            setIsLockedModalOpen(true);
            return;
        }
        if (remainingMessages <= 0) {
            message.error('Daily message limit (10) reached. Try again tomorrow.');
            return;
        }
        if (!messageContent) {
            message.error('Please configure a message first');
            return;
        }
        if (!record.isQualifiedLead) {
            message.warning('Single send only works with qualified leads');
            return;
        }

        setSendingEntryId(record._id);
        try {
            const userId = user._id || user.id;
            const res = await axios.post(`${BASE_URL}/api/automate/send-single`, {
                qualifiedLeadId: currentList.qualifiedLeadsId._id,
                entryId: record._id,
                messageContent,
                userId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                message.success(`Message sent to ${res.data.businessName}`);
                setRemainingMessages(res.data.remainingMessages);
                fetchData();
            }
        } catch (sendError) {
            console.error('Send error:', sendError);
            const errorMsg = sendError.response?.data?.error || 'Failed to send message';
            message.error(errorMsg);
            if (sendError.response?.data?.remainingMessages !== undefined) {
                setRemainingMessages(sendError.response.data.remainingMessages);
            }
        } finally {
            setSendingEntryId(null);
        }
    };

    // Send batch messages to selected entries
    const handleSendSelectedBatch = async () => {
        if (!isAuthorized) {
            setLockedFeature('Selected Batch Messaging');
            setIsLockedModalOpen(true);
            return;
        }
        if (selectedEntryIds.length === 0) {
            message.warning('Please select recipients to send messages');
            return;
        }
        if (remainingMessages <= 0) {
            message.error('Daily message limit (10) reached. Try again tomorrow.');
            return;
        }
        if (!messageContent) {
            message.error('Please configure a message first');
            return;
        }

        setSending(true);
        try {
            const userId = user._id || user.id;
            const res = await axios.post(`${BASE_URL}/api/automate/send-batch-limit`, {
                qualifiedLeadId: currentList.qualifiedLeadsId._id,
                entryIds: selectedEntryIds,
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
                setSelectedEntryIds([]);
                fetchData();
            }
        } catch (batchError) {
            console.error('Batch send error:', batchError);
            const errorMsg = batchError.response?.data?.error || 'Failed to send batch';
            message.error(errorMsg);
        } finally {
            setSending(false);
        }
    };



    const filteredData = data.filter(item =>
        item.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'List Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div>
                    <span className="font-semibold text-gray-700">{text}</span>
                    {isQualifiedLeadsCampaign(record) && (
                        <Badge
                            count={<FiUsers className="text-green-600" />}
                            style={{ marginLeft: 8 }}
                            title="Linked to Qualified Leads"
                        />
                    )}
                </div>
            ),
        },
        {
            title: 'Source',
            key: 'source',
            render: (_, record) => {
                if (isQualifiedLeadsCampaign(record)) {
                    return (
                        <Tag color="green">
                            {record.qualifiedLeadsId.name || 'Qualified Leads'}
                        </Tag>
                    );
                }
                return <Tag color="blue">Manual List</Tag>;
            }
        },
        {
            title: 'Progress',
            key: 'progress',
            render: (_, record) => {
                const stats = getStats(record);
                const percent = Math.round((stats.sent / stats.total) * 100) || 0;
                return (
                    <div className="w-32">
                        <Progress
                            percent={percent}
                            size="small"
                            showInfo={false}
                            strokeColor="#0F792C"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                            {stats.sent} / {stats.total} Sent
                        </div>
                    </div>
                );
            }
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<FiPlay />}
                        size="small"
                        onClick={() => handleOpenDetail(record)}
                        style={{ backgroundColor: '#0F792C', borderColor: '#0F792C' }}
                    >
                        Open / Send
                    </Button>
                    <Button
                        icon={<FiEdit2 />}
                        size="small"
                        onClick={() => handleEditClick(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete this list?"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Button
                            danger
                            icon={<FiTrash2 />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];



    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Message Automation</h1>
                    <p className="text-gray-500">Manage and run your bulk messaging campaigns.</p>
                </div>
                <Space>
                    <Input.Search
                        placeholder="Search lists..."
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 250 }}
                    />
                    <Button
                        icon={<FiRefreshCw />}
                        onClick={fetchData}
                        loading={loading}
                        style={{ color: '#0F792C', borderColor: '#0F792C' }}
                    >
                        Refresh
                    </Button>
                </Space>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="_id"
                    loading={loading}
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50']
                    }}
                />
            </div>


            <WhatsAppConnectModal
                visible={connectModalOpen}
                onCancel={() => setConnectModalOpen(false)}
                onConnected={() => setConnectModalOpen(false)}
                onDisconnected={() => {
                    // Refresh status after disconnect
                    checkWhatsAppStatus();
                }}
            />

            <AutomationDetailModal
                open={detailModalOpen}
                onCancel={() => setDetailModalOpen(false)}
                currentList={currentList}
                messageContent={messageContent}
                onMessageChange={setMessageContent}
                onSaveMessage={handleSaveMessage}
                remainingMessages={remainingMessages}
                whatsappInitialized={whatsappInitialized}
                onConnectWhatsApp={handleConnectWhatsAppClick}
                onDisconnectWhatsApp={disconnectWhatsApp}
                selectedEntryIds={selectedEntryIds}
                onSelectionChange={setSelectedEntryIds}
                handleSendSingle={handleSendSingle}
                handleSendSelectedBatch={handleSendSelectedBatch}
                handleSendBatch={handleSendBatch}
                sending={sending}
                sendingEntryId={sendingEntryId}
            />

            <EditCampaignModal
                visible={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false);
                    setSelectedCampaign(null);
                    editForm.resetFields();
                }}
                onSubmit={handleUpdateCampaign}
                form={editForm}
                loading={editLoading}
            />

            <SubscriptionRestrictedModal
                open={isLockedModalOpen}
                onClose={() => setIsLockedModalOpen(false)}
                featureName={lockedFeature}
                accessType={accessType}
                trialInfo={trialInfo}
                trialDays={1}
            />

            {/* Auth Checking Overlay */}
            {checkingAuth && (
                <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                        <Spin size="large" />
                        <p className="mt-4 font-medium text-gray-600">Verifying access...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageAutomationPage;
