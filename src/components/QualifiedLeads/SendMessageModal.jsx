import React from 'react';
import { Modal, Alert, Input, Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const SendMessageModal = ({
    visible,
    onOk,
    onCancel,
    confirmLoading,
    currentLead,
    messageContent,
    onMessageChange,
    remainingMessages,
    whatsappInitialized,
    onConnectWhatsApp
}) => {
    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <MessageOutlined style={{ color: '#25D366' }} />
                    Send WhatsApp Message
                </div>
            }
            open={visible}
            onOk={onOk}
            confirmLoading={confirmLoading}
            onCancel={onCancel}
            okText="Send Message"
            okButtonProps={{ 
                style: { backgroundColor: '#25D366', borderColor: '#25D366' },
                disabled: !messageContent.trim() || !whatsappInitialized
            }}
        >
            <div className="space-y-4">
                <Alert
                    message={`Daily Limit: ${remainingMessages} of 10 messages remaining`}
                    type={remainingMessages <= 0 ? 'error' : remainingMessages <= 3 ? 'warning' : 'info'}
                    showIcon
                />
                
                {currentLead && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-800">{currentLead.title || 'Unknown Business'}</p>
                        <p className="text-sm text-gray-500">{currentLead.phone}</p>
                        {currentLead.city && <p className="text-xs text-gray-400">{currentLead.city}</p>}
                    </div>
                )}

                {!whatsappInitialized && (
                    <Alert
                        message="WhatsApp not connected"
                        description={
                            <Button 
                                type="link" 
                                onClick={onConnectWhatsApp}
                                style={{ padding: 0, color: '#25D366' }}
                            >
                                Click here to connect WhatsApp
                            </Button>
                        }
                        type="warning"
                        showIcon
                    />
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message Content
                        <span className="text-gray-400 ml-2 font-normal">
                            (Use {'{name}'} for business name)
                        </span>
                    </label>
                    <Input.TextArea
                        rows={4}
                        value={messageContent}
                        onChange={(e) => onMessageChange(e.target.value)}
                        placeholder="Hello {name}, we have a special offer for you..."
                    />
                </div>
            </div>
        </Modal>
    );
};

export default SendMessageModal;
