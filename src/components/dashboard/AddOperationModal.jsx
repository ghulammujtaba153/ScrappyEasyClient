import React, { useState } from 'react';
import { Modal, Input, Button, message, Form } from 'antd';
import { FiPlus } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const AddOperationModal = ({ visible, onCancel, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { token, user } = useAuth();

    const handleCreate = async (values) => {
        if (!user?._id && !user?.id) {
            message.error('User not authenticated');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                `${BASE_URL}/api/data`,
                { 
                    userId: user._id || user.id,
                    searchString: values.name,
                    data: [] // Initial empty data
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 201 || res.status === 200) {
                message.success('Operation created successfully');
                form.resetFields();
                onCancel();
                if (onSuccess) onSuccess('create');
            }
        } catch (error) {
            console.error('Create failed:', error);
            message.error(error.response?.data?.error || 'Failed to create operation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <FiPlus className="text-[#0F792C]" />
                    <span>Add New Operation</span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <div className="mb-4 text-gray-600">
                Create a new search category to organize your leads.
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleCreate}
            >
                <Form.Item
                    name="name"
                    label="Operation Name (Search Query)"
                    rules={[
                        { required: true, message: 'Please enter a search query' },
                        { min: 2, message: 'Query must be at least 2 characters' }
                    ]}
                >
                    <Input
                        placeholder="e.g., Plumbers in London"
                        size="large"
                        autoFocus
                    />
                </Form.Item>

                <div className="flex justify-end gap-2 mt-6">
                    <Button onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="bg-[#0F792C] hover:bg-[#0a5a20]"
                        icon={<FiPlus />}
                    >
                        Create Operation
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddOperationModal;
