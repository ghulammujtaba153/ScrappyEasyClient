import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './authContext';
import { message } from 'antd';

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);

    // Initialize socket connection
    useEffect(() => {
        if (isAuthenticated && user?._id) {
            const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            socketRef.current = socketInstance;

            socketInstance.on('connect', () => {
                console.log('🔌 Socket connected');
                setIsConnected(true);
                
                // Emit user online status
                socketInstance.emit('user_online', {
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                });

                // Request current online users
                socketInstance.emit('get_online_users');
            });

            socketInstance.on('disconnect', () => {
                console.log('🔌 Socket disconnected');
                setIsConnected(false);
            });

            // Listen for online users updates
            socketInstance.on('online_users_updated', (users) => {
                // Filter out current user
                const filteredUsers = users.filter(u => u.userId !== user._id);
                setOnlineUsers(filteredUsers);
            });

            socketInstance.on('online_users_list', (users) => {
                const filteredUsers = users.filter(u => u.userId !== user._id);
                setOnlineUsers(filteredUsers);
            });

            // Listen for incoming meeting requests
            socketInstance.on('meeting_request_received', (request) => {
                console.log('📩 Meeting request received:', request);
                setIncomingRequests(prev => [...prev, request]);
                setNotifications(prev => [...prev, {
                    id: request.collaborationId,
                    type: 'meeting_request',
                    message: `${request.senderName} wants to meet with you`,
                    data: request,
                    timestamp: new Date()
                }]);
                message.info(`New meeting request from ${request.senderName}`);
            });

            // Listen for request responses
            socketInstance.on('meeting_request_response', (response) => {
                console.log('📬 Meeting request response:', response);
                const statusMessage = response.status === 'accepted' 
                    ? '✅ Your meeting request was accepted!' 
                    : '❌ Your meeting request was declined.';
                message.info(statusMessage);
                
                setNotifications(prev => [...prev, {
                    id: response.collaborationId,
                    type: 'request_response',
                    message: statusMessage,
                    data: response,
                    timestamp: new Date()
                }]);
            });

            // Listen for sent request confirmation
            socketInstance.on('meeting_request_sent', (response) => {
                if (response.success) {
                    message.success(response.message);
                } else {
                    message.error(response.message || 'Failed to send request');
                }
            });

            socketInstance.on('response_sent', (response) => {
                if (response.success) {
                    if (response.status === 'accepted') {
                        message.success('Meeting accepted! Opening meet link...');
                    } else {
                        message.info('Meeting request declined');
                    }
                } else {
                    message.error(response.message || 'Failed to send response');
                }
            });

            return () => {
                socketInstance.disconnect();
                socketRef.current = null;
                setIsConnected(false);
            };
        }
    }, [isAuthenticated, user]);

    // Send meeting request
    const sendMeetingRequest = useCallback((receiverId, meetLink, requestMessage) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('send_meeting_request', {
                senderId: user._id,
                senderName: user.name,
                receiverId,
                meetLink,
                message: requestMessage
            });
        } else {
            message.error('Not connected to server');
        }
    }, [isConnected, user]);

    // Accept meeting request
    const acceptMeetingRequest = useCallback((collaborationId) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('accept_meeting_request', {
                collaborationId,
                userId: user._id,
                userName: user.name
            });
            // Remove from incoming requests
            setIncomingRequests(prev => prev.filter(r => r.collaborationId !== collaborationId));
        }
    }, [isConnected, user]);

    // Decline meeting request
    const declineMeetingRequest = useCallback((collaborationId) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('decline_meeting_request', {
                collaborationId,
                userId: user._id,
                userName: user.name
            });
            // Remove from incoming requests
            setIncomingRequests(prev => prev.filter(r => r.collaborationId !== collaborationId));
        }
    }, [isConnected, user]);

    // Clear notification
    const clearNotification = useCallback((notificationId) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }, []);

    const value = {
        isConnected,
        onlineUsers,
        incomingRequests,
        notifications,
        sendMeetingRequest,
        acceptMeetingRequest,
        declineMeetingRequest,
        clearNotification
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
