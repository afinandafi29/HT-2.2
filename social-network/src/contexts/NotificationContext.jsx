import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { socket } from '../socket';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!currentUser || !socket) return;

        // Listen for new notifications
        socket.on('new_notification', (notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Show browser notification if permitted
            if (Notification.permission === 'granted') {
                new Notification(notification.title, {
                    body: notification.message,
                    icon: '/favicon.ico'
                });
            }
        });

        // Listen for friend requests
        socket.on('friend_request_received', (data) => {
            const notification = {
                id: `friend_req_${Date.now()}`,
                type: 'friend_request',
                title: 'New Friend Request',
                message: `${data.from_username} sent you a friend request`,
                data: data,
                read: false,
                created_at: new Date().toISOString()
            };
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        // Listen for friend request accepted
        socket.on('friend_request_accepted', (data) => {
            const notification = {
                id: `friend_accept_${Date.now()}`,
                type: 'friend_accepted',
                title: 'Friend Request Accepted',
                message: `${data.username} accepted your friend request`,
                data: data,
                read: false,
                created_at: new Date().toISOString()
            };
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        // Listen for new messages
        socket.on('new_message', (data) => {
            const notification = {
                id: `message_${Date.now()}`,
                type: 'message',
                title: 'New Message',
                message: `${data.from_username}: ${data.message.substring(0, 50)}${data.message.length > 50 ? '...' : ''}`,
                data: data,
                read: false,
                created_at: new Date().toISOString()
            };
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            socket.off('new_notification');
            socket.off('friend_request_received');
            socket.off('friend_request_accepted');
            socket.off('new_message');
        };
    }, [currentUser]);

    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const clearNotification = (notificationId) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        const notification = notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
                clearNotification,
                clearAllNotifications
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
