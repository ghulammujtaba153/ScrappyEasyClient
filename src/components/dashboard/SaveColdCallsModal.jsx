import React, { useState } from 'react';
import { Modal, Input, Button, message, Form, Alert } from 'antd';
import axios from 'axios';
import { PhoneOutlined } from '@ant-design/icons';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const SaveColdCallsModal = ({ visible, onCancel, filteredData, userId, operationId, searchString }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { token } = useAuth();

    // Filter data to only include items with phone numbers and leadIds
    const validLeads = (filteredData || []).filter(item => item.phone && item.leadId);

    const handleSave = async (values) => {
        if (validLeads.length === 0) {
            message.error('No valid leads with phone numbers to save');
            return;
        }

        setLoading(true);
        try {
            // Step 1: Create QualifiedLeads with leadIds
            const qualifiedLeadsPayload = {
                userId,
                operationId,
                name: values.name,
                searchString: searchString || 'Cold Call Campaign',
                leadIds: validLeads.map(item => item.leadId),
                filters: { hasPhone: true }
            };

            const qlRes = await axios.post(`${BASE_URL}/api/qualified-leads/create`, qualifiedLeadsPayload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!qlRes.data.success) {
                throw new Error('Failed to create qualified leads list');
            }

            const qualifiedLeadsId = qlRes.data.data._id;

            // Step 2: Create ColdCall campaign linked to QualifiedLeads
            const campaignPayload = {
                name: values.name,
                userId,
                qualifiedLeadsId,
                callScript: values.callScript || ''
            };

            const res = await axios.post(`${BASE_URL}/api/coldcall/create`, campaignPayload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                message.success(`Successfully created cold call campaign "${values.name}" with ${validLeads.length} leads`);
                form.resetFields();
                onCancel();
            }
        } catch (error) {
            console.error('Save failed:', error);
            message.error(error.response?.data?.message || error.message || 'Failed to save cold call campaign');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Create Cold Call Campaign"
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Alert
                type="info"
                showIcon
                message={`${validLeads.length} leads with phone numbers`}
                description="A qualified leads list will be created and linked to this campaign. You can track call status per lead."
                className="mb-4"
            />

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
            >
                <Form.Item
                    name="name"
                    label="Campaign Name"
                    rules={[{ required: true, message: 'Please enter a name for this campaign' }]}
                >
                    <Input placeholder="e.g. Real Estate Leads - Karachi" />
                </Form.Item>

                <Form.Item
                    name="callScript"
                    label="Call Script (optional)"
                    extra="Notes or script for the cold calls"
                >
                    <Input.TextArea 
                        rows={3} 
                        placeholder="Hi, this is [Your Name] from [Company]. I noticed your business..." 
                    />
                </Form.Item>

                <Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={<PhoneOutlined />}
                            style={{ backgroundColor: '#0F792C', borderColor: '#0F792C' }}
                        >
                            Create Campaign
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SaveColdCallsModal;
