import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, message, Popconfirm, Tag, Space, Tooltip, Modal, Progress, Input, Alert } from 'antd';
import { FiTrash2, FiEdit2, FiPlay, FiRefreshCw, FiSend } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token]);

    const handleOpenDetail = (list) => {
        setCurrentList(list);
        setMessageContent(list.message || '');
        setDetailModalOpen(true);
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

    // Calculate Stats
    const getStats = (numbers) => {
        // Handle both schema versions (string array vs object array)
        if (!numbers || !numbers.length) return { total: 0, sent: 0, pending: 0, failed: 0 };

        // If simple strings (old schema), everything is pending effectively
        if (typeof numbers[0] === 'string') return { total: numbers.length, sent: 0, pending: numbers.length, failed: 0 };

        const total = numbers.length;
        const sent = numbers.filter(n => n.status === 'sent').length;
        const failed = numbers.filter(n => n.status === 'failed').length;
        const pending = numbers.filter(n => n.status === 'pending').length;
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
            render: (text) => <span className="font-semibold text-gray-700">{text}</span>,
        },
        {
            title: 'Progress',
            key: 'progress',
            render: (_, record) => {
                const stats = getStats(record.numbers);
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
            title: 'Number',
            dataIndex: 'number',
            key: 'number',
            // Handle old schema string format just in case
            render: (text, record) => typeof record === 'string' ? record : record.number
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => {
                // Handle old schema
                if (typeof record === 'string') return <Tag>Pending</Tag>;

                const color = record.status === 'sent' ? 'green' : record.status === 'failed' ? 'red' : 'blue';
                return <Tag color={color}>{record.status.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Sent At',
            dataIndex: 'sentAt',
            key: 'sentAt',
            render: (date) => date ? new Date(date).toLocaleString() : '-'
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
                title={currentList?.name || "Campaign Details"}
                open={detailModalOpen}
                onCancel={() => setDetailModalOpen(false)}
                width={800}
                footer={null}
            >
                {currentList && (
                    <div className="space-y-6">
                        {/* Status Overview */}
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div className="bg-gray-50 p-3 rounded">
                                <div className="text-xl font-bold">{getStats(currentList.numbers).total}</div>
                                <div className="text-xs text-gray-500">Total</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded text-green-700">
                                <div className="text-xl font-bold">{getStats(currentList.numbers).sent}</div>
                                <div className="text-xs">Sent</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded text-blue-700">
                                <div className="text-xl font-bold">{getStats(currentList.numbers).pending}</div>
                                <div className="text-xs">Pending</div>
                            </div>
                            <div className="bg-red-50 p-3 rounded text-red-700">
                                <div className="text-xl font-bold">{getStats(currentList.numbers).failed}</div>
                                <div className="text-xs">Failed</div>
                            </div>
                        </div>

                        {/* Message Configuration */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
                            <div className="flex gap-2">
                                <Input.TextArea
                                    rows={3}
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value)}
                                    placeholder="Type your message here..."
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

                        {/* Action Bar */}
                        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
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

                            <Button
                                type="primary"
                                size="large"
                                icon={<FiSend />}
                                onClick={handleSendBatch}
                                loading={sending}
                                disabled={getStats(currentList.numbers).pending === 0}
                                style={{ backgroundColor: '#0F792C', borderColor: '#0F792C' }}
                            >
                                {sending ? 'Sending...' : 'Send Batch (10)'}
                            </Button>
                        </div>

                        {/* Numbers List */}
                        <Table
                            columns={detailColumns}
                            dataSource={currentList.numbers}
                            rowKey={(record) => record._id || record} // Handle string or object
                            size="small"
                            pagination={{ pageSize: 5 }}
                        />
                    </div>
                )}
            </Modal>

            <WhatsAppConnectModal
                visible={connectModalOpen}
                onCancel={() => setConnectModalOpen(false)}
                onConnected={() => setConnectModalOpen(false)}
            />
        </div>
    );
};

export default MessageAutomationPage;