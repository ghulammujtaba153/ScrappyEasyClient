import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Spin, message, Alert, Divider } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';
import { FiRefreshCw, FiCheckCircle, FiPhoneCall, FiLogOut } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const WhatsAppConnectModal = ({ visible, onCancel, onConnected, onDisconnected }) => {
    const { user } = useAuth();
    const userId = user?._id || user?.id;
    const [loading, setLoading] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [status, setStatus] = useState('initializing'); // initializing, qr_ready, connected, error, waiting
    const [errorMessage, setErrorMessage] = useState(null);
    const [connectedPhone, setConnectedPhone] = useState(null);
    const [rateLimitRetryIn, setRateLimitRetryIn] = useState(0);
    const [initializationTime, setInitializationTime] = useState(0);
    const pollIntervalRef = useRef(null);
    const retryTimeoutRef = useRef(null);
    const initAttemptRef = useRef(0);
    const retryCounterRef = useRef(null);
    const initTimerRef = useRef(null);

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

            // Start polling (guard against duplicate intervals)
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
            pollIntervalRef.current = setInterval(async () => {
                await checkStatus();
            }, 3000); // Increased polling speed to 3s
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
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
                retryTimeoutRef.current = null;
            }
            if (retryCounterRef.current) {
                clearInterval(retryCounterRef.current);
                retryCounterRef.current = null;
            }
            if (initTimerRef.current) {
                clearInterval(initTimerRef.current);
                initTimerRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    const checkStatus = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/verification/status`, {
                params: { userId }
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

                if (data.isInCooldown) {
                    setStatus('rate_limited');
                    setRateLimitRetryIn(data.remainingCooldown);
                }

                if (data.lastError && !data.qrCode && !data.isInitializing && !data.isInCooldown) {
                    setErrorMessage(`Connection error: ${data.lastError.errorMessage || 'Unknown error'}`);
                    setStatus('error');
                    if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                    }
                }
            }
        } catch (error) {
            console.error('Status check failed', error);
            // Handle rate limiting (429) - pause polling and retry after a delay
            const statusCode = error.response?.status;
            if (statusCode === 429) {
                setStatus('rate_limited');
                setRateLimitRetryIn(30);
                message.warning('Too many requests — pausing WhatsApp status checks for 30s');
                if (pollIntervalRef.current) {
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                }
                // Update countdown every second
                if (retryCounterRef.current) clearInterval(retryCounterRef.current);
                retryCounterRef.current = setInterval(() => {
                    setRateLimitRetryIn(prev => {
                        if (prev <= 1) {
                            if (retryCounterRef.current) clearInterval(retryCounterRef.current);
                            retryCounterRef.current = null;
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
                // Retry after backoff
                if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
                retryTimeoutRef.current = setTimeout(() => {
                    retryTimeoutRef.current = null;
                    setRateLimitRetryIn(0);
                    // try to reinitialize and restart polling
                    initializeSession().catch(() => {});
                    if (!pollIntervalRef.current) {
                        pollIntervalRef.current = setInterval(checkStatus, 5000);
                    }
                }, 30000);
            }
        }
    };

    const initializeSession = async () => {
        setLoading(true);
        setStatus('initializing');
        setErrorMessage(null);
        setInitializationTime(0);
        
        // Start initialization timer
        if (initTimerRef.current) clearInterval(initTimerRef.current);
        initTimerRef.current = setInterval(() => {
            setInitializationTime(prev => prev + 1);
        }, 1000);
        
        try {
            // Check current status first
            const statusRes = await axios.get(`${BASE_URL}/api/verification/status`, {
                params: { userId }
            });

            if (statusRes.data.success && statusRes.data.data?.isConnected) {
                setStatus('connected');
                setConnectedPhone(statusRes.data.data.phoneNumber || null);
                setLoading(false);
                if (initTimerRef.current) clearInterval(initTimerRef.current);
                return;
            }

            // Initialize session (with forceNew if previous session had errors)
            const shouldForceNew = statusRes.data.data?.needsReinitialization || 
                                   statusRes.data.data?.lastError;
            
            const initRes = await axios.post(`${BASE_URL}/api/verification/initialize`, 
                { userId, forceNew: shouldForceNew }, 
                { 
                    timeout: 40_000 // Reduced timeout to match backend 30s + safety
                }
            );

            if (initRes.data.success) {
                console.log('✅ Initialization started, waiting for QR code...');
                // Wait a moment then fetch QR
                setStatus('waiting');
                await new Promise(resolve => setTimeout(resolve, 2000));
                await refreshQrCode();
            } else {
                setErrorMessage(initRes.data.error || 'Initialization failed');
                setStatus('error');
            }

        } catch (error) {
            console.error('Initialization failed', error);
            setStatus('error');
            
            const errorMsg = error.response?.data?.error || error.message;
            
            // Check if this is a 405 cooldown error
            if (errorMsg?.includes('cooldown') || errorMsg?.includes('wait') || error.response?.status === 429) {
                setStatus('rate_limited');
                setErrorMessage(errorMsg);
                
                // Extract wait time if available
                const waitMatch = errorMsg.match(/wait (\d+)/);
                const waitSeconds = waitMatch ? parseInt(waitMatch[1]) : (error.response?.data?.remainingCooldown || 30);
                
                setRateLimitRetryIn(waitSeconds);
                    
                    // Start countdown
                    if (retryCounterRef.current) clearInterval(retryCounterRef.current);
                    retryCounterRef.current = setInterval(() => {
                        setRateLimitRetryIn(prev => {
                            if (prev <= 1) {
                                if (retryCounterRef.current) clearInterval(retryCounterRef.current);
                                retryCounterRef.current = null;
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                    
                    // Stop polling during cooldown
                    if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                    }
            } else if (error.code === 'ECONNABORTED') {
                setErrorMessage('Initialization took too long (timeout). The server may be busy. Try again later.');
            } else {
                setErrorMessage(errorMsg);
            }
        } finally {
            setLoading(false);
            if (initTimerRef.current) clearInterval(initTimerRef.current);
        }
    };

    const refreshQrCode = async () => {
        setLoading(true);
        setErrorMessage(null);
        
        try {
            const res = await axios.get(`${BASE_URL}/api/verification/qr`, {
                params: { userId }
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
            const statusCode = error.response?.status;
            if (statusCode === 429) {
                setErrorMessage('Rate limited by server (429). Please wait and try again.');
                setStatus('rate_limited');
                setRateLimitRetryIn(30);
                message.warning('Server rate limit hit while fetching QR. Pausing for 30s');
                if (pollIntervalRef.current) {
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                }
                // Update countdown every second
                if (retryCounterRef.current) clearInterval(retryCounterRef.current);
                retryCounterRef.current = setInterval(() => {
                    setRateLimitRetryIn(prev => {
                        if (prev <= 1) {
                            if (retryCounterRef.current) clearInterval(retryCounterRef.current);
                            retryCounterRef.current = null;
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
                if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
                retryTimeoutRef.current = setTimeout(() => {
                    retryTimeoutRef.current = null;
                    setRateLimitRetryIn(0);
                    refreshQrCode().catch(() => {});
                    if (!pollIntervalRef.current) {
                        pollIntervalRef.current = setInterval(checkStatus, 5000);
                    }
                }, 30000);
            } else if (statusCode === 405) {
                setErrorMessage('Server returned 405 Method Not Allowed when requesting QR. Check server route/method.');
                setStatus('error');
            } else {
                setErrorMessage(error.response?.data?.error || 'Failed to refresh QR code');
                setStatus('error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        setDisconnecting(true);
        try {
            const res = await axios.post(`${BASE_URL}/api/verification/disconnect`, { userId });

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
                { userId, forceNew: true }
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

                        {/* Initialization Timer Alert */}
                        {(status === 'initializing' || status === 'waiting') && initializationTime > 0 && (
                            <Alert
                                message={
                                    <div className="flex items-center justify-between">
                                        <span>
                                            Initializing for {initializationTime}s
                                            {initializationTime >= 15 && ' (taking longer than expected)'}
                                        </span>
                                        {initializationTime >= 15 && (
                                            <span className="text-xs text-red-700 font-semibold ml-4">
                                                Manual reset available
                                            </span>
                                        )}
                                    </div>
                                }
                                description={
                                    <div className="space-y-2 mt-2">
                                        <div className="relative w-full bg-gray-300 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-500 ${
                                                    initializationTime >= 30 
                                                        ? 'bg-red-500' 
                                                        : initializationTime >= 15 
                                                        ? 'bg-orange-500' 
                                                        : 'bg-blue-500'
                                                }`}
                                                style={{ width: `${Math.min((initializationTime / 30) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        {initializationTime >= 10 && initializationTime < 30 && (
                                            <p className="text-sm text-orange-700">
                                                <strong>Connecting...:</strong> Still initializing. You can wait or reset manually.
                                            </p>
                                        )}
                                        {initializationTime >= 30 && (
                                            <p className="text-sm text-red-700">
                                                <strong>Connection initialization timed out.</strong> Click "Force Reconnect" below to try again immediately.
                                            </p>
                                        )}
                                    </div>
                                }
                                type={initializationTime >= 30 ? 'error' : initializationTime >= 15 ? 'warning' : 'info'}
                                showIcon
                                className="rounded-lg"
                            />
                        )}

                        {/* Error Alert */}
                        {errorMessage && status !== 'rate_limited' && status !== 'error' && (
                            <Alert
                                message="Connection Error"
                                description={errorMessage}
                                type="error"
                                showIcon
                                className="rounded-lg"
                            />
                        )}

                        {/* WhatsApp Blocking Error */}
                        {status === 'error' && errorMessage?.includes('blocked') && (
                            <Alert
                                message="WhatsApp is Blocking Connections"
                                description={
                                    <div className="space-y-2">
                                        <p className="mb-0">{errorMessage}</p>
                                        <p className="text-xs text-gray-600 mb-0">
                                            <strong>Why this happens:</strong> WhatsApp detected unusual connection activity and temporarily blocked connections from your device or network.
                                        </p>
                                        <p className="text-xs text-gray-600 mb-0">
                                            <strong>What to do:</strong> Wait a few minutes and try again. If the issue persists, try using a different device or network.
                                        </p>
                                    </div>
                                }
                                type="error"
                                showIcon
                                className="rounded-lg"
                            />
                        )}

                        {/* Generic Error Alert */}
                        {status === 'error' && errorMessage && !errorMessage?.includes('blocked') && (
                            <Alert
                                message="Connection Error"
                                description={errorMessage}
                                type="error"
                                showIcon
                                className="rounded-lg"
                            />
                        )}

                        {/* Rate Limit Alert */}
                        {status === 'rate_limited' && (
                            <Alert
                                message="Rate Limit Paused"
                                description={
                                    <div className="space-y-2">
                                        <p className="mb-2">Too many requests detected. WhatsApp checks are paused temporarily.</p>
                                        <div className="relative w-full bg-gray-300 rounded-full h-2">
                                            <div 
                                                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                                style={{ width: `${((30 - rateLimitRetryIn) / 30) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm font-semibold text-orange-700">
                                            Resuming in {rateLimitRetryIn}s...
                                        </p>
                                        <Button 
                                            size="small" 
                                            type="primary" 
                                            ghost 
                                            onClick={handleForceReconnect}
                                            className="mt-1"
                                        >
                                            Try Again Now
                                        </Button>
                                    </div>
                                }
                                type="warning"
                                showIcon
                                className="rounded-lg"
                            />
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-3 flex-wrap">
                            <Button
                                icon={<FiRefreshCw />}
                                onClick={refreshQrCode}
                                loading={loading}
                                disabled={status === 'initializing' || status === 'rate_limited' || (status === 'waiting' && initializationTime < 90)}
                                size="large"
                                className="font-medium"
                            >
                                Refresh QR
                            </Button>
                            {(status === 'error' && !errorMessage?.includes('rate limited')) && (
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
                            {(status === 'waiting' || status === 'initializing') && initializationTime >= 10 && (
                                <Button
                                    type="primary"
                                    danger
                                    onClick={handleForceReconnect}
                                    loading={loading}
                                    size="large"
                                    className="font-medium"
                                >
                                    Reset & Try Again
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
