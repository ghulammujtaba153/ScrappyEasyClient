import React, { useState } from 'react';
import { Modal, Input, Button, message, Form, Alert } from 'antd';
import axios from 'axios';
import { FiSave } from 'react-icons/fi';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const SaveNumbersModal = ({ visible, onCancel, filteredData, userId, operationId, searchString }) => {
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
                searchString: searchString || 'Message Campaign',
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

            // Step 2: Create AutomateMessage campaign linked to QualifiedLeads
            const campaignPayload = {
                name: values.name,
                userId,
                qualifiedLeadsId,
                message: values.message || ''
            };

            const res = await axios.post(`${BASE_URL}/api/automate/create`, campaignPayload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 201) {
                message.success(`Successfully created campaign "${values.name}" with ${validLeads.length} leads`);
                form.resetFields();
                onCancel();
            }
        } catch (error) {
            console.error('Save failed:', error);
            message.error(error.response?.data?.error || error.message || 'Failed to save campaign');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Create Message Campaign"
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Alert
                type="info"
                showIcon
                message={`${validLeads.length} leads with phone numbers`}
                description="A qualified leads list will be created and linked to this campaign. You can track message status per lead."
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
                    <Input placeholder="e.g. Verified Lawyers in NY" />
                </Form.Item>

                <Form.Item
                    name="message"
                    label="Message Template (optional)"
                    extra="Use {name} to personalize with business name"
                >
                    <Input.TextArea 
                        rows={3} 
                        placeholder="Hello {name}, we have a special offer for you..." 
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
                            icon={<FiSave />}
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

export default SaveNumbersModal;
