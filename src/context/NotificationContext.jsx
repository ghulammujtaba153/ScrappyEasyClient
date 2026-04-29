import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './authContext';
import { useSocket } from './SocketContext';
import { BASE_URL } from '../config/URL';
import { message } from 'antd';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user, token } = useAuth();
    const { subscribeToEvent } = useSocket();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        if (!user?._id || !token) return;
        
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/notifications/user/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = Array.isArray(res.data) ? res.data : (res.data?.success ? res.data.data : []);
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user?._id, token]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Handle real-time notifications
    useEffect(() => {
        if (!subscribeToEvent || !user?._id) return;

        const handleNewNotification = (notification) => {
            console.log('🔔 Real-time notification received:', notification);
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            message.info(notification.title || 'New notification');
        };

        const unsubscribeNew = subscribeToEvent('new_notification', handleNewNotification);
        const unsubscribeTeam = subscribeToEvent('team_notification', handleNewNotification);
        const unsubscribeBroadcast = subscribeToEvent('broadcast_notification', (notification) => {
            const enriched = {
                ...notification,
                _id: notification._id || Date.now(),
                user: user._id
            };
            setNotifications(prev => [enriched, ...prev]);
            setUnreadCount(prev => prev + 1);
            message.info(notification.title || 'Broadcast notification');
        });

        return () => {
            unsubscribeNew?.();
            unsubscribeTeam?.();
            unsubscribeBroadcast?.();
        };
    }, [subscribeToEvent, user?._id]);

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
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!user?._id) return;
        try {
            await axios.put(
                `${BASE_URL}/api/notifications/mark-all-read/${user._id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            message.success('All notifications marked as read');
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const notificationToDelete = notifications.find(n => n._id === notificationId);
            await axios.delete(`${BASE_URL}/api/notifications/delete/${notificationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
            if (notificationToDelete && !notificationToDelete.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
            message.success('Notification deleted');
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            loading,
            unreadCount,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            refreshNotifications: fetchNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
