import React from 'react';
import { Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import type { Message, Conversation } from '../../../types/chat';

const { Text } = Typography;

interface Notification {
    id: string;
    message: Message;
    conversation: Conversation;
    senderName: string;
    timestamp: Date;
}

interface NotificationManagerProps {
    notifications: Notification[];
    onRemoveNotification: (notificationId: string) => void;
    onOpenChat: (conversationId: string) => void;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({
    notifications,
    onRemoveNotification,
    onOpenChat
}) => {
    // Play notification sound and vibrate when new notification arrives
    React.useEffect(() => {
        if (notifications.length > 0) {
            const latestNotification = notifications[notifications.length - 1];

            // Play notification sound (if supported)
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
                audio.volume = 0.3;
                audio.play().catch(() => {
                    // Ignore errors if audio play fails
                });
            } catch (error) {
                // Ignore audio errors
            }

            // Vibrate if supported
            if ('vibrate' in navigator) {
                navigator.vibrate([200, 100, 200]);
            }
        }
    }, [notifications.length]);

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '350px'
        }}>
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        animation: 'slideInRight 0.3s ease-out, pulse 2s infinite',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onClick={() => {
                        onOpenChat(notification.conversation.id);
                        onRemoveNotification(notification.id);
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                    }}
                >
                    {/* Left border indicator */}
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)'
                    }} />

                    {/* Notification content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                        }}>
                            <Text style={{
                                fontWeight: '600',
                                color: '#1e293b',
                                fontSize: '14px'
                            }}>
                                {notification.senderName}
                            </Text>
                            <Text style={{
                                fontSize: '12px',
                                color: '#64748b'
                            }}>
                                {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </div>
                        <div style={{
                            color: '#475569',
                            fontSize: '14px',
                            lineHeight: '1.4',
                            wordWrap: 'break-word'
                        }}>
                            {notification.message.content}
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            fontSize: '18px',
                            cursor: 'pointer',
                            padding: '0',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            transition: 'all 0.2s ease'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveNotification(notification.id);
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f1f5f9';
                            e.currentTarget.style.color = '#64748b';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none';
                            e.currentTarget.style.color = '#94a3b8';
                        }}
                    >
                        <CloseOutlined />
                    </button>

                    <style>{`
                        @keyframes slideInRight {
                            from {
                                transform: translateX(100%);
                                opacity: 0;
                            }
                            to {
                                transform: translateX(0);
                                opacity: 1;
                            }
                        }

                        @keyframes slideOutRight {
                            from {
                                transform: translateX(0);
                                opacity: 1;
                            }
                            to {
                                transform: translateX(100%);
                                opacity: 0;
                            }
                        }

                        @keyframes pulse {
                            0% {
                                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                            }
                            50% {
                                box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
                            }
                            100% {
                                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                            }
                        }
                    `}</style>
                </div>
            ))}
        </div>
    );
};

export default NotificationManager;
