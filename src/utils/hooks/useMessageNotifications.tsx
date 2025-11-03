import { useState, useCallback } from 'react';
import type { Message, Conversation } from '../../types/chat';

interface Notification {
    id: string;
    message: Message;
    conversation: Conversation;
    senderName: string;
    timestamp: Date;
}

export const useMessageNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((message: Message, conversation: Conversation, senderName: string) => {
        // Don't add duplicate notifications
        const existingNotification = notifications.find(n => n.message.id === message.id);
        if (existingNotification) return;

        const notification: Notification = {
            id: `notification-${Date.now()}-${Math.random()}`,
            message,
            conversation,
            senderName,
            timestamp: new Date()
        };

        setNotifications(prev => [...prev, notification]);

        // Auto remove notification after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
    }, [notifications]);

    const removeNotification = useCallback((notificationId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return {
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications
    };
};
