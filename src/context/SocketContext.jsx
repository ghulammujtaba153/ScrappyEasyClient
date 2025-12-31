import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './authContext';
import { message } from 'antd';

import { BASE_URL } from '../config/URL';

const SocketContext = createContext(null);

// Event listeners registry for components to subscribe to socket events
const eventListeners = new Map();

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

    // Helper to notify event listeners (defined before useEffect to avoid hoisting issues)
    const notifyListeners = useCallback((eventName, data) => {
        const listeners = eventListeners.get(eventName) || [];
        listeners.forEach(callback => callback(data));
    }, []);

    // Subscribe to socket events (for components like CollaborationPage)
    const subscribeToEvent = useCallback((eventName, callback) => {
        if (!eventListeners.has(eventName)) {
            eventListeners.set(eventName, []);
        }
        eventListeners.get(eventName).push(callback);
        
        // Return unsubscribe function
        return () => {
            const listeners = eventListeners.get(eventName) || [];
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, []);

    // Initialize socket connection
    useEffect(() => {
        // isAuthenticated is a function in authContext, so call it
        const isAuth = typeof isAuthenticated === 'function' ? isAuthenticated() : isAuthenticated;
        
        if (!isAuth || !user?._id) {
            return;
        }

        // Prevent multiple connections - check if already connected
        if (socketRef.current?.connected) {
            console.log('🔌 Socket already connected, skipping...');
            return;
        }

        // Disconnect existing socket if any (but not connected)
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }

        console.log('🔌 Initializing socket connection for user:', user.name);

        const socketInstance = io(BASE_URL, {
                // Start with polling then upgrade to websocket (more reliable for cloud platforms like Render)
                transports: ['polling', 'websocket'],
                upgrade: true,
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                timeout: 30000,
                // Don't use credentials with wildcard CORS origin
                withCredentials: false,
                // Force new connection
                forceNew: true,
                // Auto connect
                autoConnect: true,
            });

            socketRef.current = socketInstance;

            socketInstance.on('connect', () => {
                console.log('🔌 Socket connected:', socketInstance.id);
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

            socketInstance.on('connect_error', (error) => {
                console.error('🔌 Socket connection error:', error.message);
                setIsConnected(false);
            });

            socketInstance.on('disconnect', (reason) => {
                console.log('🔌 Socket disconnected:', reason);
                setIsConnected(false);
                
                // If the disconnection was initiated by the server, reconnect manually
                if (reason === 'io server disconnect') {
                    socketInstance.connect();
                }
            });

            socketInstance.on('reconnect', (attemptNumber) => {
                console.log('🔌 Socket reconnected after', attemptNumber, 'attempts');
                // Re-emit user online status after reconnect
                socketInstance.emit('user_online', {
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                });
                socketInstance.emit('get_online_users');
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
                // Notify listeners for collaboration history refresh
                notifyListeners('collaboration_updated');
            });

            // Forward events to registered listeners
            socketInstance.on('meeting_request_sent', (data) => {
                notifyListeners('collaboration_updated', data);
            });

            return () => {
                console.log('🔌 Cleaning up socket connection');
                socketInstance.disconnect();
                socketRef.current = null;
                setIsConnected(false);
            };
    }, [user?._id, user?.name, user?.email, notifyListeners, isAuthenticated]);

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
        clearNotification,
        subscribeToEvent
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
