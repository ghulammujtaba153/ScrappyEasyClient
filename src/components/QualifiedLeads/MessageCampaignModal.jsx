import React from 'react';
import { Modal, Alert, Form, Input, Checkbox, Button } from 'antd';
import { BsWhatsapp } from 'react-icons/bs';

const MessageCampaignModal = ({
    visible,
    onCancel,
    onSubmit,
    loading,
    form,
    leadsWithPhoneCount,
    notMessagedCount,
    leadName
}) => {
    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <BsWhatsapp className="text-green-600 text-xl" />
                    <span>Create Message Campaign</span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Alert
                type="info"
                showIcon
                message={`${leadsWithPhoneCount} leads with phone numbers`}
                description={`${notMessagedCount} not yet messaged. Use {name} to personalize with business name.`}
                className="mb-4"
            />
            
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
            >
                <Form.Item
                    name="name"
                    label="Campaign Name"
                    rules={[{ required: true, message: 'Please enter a campaign name' }]}
                    initialValue={`${leadName} - Messages`}
                >
                    <Input placeholder="e.g. Verified Lawyers - WhatsApp" />
                </Form.Item>
                
                <Form.Item
                    name="message"
                    label="Message Template"
                >
                    <Input.TextArea 
                        rows={4} 
                        placeholder="Hello {name}, we have a special offer for you..."
                    />
                </Form.Item>
                
                <Form.Item
                    name="navigateToCampaign"
                    valuePropName="checked"
                >
                    <Checkbox>Go to Message Automation page after creating</Checkbox>
                </Form.Item>
                
                <Form.Item className="mb-0">
                    <div className="flex justify-end gap-2">
                        <Button onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="bg-[#0F792C] hover:bg-[#0a5a20] border-[#0F792C]"
                        >
                            Create Campaign
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MessageCampaignModal;
