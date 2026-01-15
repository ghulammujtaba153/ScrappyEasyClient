import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MdNotifications, MdCheck, MdDelete, MdCheckCircle } from 'react-icons/md';
import { useAuth } from '../../context/authContext';
import { useSocket } from '../../context/SocketContext';
import { BASE_URL } from '../../config/URL';
import { message } from 'antd';

const NotificationDropdown = () => {
    const { user, token } = useAuth();
    const { subscribeToEvent } = useSocket();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const notificationRef = useRef(null);

    // Fetch notifications from API
    const fetchNotifications = async () => {
        if (!user?._id || !token) return;
        
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/notifications/user/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token]);

    // Listen for real-time notifications via socket
    useEffect(() => {
        if (!subscribeToEvent) return;

        // Subscribe to new notification events
        const unsubscribeNewNotification = subscribeToEvent('new_notification', (notification) => {
            console.log('🔔 NotificationDropdown received:', notification);
            // Server already filters, so just add it
            setNotifications(prev => [notification, ...prev]);
            message.info(notification.title || 'New notification');
        });

        // Subscribe to team-related notifications
        const unsubscribeTeamNotification = subscribeToEvent('team_notification', (notification) => {
            console.log('🔔 Team notification received:', notification);
            setNotifications(prev => [notification, ...prev]);
            message.info(notification.title || 'Team notification');
        });

        // Subscribe to broadcast notifications
        const unsubscribeBroadcast = subscribeToEvent('broadcast_notification', (notification) => {
            setNotifications(prev => [{
                ...notification,
                _id: notification._id || Date.now(),
                user: user?._id
            }, ...prev]);
            message.info(notification.title || 'New notification');
        });

        return () => {
            unsubscribeNewNotification?.();
            unsubscribeTeamNotification?.();
            unsubscribeBroadcast?.();
        };
    }, [subscribeToEvent, user]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Mark single notification as read
    const markAsRead = async (notificationId) => {
        try {
            await axios.put(
                `${BASE_URL}/api/notifications/mark-read/${notificationId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifications(prev =>
                prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        if (!user?._id) return;
        try {
            await axios.put(
                `${BASE_URL}/api/notifications/mark-all-read/${user._id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            message.success('All notifications marked as read');
        } catch (error) {
            console.error('Error marking all as read:', error);
            message.error('Failed to mark all as read');
        }
    };

    // Delete notification
    const deleteNotification = async (notificationId, e) => {
        e.stopPropagation();
        try {
            await axios.delete(`${BASE_URL}/api/notifications/delete/${notificationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
            message.success('Notification deleted');
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    // Format time ago
    const formatTimeAgo = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${days} day${days > 1 ? 's' : ''} ago`;
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative" ref={notificationRef}>
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-gray-100 rounded-full transition-colors hover:bg-gray-200 flex-shrink-0"
            >
                <MdNotifications className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-[#0F792C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
                <div className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 mt-2 w-auto sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[70vh] sm:max-h-96">
                    <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center gap-2">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-[#0F792C] hover:underline font-medium flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
                            >
                                <MdCheckCircle className="w-4 h-4" /> <span className="hidden sm:inline">Mark all as read</span>
                            </button>
                        )}
                    </div>
                    
                    <div className="overflow-y-auto max-h-[calc(70vh-120px)] sm:max-h-80">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-2 text-sm sm:text-base">Loading...</p>
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    onClick={() => !notification.isRead && markAsRead(notification._id)}
                                    className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                        !notification.isRead ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                {!notification.isRead && (
                                                    <span className="w-2 h-2 bg-[#0F792C] rounded-full flex-shrink-0"></span>
                                                )}
                                                <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                                                    {notification.title}
                                                </p>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                                                {notification.description}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {formatTimeAgo(notification.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex gap-1 flex-shrink-0">
                                            {!notification.isRead && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markAsRead(notification._id);
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <MdCheck className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => deleteNotification(notification._id, e)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <MdDelete className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <MdNotifications className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                <p className="text-sm sm:text-base">No notifications</p>
                            </div>
                        )}
                    </div>
                    
                    {notifications.length > 0 && (
                        <div className="p-2 sm:p-3 border-t border-gray-200 text-center">
                            <button 
                                onClick={() => setShowNotifications(false)}
                                className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 font-medium"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
