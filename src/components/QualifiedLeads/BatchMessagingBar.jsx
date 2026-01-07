import React from 'react';
import { Tag, Input, Button, Alert } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const BatchMessagingBar = ({
    selectedCount,
    remainingMessages,
    messageContent,
    onMessageChange,
    onSendBatch,
    onClear,
    batchSending,
    whatsappInitialized,
    onConnectWhatsApp
}) => {
    if (selectedCount === 0) return null;

    return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Tag color="green" className="text-base px-3 py-1">
                        {selectedCount} selected
                    </Tag>
                    <span className="text-gray-600">
                        Daily limit: <strong>{remainingMessages}</strong> remaining
                    </span>
                    {selectedCount > remainingMessages && (
                        <Tag color="orange">Only {remainingMessages} will be sent</Tag>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 flex-1">
                    <div className="flex-1 w-full sm:min-w-[350px]">
                        <Input.TextArea
                            rows={3}
                            value={messageContent}
                            onChange={(e) => onMessageChange(e.target.value)}
                            placeholder="Enter message... Use {name} for personalization"
                            className="w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={onSendBatch}
                            loading={batchSending}
                            disabled={!messageContent.trim() || remainingMessages <= 0 || !whatsappInitialized}
                            style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                        >
                            Send ({Math.min(selectedCount, remainingMessages)})
                        </Button>
                        <Button onClick={onClear}>
                            Clear
                        </Button>
                    </div>
                </div>
            </div>
            {!whatsappInitialized && (
                <Alert
                    message="Connect WhatsApp to send messages"
                    type="warning"
                    showIcon
                    className="mt-3"
                    action={
                        <Button size="small" onClick={onConnectWhatsApp}>
                            Connect
                        </Button>
                    }
                />
            )}
        </div>
    );
};

export default BatchMessagingBar;
