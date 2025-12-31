import React, { useState } from 'react';
import { Modal, Input, Button, message, Form } from 'antd';
import axios from 'axios';
import { FiSave } from 'react-icons/fi';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const SaveNumbersModal = ({ visible, onCancel, numbers, userId }) => {
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
                // message is optional now
            };

            const res = await axios.post(`${BASE_URL}/api/automate/create`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 201) {
                message.success(`Successfully saved ${numbers.length} numbers to "${values.name}"`);
                form.resetFields();
                onCancel();
            }
        } catch (error) {
            console.error('Save failed:', error);
            message.error(error.response?.data?.error || 'Failed to save numbers');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Save Numbers for Automation"
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <div className="mb-4 text-gray-600">
                You are about to save <strong>{numbers?.length || 0}</strong> numbers to a new list.
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
            >
                <Form.Item
                    name="name"
                    label="List Name"
                    rules={[{ required: true, message: 'Please enter a name for this list' }]}
                >
                    <Input placeholder="e.g. Verified Lawyers in NY" />
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
                        >
                            Save List
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SaveNumbersModal;
