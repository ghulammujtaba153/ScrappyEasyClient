import React, { useEffect, useState, useRef } from 'react';
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
    const [status, setStatus] = useState('initializing'); // initializing, qr_ready, connected, error, waiting
    const [errorMessage, setErrorMessage] = useState(null);
    const pollIntervalRef = useRef(null);
    const initAttemptRef = useRef(0);

    // Poll status when modal is open
    useEffect(() => {
        if (visible) {
            // Reset state
            setQrCode(null);
            setStatus('initializing');
            setErrorMessage(null);
            initAttemptRef.current = 0;
            
            // Initial setup
            initializeSession();

            // Start polling
            pollIntervalRef.current = setInterval(async () => {
                await checkStatus();
            }, 2000);
        } else {
            // Clean up on close
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
            setQrCode(null);
            setStatus('initializing');
            setErrorMessage(null);
        }

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
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
                    if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                    }
                    onConnected();
                    onCancel();
                    return;
                }

                if (data.qrCode && data.qrCode !== qrCode) {
                    setQrCode(data.qrCode);
                    setStatus('qr_ready');
                    setErrorMessage(null);
                }

                if (data.isInitializing) {
                    setStatus('waiting');
                }

                if (data.lastError && !data.qrCode && !data.isInitializing) {
                    setErrorMessage(`Connection error: ${data.lastError.errorMessage || 'Unknown error'}`);
                }
            }
        } catch (error) {
            console.error('Status check failed', error);
        }
    };

    const initializeSession = async () => {
        setLoading(true);
        setStatus('initializing');
        setErrorMessage(null);
        
        try {
            // Check current status first
            const statusRes = await axios.get(`${BASE_URL}/api/verification/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (statusRes.data.success && statusRes.data.data?.isConnected) {
                setStatus('connected');
                onConnected();
                onCancel();
                return;
            }

            // Initialize session (with forceNew if previous session had errors)
            const shouldForceNew = statusRes.data.data?.needsReinitialization || 
                                   statusRes.data.data?.lastError;
            
            await axios.post(`${BASE_URL}/api/verification/initialize`, 
                { forceNew: shouldForceNew }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Wait a moment then fetch QR
            setStatus('waiting');
            await new Promise(resolve => setTimeout(resolve, 1500));
            await refreshQrCode();

        } catch (error) {
            console.error('Initialization failed', error);
            setStatus('error');
            setErrorMessage(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    const refreshQrCode = async () => {
        setLoading(true);
        setErrorMessage(null);
        
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
            } else if (res.data.isInitializing) {
                setStatus('waiting');
            } else {
                // If no QR yet, might need to reinitialize
                initAttemptRef.current++;
                if (initAttemptRef.current < 3) {
                    setStatus('waiting');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await refreshQrCode();
                } else {
                    setErrorMessage(res.data.error || 'Failed to generate QR code');
                    setStatus('error');
                }
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'Failed to refresh QR code');
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleForceReconnect = async () => {
        initAttemptRef.current = 0;
        setQrCode(null);
        setStatus('initializing');
        setErrorMessage(null);
        
        setLoading(true);
        try {
            // Force new session
            await axios.post(`${BASE_URL}/api/verification/initialize`, 
                { forceNew: true }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            await refreshQrCode();
        } catch (error) {
            setErrorMessage(error.response?.data?.error || error.message);
            setStatus('error');
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
            width={420}
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
                                <div className="h-[250px] w-[250px] flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-2">
                                    {loading || status === 'waiting' || status === 'initializing' ? (
                                        <>
                                            <Spin size="large" />
                                            <span className="text-sm">
                                                {status === 'initializing' ? 'Initializing...' : 'Generating QR Code...'}
                                            </span>
                                        </>
                                    ) : (
                                        <span>Click refresh to get QR code</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {errorMessage && (
                            <Alert
                                message="Connection Error"
                                description={errorMessage}
                                type="error"
                                showIcon
                                className="w-full"
                            />
                        )}

                        <div className="flex gap-2">
                            <Button
                                icon={<FiRefreshCw />}
                                onClick={refreshQrCode}
                                loading={loading}
                                disabled={status === 'initializing'}
                            >
                                Refresh QR
                            </Button>
                            {(status === 'error' || errorMessage) && (
                                <Button
                                    type="primary"
                                    onClick={handleForceReconnect}
                                    loading={loading}
                                    className="bg-blue-600"
                                >
                                    Force Reconnect
                                </Button>
                            )}
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
