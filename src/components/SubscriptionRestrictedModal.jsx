import React from 'react';
import { Modal, Button, Alert } from 'antd';
import { MdLock } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

/**
 * A reusable modal to show when a user attempts to access a restricted feature.
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is visible
 * @param {Function} props.onClose - Callback to close the modal
 * @param {string} props.featureName - The name of the feature that is locked
 * @param {string} props.accessType - 'trial' or 'subscription'
 * @param {Object} props.trialInfo - The trial object from backend
 * @param {number} props.trialDays - Total trial duration (e.g. 1)
 */
const SubscriptionRestrictedModal = ({
    open,
    onClose,
    featureName,
    accessType,
    trialInfo,
    trialDays = 1
}) => {
    const navigate = useNavigate();

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-amber-600">
                    <MdLock className="text-xl" />
                    <span>Subscription Required</span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>,
                <Button
                    key="subscribe"
                    type="primary"
                    className="bg-[#0F792C]"
                    onClick={() => {
                        onClose();
                        navigate('/dashboard/subscription');
                    }}
                >
                    Check Plans
                </Button>
            ]}
        >
            <div className="py-4">
                <p className="text-gray-600 mb-4">
                    The <strong>{featureName}</strong> feature is part of our premium plans.
                    {accessType === 'trial' && trialInfo?.status === 'Expired'
                        ? ` Your ${trialDays}-day free trial has expired.`
                        : " Please subscribe to unlock this feature."}
                </p>
                <Alert
                    message="Premium Feature"
                    description="Unlock advanced tools like WhatsApp verification, city insights, automated screenshots, and dialing by upgrading your account."
                    type="info"
                    showIcon
                />
            </div>
        </Modal>
    );
};

export default SubscriptionRestrictedModal;
