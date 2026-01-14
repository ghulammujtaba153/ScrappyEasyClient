import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const EditCampaignModal = ({
    visible,
    onCancel,
    onSubmit,
    form,
    loading
}) => {
    return (
        <Modal
            title="Edit Campaign"
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
            >
                <Form.Item
                    name="name"
                    label="Campaign Name"
                    rules={[{ required: true, message: 'Please enter a campaign name' }]}
                >
                    <Input placeholder="Enter campaign name" />
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
                            style={{ backgroundColor: '#0F792C', borderColor: '#0F792C' }}
                        >
                            Save Changes
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditCampaignModal;
