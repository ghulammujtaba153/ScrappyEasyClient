import React, { useEffect, useState } from 'react';
import { Table, Button, message, Popconfirm, Tag, Space, Modal, Progress, Input, Alert, Badge, Tooltip, Checkbox } from 'antd';
import { FiTrash2, FiEdit2, FiPlay, FiRefreshCw, FiSend, FiUsers } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import { MessageOutlined, SendOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { BASE_URL } from '../../config/URL';
import WhatsAppConnectModal from '../../components/dashboard/WhatsAppConnectModal';

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

    // Helper to check if campaign uses qualified leads
    const isQualifiedLeadsCampaign = (record) => {
        return record?.qualifiedLeadsId && record.qualifiedLeadsId.entries?.length > 0;
    };

    // Get recipients list - either from qualified leads or legacy numbers
    const getRecipients = (record) => {
        if (isQualifiedLeadsCampaign(record)) {
            return record.qualifiedLeadsId.entries
                .filter(entry => entry.leadId?.phone) // Only entries with phone numbers
                .map(entry => ({
                    _id: entry._id,
                    number: entry.leadId.phone,
                    businessName: entry.leadId.title || 'Unknown',
                    city: entry.leadId.city || '',
                    status: entry.messageStatus || 'not-sent',
                    sentAt: entry.lastMessagedAt,
                    attempts: entry.messageAttempts || 0,
                    notes: entry.messageNotes,
                    isQualifiedLead: true
                }));
        }
        // Legacy numbers array
        return (record?.numbers || []).map(n => ({
            ...n,
            businessName: null,
            isQualifiedLead: false
        }));
    };

    const checkWhatsAppStatus = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/verification/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && res.data.data) {
                setWhatsappInitialized(res.data.data.isConnected);
            }
        } catch (error) {
            console.error('Status check failed');
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
        } catch (error) {
            console.error('Failed to fetch remaining messages');
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
        } catch (error) {
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
        } catch (error) {
            console.error('Fetch error:', error);
            message.error('Failed to load automated message lists');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        checkWhatsAppStatus();
        fetchRemainingMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token]);

    const handleOpenDetail = (list) => {
        setCurrentList(list);
        setMessageContent(list.message || '');
        setSelectedEntryIds([]);
        setDetailModalOpen(true);
        fetchRemainingMessages();
    };

    const handleSaveMessage = async () => {
        try {
            await axios.put(`${BASE_URL}/api/automate/update/${currentList._id}`,
                { message: messageContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success('Message content updated');
            fetchData();
        } catch (error) {
            message.error('Failed to update message');
        }
    };

    const handleSendBatch = async () => {
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
        } catch (error) {
            console.error('Batch send error:', error);
            message.error('Failed to send batch: ' + (error.response?.data?.error || error.message));
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
        } catch (error) {
            message.error('Failed to delete list');
        }
    };

    // Send single message to one recipient
    const handleSendSingle = async (record) => {
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
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to send message';
            message.error(errorMsg);
            if (error.response?.data?.remainingMessages !== undefined) {
                setRemainingMessages(error.response.data.remainingMessages);
            }
        } finally {
            setSendingEntryId(null);
        }
    };

    // Send batch messages to selected entries
    const handleSendSelectedBatch = async () => {
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
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to send batch';
            message.error(errorMsg);
        } finally {
            setSending(false);
        }
    };

    // Calculate Stats - supports both qualified leads and legacy numbers
    const getStats = (record) => {
        const recipients = getRecipients(record);
        if (!recipients.length) return { total: 0, sent: 0, pending: 0, failed: 0 };

        const total = recipients.length;
        const sent = recipients.filter(r => r.status === 'sent' || r.status === 'delivered' || r.status === 'read').length;
        const failed = recipients.filter(r => r.status === 'failed').length;
        const pending = recipients.filter(r => r.status === 'pending' || r.status === 'not-sent').length;
        return { total, sent, failed, pending };
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

    const detailColumns = [
        {
            title: () => {
                const recipients = currentList ? getRecipients(currentList) : [];
                const pendingRecipients = recipients.filter(r => r.isQualifiedLead && (r.status === 'not-sent' || r.status === 'pending'));
                const allSelected = pendingRecipients.length > 0 && pendingRecipients.every(r => selectedEntryIds.includes(r._id));
                return (
                    <Checkbox
                        checked={allSelected}
                        indeterminate={selectedEntryIds.length > 0 && !allSelected}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedEntryIds(pendingRecipients.map(r => r._id));
                            } else {
                                setSelectedEntryIds([]);
                            }
                        }}
                    />
                );
            },
            key: 'select',
            width: 50,
            render: (_, record) => {
                if (!record.isQualifiedLead || record.status === 'sent' || record.status === 'delivered' || record.status === 'read') {
                    return null;
                }
                return (
                    <Checkbox
                        checked={selectedEntryIds.includes(record._id)}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedEntryIds([...selectedEntryIds, record._id]);
                            } else {
                                setSelectedEntryIds(selectedEntryIds.filter(id => id !== record._id));
                            }
                        }}
                    />
                );
            }
        },
        {
            title: 'Business',
            key: 'business',
            render: (_, record) => record.businessName ? (
                <div>
                    <div className="font-medium text-gray-800">{record.businessName}</div>
                    {record.city && <div className="text-xs text-gray-500">{record.city}</div>}
                </div>
            ) : '-'
        },
        {
            title: 'Number',
            dataIndex: 'number',
            key: 'number',
            render: (text, record) => typeof record === 'string' ? record : record.number
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => {
                if (typeof record === 'string') return <Tag>Pending</Tag>;

                const statusConfig = {
                    'sent': { color: 'green', label: 'SENT' },
                    'delivered': { color: 'cyan', label: 'DELIVERED' },
                    'read': { color: 'blue', label: 'READ' },
                    'failed': { color: 'red', label: 'FAILED' },
                    'pending': { color: 'orange', label: 'PENDING' },
                    'not-sent': { color: 'default', label: 'NOT SENT' }
                };
                const config = statusConfig[record.status] || { color: 'default', label: record.status?.toUpperCase() };
                return <Tag color={config.color}>{config.label}</Tag>;
            }
        },
        {
            title: 'Attempts',
            dataIndex: 'attempts',
            key: 'attempts',
            render: (attempts) => attempts || 0,
            width: 80
        },
        {
            title: 'Sent At',
            dataIndex: 'sentAt',
            key: 'sentAt',
            render: (date) => date ? new Date(date).toLocaleString() : '-'
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_, record) => {
                if (!record.isQualifiedLead) return '-';
                const isSent = record.status === 'sent' || record.status === 'delivered' || record.status === 'read';
                return (
                    <Tooltip title={isSent ? 'Already sent' : remainingMessages <= 0 ? 'Daily limit reached' : 'Send message'}>
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            size="small"
                            onClick={() => handleSendSingle(record)}
                            loading={sendingEntryId === record._id}
                            disabled={isSent || remainingMessages <= 0}
                            style={{ backgroundColor: isSent ? '#ccc' : '#0F792C', borderColor: isSent ? '#ccc' : '#0F792C' }}
                        >
                            Send
                        </Button>
                    </Tooltip>
                );
            }
        }
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
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50']
                    }}
                />
            </div>

            {/* Detail / Send Modal */}
            <Modal
                title={
                    <div>
                        {currentList?.name || "Campaign Details"}
                        {currentList && isQualifiedLeadsCampaign(currentList) && (
                            <Tag color="green" className="ml-2">Qualified Leads</Tag>
                        )}
                    </div>
                }
                open={detailModalOpen}
                onCancel={() => setDetailModalOpen(false)}
                width={900}
                footer={null}
                
            >
                {currentList && (
                    <div className="space-y-6">
                        {/* Qualified Leads Info Banner */}
                        {isQualifiedLeadsCampaign(currentList) && (
                            <Alert
                                message={`Linked to: ${currentList.qualifiedLeadsId.name}`}
                                description="Messages will be sent to leads from your qualified leads list. Use {name} in your message to personalize with the business name."
                                type="info"
                                showIcon
                            />
                        )}

                        {/* Status Overview */}
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div className="bg-gray-50 p-3 rounded">
                                <div className="text-xl font-bold">{getStats(currentList).total}</div>
                                <div className="text-xs text-gray-500">Total</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded text-green-700">
                                <div className="text-xl font-bold">{getStats(currentList).sent}</div>
                                <div className="text-xs">Sent</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded text-blue-700">
                                <div className="text-xl font-bold">{getStats(currentList).pending}</div>
                                <div className="text-xs">Pending</div>
                            </div>
                            <div className="bg-red-50 p-3 rounded text-red-700">
                                <div className="text-xl font-bold">{getStats(currentList).failed}</div>
                                <div className="text-xs">Failed</div>
                            </div>
                        </div>

                        {/* Message Configuration */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message Content
                                {isQualifiedLeadsCampaign(currentList) && (
                                    <span className="text-gray-400 ml-2 font-normal">
                                        (Use {'{name}'} for business name)
                                    </span>
                                )}
                            </label>
                            <div className="flex gap-2">
                                <Input.TextArea
                                    rows={3}
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value)}
                                    placeholder={isQualifiedLeadsCampaign(currentList) 
                                        ? "Hello {name}, we have a special offer for you..."
                                        : "Type your message here..."
                                    }
                                />
                                <Button
                                    onClick={handleSaveMessage}
                                    icon={<FiEdit2 />}
                                    style={{ color: '#0F792C', borderColor: '#0F792C' }}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>

                        {/* Daily Limit Alert */}
                        <Alert
                            message={
                                <span>
                                    <strong>Daily Limit:</strong> {remainingMessages} of 10 messages remaining today
                                    {selectedEntryIds.length > 0 && (
                                        <span className="ml-2">• <strong>{selectedEntryIds.length}</strong> selected</span>
                                    )}
                                </span>
                            }
                            type={remainingMessages <= 0 ? 'error' : remainingMessages <= 3 ? 'warning' : 'info'}
                            showIcon
                        />

                        {/* Action Bar */}
                        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                            <Space>
                                {whatsappInitialized ? (
                                    <Button
                                        danger
                                        icon={<FiTrash2 />}
                                        onClick={disconnectWhatsApp}
                                    >
                                        Disconnect WhatsApp
                                    </Button>
                                ) : (
                                    <Button
                                        icon={<BsWhatsapp />}
                                        onClick={() => setConnectModalOpen(true)}
                                        style={{ color: '#0F792C', borderColor: '#0F792C' }}
                                    >
                                        Connect WhatsApp
                                    </Button>
                                )}
                            </Space>

                            <Space>
                                {isQualifiedLeadsCampaign(currentList) && selectedEntryIds.length > 0 && (
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<FiSend />}
                                        onClick={handleSendSelectedBatch}
                                        loading={sending}
                                        disabled={remainingMessages <= 0}
                                        style={{ backgroundColor: '#0F792C', borderColor: '#0F792C' }}
                                    >
                                        {sending ? 'Sending...' : `Send Selected (${Math.min(selectedEntryIds.length, remainingMessages)})`}
                                    </Button>
                                )}
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<FiSend />}
                                    onClick={handleSendBatch}
                                    loading={sending}
                                    disabled={getStats(currentList).pending === 0 || remainingMessages <= 0}
                                    style={{ backgroundColor: '#0F792C', borderColor: '#0F792C' }}
                                >
                                    {sending ? 'Sending...' : `Auto Batch (${Math.min(10, remainingMessages)})`}
                                </Button>
                            </Space>
                        </div>

                        {/* Recipients List */}
                        <Table
                            columns={detailColumns}
                            dataSource={getRecipients(currentList)}
                            rowKey={(record) => record._id || record.number}
                            size="small"
                            pagination={{ pageSize: 10 }}
                        />
                    </div>
                )}
            </Modal>

            <WhatsAppConnectModal
                visible={connectModalOpen}
                onCancel={() => setConnectModalOpen(false)}
                onConnected={() => setConnectModalOpen(false)}
                onDisconnected={() => {
                    // Refresh status after disconnect
                    checkWhatsAppStatus();
                }}
            />
        </div>
    );
};

export default MessageAutomationPage;