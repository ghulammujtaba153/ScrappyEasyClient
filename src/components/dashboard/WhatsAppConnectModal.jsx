import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Spin, message, Alert, Divider } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';
import { FiRefreshCw, FiCheckCircle, FiPhoneCall, FiLogOut } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const WhatsAppConnectModal = ({ visible, onCancel, onConnected, onDisconnected }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [status, setStatus] = useState('initializing'); // initializing, qr_ready, connected, error, waiting
    const [errorMessage, setErrorMessage] = useState(null);
    const [connectedPhone, setConnectedPhone] = useState(null);
    const pollIntervalRef = useRef(null);
    const initAttemptRef = useRef(0);

    // Poll status when modal is open
    useEffect(() => {
        if (visible) {
            // Reset state
            setQrCode(null);
            setStatus('initializing');
            setErrorMessage(null);
            setConnectedPhone(null);
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
                    setConnectedPhone(data.phoneNumber || null);
                    if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                    }
                    // Don't auto-close, let user see connection status
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
                setConnectedPhone(statusRes.data.data.phoneNumber || null);
                setLoading(false);
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
                setConnectedPhone(res.data.data.phoneNumber || null);
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

    const handleDisconnect = async () => {
        setDisconnecting(true);
        try {
            const res = await axios.post(`${BASE_URL}/api/verification/disconnect`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                message.success('WhatsApp disconnected successfully');
                setStatus('initializing');
                setConnectedPhone(null);
                setQrCode(null);
                if (onDisconnected) {
                    onDisconnected();
                }
                onCancel();
            }
        } catch (error) {
            message.error(error.response?.data?.error || 'Failed to disconnect');
        } finally {
            setDisconnecting(false);
        }
    };

    const handleContinue = () => {
        message.success('WhatsApp connected successfully!');
        onConnected();
        onCancel();
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
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                        <BsWhatsapp className="text-white text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 m-0">WhatsApp Connection</h3>
                        <p className="text-xs text-gray-500 m-0">
                            {status === 'connected' ? 'Manage your connection' : 'Scan QR to connect'}
                        </p>
                    </div>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={450}
            destroyOnClose
            className="whatsapp-modal"
        >
            <div className="py-4">
                {status === 'connected' ? (
                    <div className="space-y-6">
                        {/* Connected Status Card */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg">
                                    <FiCheckCircle className="text-white text-3xl" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-green-700 mb-1">Connected!</h4>
                                    <p className="text-sm text-green-600 mb-0">
                                        Your WhatsApp is linked and ready
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Phone Number Display */}
                        {connectedPhone && (
                            <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                        <FiPhoneCall className="text-gray-600 text-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Connected Number</p>
                                        <p className="text-lg font-semibold text-gray-800 mb-0 tracking-wide">
                                            {connectedPhone}
                                        </p>
                                    </div>
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Active"></div>
                                </div>
                            </div>
                        )}

                        <Divider className="my-4" />

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleContinue}
                                className="flex-1 h-12 font-semibold"
                                style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                            >
                                Continue
                            </Button>
                            <Button
                                danger
                                size="large"
                                icon={<FiLogOut />}
                                onClick={handleDisconnect}
                                loading={disconnecting}
                                className="h-12 font-semibold px-6"
                            >
                                Disconnect
                            </Button>
                        </div>

                        <p className="text-xs text-gray-400 text-center mt-2">
                            Disconnecting will require scanning the QR code again
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {/* Instructions */}
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <p className="text-sm text-blue-700 m-0">
                                <strong>How to connect:</strong><br />
                                1. Open WhatsApp on your phone<br />
                                2. Go to <strong>Settings → Linked Devices</strong><br />
                                3. Tap <strong>Link a Device</strong><br />
                                4. Scan the QR code below
                            </p>
                        </div>

                        {/* QR Code Container */}
                        <div className="flex justify-center">
                            <div className="bg-white p-5 border-2 border-gray-200 rounded-2xl shadow-sm">
                                {qrCode ? (
                                    <div className="relative">
                                        <QRCodeCanvas 
                                            value={qrCode} 
                                            size={220} 
                                            level="M"
                                            includeMargin={true}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow">
                                                <BsWhatsapp className="text-[#25D366] text-2xl" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-[220px] w-[220px] flex flex-col items-center justify-center bg-gray-50 rounded-lg gap-3">
                                        {loading || status === 'waiting' || status === 'initializing' ? (
                                            <>
                                                <Spin size="large" />
                                                <span className="text-sm text-gray-500 font-medium">
                                                    {status === 'initializing' ? 'Starting session...' : 'Generating QR Code...'}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <BsWhatsapp className="text-4xl text-gray-300" />
                                                <span className="text-sm text-gray-400">Click refresh to get QR code</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Error Alert */}
                        {errorMessage && (
                            <Alert
                                message="Connection Error"
                                description={errorMessage}
                                type="error"
                                showIcon
                                className="rounded-lg"
                            />
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-3">
                            <Button
                                icon={<FiRefreshCw />}
                                onClick={refreshQrCode}
                                loading={loading}
                                disabled={status === 'initializing'}
                                size="large"
                                className="font-medium"
                            >
                                Refresh QR
                            </Button>
                            {(status === 'error' || errorMessage) && (
                                <Button
                                    type="primary"
                                    onClick={handleForceReconnect}
                                    loading={loading}
                                    size="large"
                                    className="bg-blue-600 font-medium"
                                >
                                    Force Reconnect
                                </Button>
                            )}
                        </div>

                        {/* Info Alert */}
                        <Alert
                            message={
                                <span className="text-sm">
                                    <strong>Tip:</strong> Keep this window open while scanning the QR code
                                </span>
                            }
                            type="info"
                            showIcon
                            className="rounded-lg"
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default WhatsAppConnectModal;
