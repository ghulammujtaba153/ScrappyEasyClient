import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin, message, Alert } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';
import { FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const WhatsAppConnectModal = ({ visible, onCancel, onConnected }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [status, setStatus] = useState('initializing'); // initializing, qr_ready, connected, error

    // Poll status when modal is open
    useEffect(() => {
        let pollInterval;

        if (visible) {
            // Initial check/setup
            initializeSession();

            // Start polling
            pollInterval = setInterval(async () => {
                await checkStatus();
            }, 3000);
        } else {
            // Reset state on close
            setQrCode(null);
            setStatus('initializing');
        }

        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    const checkStatus = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/verification/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success && res.data.data) {
                const data = res.data.data;

                if (data.isConnected) {
                    setStatus('connected');
                    message.success('WhatsApp connected successfully!');
                    onConnected();
                    onCancel(); // Close modal
                    return;
                }

                if (data.qrCode && data.qrCode !== qrCode) {
                    setQrCode(data.qrCode);
                    setStatus('qr_ready');
                }
            }
        } catch (error) {
            console.error('Status check failed', error);
        }
    };

    const initializeSession = async () => {
        setLoading(true);
        try {
            // Check if already connected or has QR
            const statusRes = await axios.get(`${BASE_URL}/api/verification/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (statusRes.data.success && statusRes.data.data?.isConnected) {
                setStatus('connected');
                onConnected();
                onCancel();
                return;
            }

            // If not connected, ensure session is initialized
            if (!statusRes.data.data?.initialized) {
                await axios.post(`${BASE_URL}/api/verification/initialize`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            // Fetch explicit QR if needed
            await refreshQrCode();

        } catch (error) {
            console.error('Initialization failed', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const refreshQrCode = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/verification/qr`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success && res.data.data?.qrCode) {
                setQrCode(res.data.data.qrCode);
                setStatus('qr_ready');
            } else if (res.data.success && res.data.data?.isConnected) {
                setStatus('connected');
                onConnected();
                onCancel();
            }
        } catch {
            message.error('Failed to refresh QR code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Connect WhatsApp"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={400}
            destroyOnClose
        >
            <div className="flex flex-col items-center justify-center p-4 gap-4">
                {status === 'connected' ? (
                    <div className="text-center text-green-600">
                        <FiCheckCircle size={50} className="mb-2 mx-auto" />
                        <h3 className="text-lg font-semibold">Connected!</h3>
                    </div>
                ) : (
                    <>
                        <p className="text-center text-gray-600">
                            Open WhatsApp on your phone, go to <strong>Linked Devices</strong>, and scan this code.
                        </p>

                        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                            {qrCode ? (
                                <QRCodeCanvas value={qrCode} size={250} />
                            ) : (
                                <div className="h-[250px] w-[250px] flex items-center justify-center bg-gray-50 text-gray-400">
                                    {loading ? <Spin size="large" /> : 'Waiting for QR...'}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                icon={<FiRefreshCw />}
                                onClick={refreshQrCode}
                                loading={loading}
                            >
                                Refresh QR
                            </Button>
                        </div>

                        <Alert
                            message="Keep this window open while scanning."
                            type="info"
                            showIcon
                            className="w-full text-xs"
                        />
                    </>
                )}
            </div>
        </Modal>
    );
};

export default WhatsAppConnectModal;
