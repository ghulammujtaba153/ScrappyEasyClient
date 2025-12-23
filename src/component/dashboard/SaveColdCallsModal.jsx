import React, { useState } from 'react';
import { Modal, Input, Button, message, Form } from 'antd';
import axios from 'axios';
import { PhoneOutlined } from '@ant-design/icons';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const SaveColdCallsModal = ({ visible, onCancel, numbers, userId }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { token } = useAuth();

    const handleSave = async (values) => {
        if (!numbers || numbers.length === 0) {
            message.error('No numbers to save');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: values.name,
                numbers: numbers,
                userId: userId,
            };

            const res = await axios.post(`${BASE_URL}/api/coldcall/create`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                message.success(`Successfully saved ${numbers.length} numbers to cold call list "${values.name}"`);
                form.resetFields();
                onCancel();
            }
        } catch (error) {
            console.error('Save failed:', error);
            message.error(error.response?.data?.message || 'Failed to save cold call list');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Save for Cold Calls"
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <div className="mb-4 text-gray-600">
                You are about to save <strong>{numbers?.length || 0}</strong> numbers to a new cold calling campaign.
            </div>

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
