import React from 'react';
import { Modal, Radio, Space } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const CallStatusModal = ({
    visible,
    onOk,
    onCancel,
    confirmLoading,
    currentLead,
    selectedStatus,
    onStatusChange
}) => {
    return (
        <Modal
            title="Update Call Status"
            open={visible}
            onOk={onOk}
            confirmLoading={confirmLoading}
            onCancel={onCancel}
        >
            <p className="mb-4 text-gray-600">
                How did the call with{' '}
                <span className="font-bold text-gray-800">
                    {currentLead?.title || currentLead?.phone}
                </span>{' '}
                go?
            </p>
            <Radio.Group onChange={(e) => onStatusChange(e.target.value)} value={selectedStatus}>
                <Space direction="vertical">
                    <Radio value="interested" className="text-green-600 font-medium">
                        <CheckCircleOutlined /> Interested
                    </Radio>
                    <Radio value="callback" className="text-blue-500 font-medium">
                        <ClockCircleOutlined /> Callback (Schedule Follow-up)
                    </Radio>
                    <Radio value="no-answer" className="text-orange-500 font-medium">
                        <CloseCircleOutlined /> No Answer
                    </Radio>
                    <Radio value="not-interested" className="text-gray-500 font-medium">
                        <CloseCircleOutlined /> Not Interested
                    </Radio>
                    <Radio value="wrong-number" className="text-red-500 font-medium">
                        <CloseCircleOutlined /> Wrong Number
                    </Radio>
                </Space>
            </Radio.Group>
        </Modal>
    );
};

export default CallStatusModal;
