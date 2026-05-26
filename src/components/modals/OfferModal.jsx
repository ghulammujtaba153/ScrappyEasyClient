import React from 'react';
import { Modal, Form, Input, Select, Space, Button } from 'antd';

const OfferModal = ({
    visible,
    onCancel,
    onSubmit,
    form,
    loading = false,
    isEditMode = false,
    includeStatus = false
}) => {
    return (
        <Modal
            title={isEditMode ? 'Edit Offer' : 'Create New Offer'}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                autoComplete="off"
            >
                <Form.Item
                    label="Offer Name"
                    name="name"
                    rules={[
                        { required: true, message: 'Please enter offer name' },
                        { min: 2, message: 'Offer name must be at least 2 characters' }
                    ]}
                >
                    <Input 
                        placeholder="Enter offer name" 
                        maxLength={100}
                    />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        { required: true, message: 'Please enter offer description' },
                        { min: 10, message: 'Description must be at least 10 characters' }
                    ]}
                >
                    <Input.TextArea 
                        rows={4}
                        placeholder="Enter offer description" 
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                {includeStatus && (
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Please select status' }]}
                    >
                        <Select
                            placeholder="Select status"
                            options={[
                                { label: 'Active', value: 'active' },
                                { label: 'Inactive', value: 'inactive' },
                                { label: 'Completed', value: 'completed' }
                            ]}
                        />
                    </Form.Item>
                )}

                <Space className="w-full" style={{ justifyContent: 'flex-end' }}>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button 
                        type="primary" 
                        htmlType="submit"
                        loading={loading}
                        className="bg-[#0F792C]"
                    >
                        {isEditMode ? 'Update' : 'Create'}
                    </Button>
                </Space>
            </Form>
        </Modal>
    );
};

export default OfferModal;
