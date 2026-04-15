import React from 'react';
import { Modal, Tag, Alert, Input, Button, Space, Table, Checkbox, Tooltip } from 'antd';
import { FiEdit2, FiTrash2, FiSend } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import { SendOutlined } from '@ant-design/icons';
import { isQualifiedLeadsCampaign, getRecipients, getStats } from './utils';

const AutomationDetailModal = ({
    open,
    onCancel,
    currentList,
    messageContent,
    onMessageChange,
    onSaveMessage,
    remainingMessages,
    whatsappInitialized,
    onConnectWhatsApp,
    onDisconnectWhatsApp,
    selectedEntryIds,
    onSelectionChange,
    handleSendSingle,
    handleSendSelectedBatch,
    handleSendBatch,
    sending,
    sendingEntryId
}) => {
    if (!currentList) return null;

    const stats = getStats(currentList);
    const recipients = getRecipients(currentList);
    const isQL = isQualifiedLeadsCampaign(currentList);

    const detailColumns = [
        {
            title: () => {
                const pendingRecipients = recipients.filter(r => r.isQualifiedLead && (r.status === 'not-sent' || r.status === 'pending'));
                const allSelected = pendingRecipients.length > 0 && pendingRecipients.every(r => selectedEntryIds.includes(r._id));
                return (
                    <Checkbox
                        checked={allSelected}
                        indeterminate={selectedEntryIds.length > 0 && !allSelected}
                        onChange={(e) => {
                            if (e.target.checked) {
                                onSelectionChange(pendingRecipients.map(r => r._id));
                            } else {
                                onSelectionChange([]);
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
                                onSelectionChange([...selectedEntryIds, record._id]);
                            } else {
                                onSelectionChange(selectedEntryIds.filter(id => id !== record._id));
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
        <Modal
            title={
                <div>
                    {currentList?.name || "Campaign Details"}
                    {isQL && (
                        <Tag color="green" className="ml-2">Qualified Leads</Tag>
                    )}
                </div>
            }
            open={open}
            onCancel={onCancel}
            width={900}
            footer={null}
        >
            <div className="space-y-6">
                {/* Qualified Leads Info Banner */}
                {isQL && (
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
                        <div className="text-xl font-bold">{stats.total}</div>
                        <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded text-green-700">
                        <div className="text-xl font-bold">{stats.sent}</div>
                        <div className="text-xs">Sent</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded text-blue-700">
                        <div className="text-xl font-bold">{stats.pending}</div>
                        <div className="text-xs">Pending</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded text-red-700">
                        <div className="text-xl font-bold">{stats.failed}</div>
                        <div className="text-xs">Failed</div>
                    </div>
                </div>

                {/* Message Configuration */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message Content
                        {isQL && (
                            <span className="text-gray-400 ml-2 font-normal">
                                (Use {'{name}'} for business name)
                            </span>
                        )}
                    </label>
                    <div className="flex gap-2">
                        <Input.TextArea
                            rows={3}
                            value={messageContent}
                            onChange={(e) => onMessageChange(e.target.value)}
                            placeholder={isQL
                                ? "Hello {name}, we have a special offer for you..."
                                : "Type your message here..."
                            }
                        />
                        <Button
                            onClick={onSaveMessage}
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
                                onClick={onDisconnectWhatsApp}
                            >
                                Disconnect WhatsApp
                            </Button>
                        ) : (
                            <Button
                                icon={<BsWhatsapp />}
                                onClick={onConnectWhatsApp}
                                style={{ color: '#0F792C', borderColor: '#0F792C' }}
                            >
                                Connect WhatsApp
                            </Button>
                        )}
                    </Space>

                    <Space>
                        {isQL && selectedEntryIds.length > 0 && (
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
                            disabled={stats.pending === 0 || remainingMessages <= 0}
                            style={{ backgroundColor: '#0F792C', borderColor: '#0F792C' }}
                        >
                            {sending ? 'Sending...' : `Auto Batch (${Math.min(10, remainingMessages)})`}
                        </Button>
                    </Space>
                </div>

                {/* Recipients List */}
                <Table
                    columns={detailColumns}
                    dataSource={recipients}
                    rowKey={(record) => record._id || record.number}
                    size="small"
                    pagination={{ pageSize: 10 }}
                />
            </div>
        </Modal>
    );
};

export default AutomationDetailModal;
