import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, message, Form } from 'antd';
import { FiEdit2 } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const EditOperationModal = ({ visible, onCancel, operation, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { token } = useAuth();

    // Set form values when operation changes
    useEffect(() => {
        if (operation && visible) {
            form.setFieldsValue({
                name: operation.searchString || ''
            });
        }
    }, [operation, visible, form]);

    const handleUpdate = async (values) => {
        if (!operation?.id && !operation?._id) {
            message.error('No operation selected');
            return;
        }

        setLoading(true);
        try {
            const operationId = operation.id || operation._id;
            const res = await axios.put(
                `${BASE_URL}/api/data/${operationId}`,
                { searchString: values.name },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                message.success('Operation name updated successfully');
                form.resetFields();
                onCancel();
                if (onSuccess) onSuccess('update');
            }
        } catch (error) {
            console.error('Update failed:', error);
            message.error(error.response?.data?.error || 'Failed to update operation name');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <FiEdit2 className="text-[#0F792C]" />
                    <span>Edit Operation</span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <div className="mb-4 text-gray-600">
                Update the name for this operation.
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdate}
            >
                <Form.Item
                    name="name"
                    label="Operation Name"
                    rules={[
                        { required: true, message: 'Please enter a name' },
                        { min: 2, message: 'Name must be at least 2 characters' }
                    ]}
                >
                    <Input
                        placeholder="Enter operation name"
                        size="large"
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
                        icon={<FiEdit2 />}
                    >
                        Update Name
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default EditOperationModal;
