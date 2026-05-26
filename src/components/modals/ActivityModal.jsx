import React from 'react';
import { Modal, Form, Input, Space, Button } from 'antd';

const ActivityModal = ({
    visible,
    onCancel,
    onSubmit,
    form,
    loading = false,
    isEditMode = false
}) => {
    return (
        <Modal
            title={isEditMode ? 'Edit Activity' : 'Add New Activity'}
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
                    label="Activity Description"
                    name="text"
                    rules={[
                        { required: true, message: 'Please enter activity description' },
                        { min: 3, message: 'Activity description must be at least 3 characters' }
                    ]}
                >
                    <Input.TextArea 
                        rows={3}
                        placeholder="Describe the activity performed" 
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                {/* Points removed — tracking uses sequence/time instead */}

                <Form.Item
                    label="Additional Notes"
                    name="notes"
                    rules={[{ max: 300, message: 'Notes cannot exceed 300 characters' }]}
                >
                    <Input.TextArea 
                        rows={2}
                        placeholder="Optional: Add any additional notes" 
                        maxLength={300}
                        showCount
                    />
                </Form.Item>

                <Space className="w-full" style={{ justifyContent: 'flex-end' }}>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button 
                        type="primary" 
                        htmlType="submit"
                        loading={loading}
                        className="bg-[#0F792C]"
                    >
                        {isEditMode ? 'Update' : 'Add'} Activity
                    </Button>
                </Space>
            </Form>
        </Modal>
    );
};

export default ActivityModal;
