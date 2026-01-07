import React from 'react';
import { Modal, Alert, Form, Input, Checkbox, Button } from 'antd';
import { MdPhone } from 'react-icons/md';

const ColdCallCampaignModal = ({
    visible,
    onCancel,
    onSubmit,
    loading,
    form,
    leadsWithPhoneCount,
    notCalledCount,
    leadName
}) => {
    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <MdPhone className="text-blue-600 text-xl" />
                    <span>Create Cold Call Campaign</span>
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
                description={`${notCalledCount} not yet called. This campaign will be linked to "${leadName}" for status tracking.`}
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
                    initialValue={`${leadName} - Cold Calls`}
                >
                    <Input placeholder="e.g. Real Estate Leads - Karachi" />
                </Form.Item>
                
                <Form.Item
                    name="callScript"
                    label="Call Script (optional)"
                >
                    <Input.TextArea 
                        rows={4} 
                        placeholder="Enter your call script here..."
                    />
                </Form.Item>
                
                <Form.Item
                    name="navigateToCampaign"
                    valuePropName="checked"
                >
                    <Checkbox>Go to Cold Caller page after creating</Checkbox>
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
                            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                        >
                            Create Campaign
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ColdCallCampaignModal;
