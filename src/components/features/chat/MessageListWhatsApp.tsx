import React, { useEffect, useRef } from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { Message, Conversation } from '../../../types/chat';

const { Text } = Typography;

interface MessageListWhatsAppProps {
    messages: Message[];
    currentUserId: string;
    conversation: Conversation;
}

const MessageListWhatsApp: React.FC<MessageListWhatsAppProps> = ({
    messages,
    currentUserId,
    conversation
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Scroll to bottom when component mounts
        scrollToBottom();
    }, []);

    const formatTime = (timestamp: Date) => {
        try {
            return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (error) {
            console.error('Error formatting time:', error);
            return 'Unknown time';
        }
    };

    const formatDate = (timestamp: Date) => {
        try {
            const now = new Date();
            const messageDate = new Date(timestamp);

            if (messageDate.toDateString() === now.toDateString()) {
                return 'Today';
            }

            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            if (messageDate.toDateString() === yesterday.toDateString()) {
                return 'Yesterday';
            }

            return messageDate.toLocaleDateString();
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Unknown date';
        }
    };

    const renderMessageContent = (message: Message) => {
        try {
            switch (message.contentType) {
                case 'text':
                    return (
                        <div style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            maxWidth: '100%',
                            wordWrap: 'break-word'
                        }}>
                            <Text style={{ color: '#1e293b', whiteSpace: 'pre-wrap' }}>
                                {message.content}
                            </Text>
                        </div>
                    );

                case 'file':
                    return (
                        <div style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#3b82f6' }}>📎</span>
                                <Text style={{ color: '#3b82f6', cursor: 'pointer' }}>
                                    {message.content}
                                </Text>
                            </div>
                        </div>
                    );

                default:
                    return (
                        <div style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}>
                            <Text style={{ color: '#64748b', fontStyle: 'italic' }}>
                                Unsupported message type
                            </Text>
                        </div>
                    );
            }
        } catch (error) {
            console.error('Error rendering message content:', error);
            return (
                <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '12px 16px'
                }}>
                    <Text style={{ color: '#dc2626' }}>Error loading message</Text>
                </div>
            );
        }
    };

    const renderMessageAvatar = (message: Message) => {
        try {
            const isOwnMessage = message.senderId === currentUserId;

            if (isOwnMessage) {
                return <UserOutlined />;
            }

            // For direct messages, show 'S' for Shree
            if (conversation.type === 'direct' && message.senderId === 'shree-kumar') {
                return 'S';
            }

            // For group messages, show 'U' for Unknown User
            if (conversation.type === 'group' && message.senderId === 'user-1') {
                return 'U';
            }

            // For other group members, show 'G' for Group Member
            if (conversation.type === 'group' && message.senderId === 'user-2') {
                return 'G';
            }

            if (conversation.type === 'group' && message.senderId === 'user-3') {
                return 'G';
            }

            // Get sender name for initials
            const senderName = renderMessageSender(message);

            if (senderName && senderName !== 'User' && senderName !== 'Group Member') {
                const names = senderName.split(' ');
                const initials = names.map((n: string) => n.charAt(0)).join('').toUpperCase().slice(0, 2);
                return initials;
            }

            return <UserOutlined />;
        } catch (error) {
            console.error('Error rendering message avatar:', error);
            return <UserOutlined />;
        }
    };

    const renderMessageSender = (message: Message) => {
        try {
            const isOwnMessage = message.senderId === currentUserId;

            if (isOwnMessage) {
                return 'You';
            }

            // For group chats, try to get sender name from message first, then conversation metadata
            if (conversation.type === 'group') {
                // First check if message has senderName
                if (message.senderName) {
                    return message.senderName;
                }

                // Then try conversation metadata
                if (conversation.metadata?.groupMembers) {
                    const member = conversation.metadata.groupMembers.find((m: any) => m.id === message.senderId);
                    if (member?.name) {
                        return member.name;
                    }
                }

                // Fallback based on sender ID for better UX
                const senderIdMap: Record<string, string> = {
                    'user-1': 'Shree Kumar',
                    'user-2': 'Alex Johnson',
                    'user-3': 'Sarah Wilson',
                    'current-user': 'Current User',
                    'student-1': 'Shree Kumar',
                    'student-2': 'Alex Johnson',
                    'student-3': 'Sarah Wilson'
                };

                return senderIdMap[message.senderId] || 'Group Member';
            }

            // For direct messages, show the other participant's name
            if (conversation.type === 'direct') {
                if (conversation.metadata?.groupMembers) {
                    const otherMember = conversation.metadata.groupMembers.find((m: any) => m.id !== currentUserId);
                    if (otherMember?.name) {
                        return otherMember.name;
                    }
                }

                if (conversation.metadata?.studentName) {
                    return conversation.metadata.studentName;
                }

                return 'Student';
            }

            // Fallback based on sender ID
            const senderIdMap: Record<string, string> = {
                'user-1': 'Shree Kumar',
                'user-2': 'Alex Johnson',
                'user-3': 'Sarah Wilson',
                'student-1': 'Shree Kumar',
                '31': 'Shree Kumar',
                'test-user-456': 'Alex Johnson',
                'test-user-789': 'Sarah Wilson'
            };

            return senderIdMap[message.senderId] || `User ${message.senderId}`;
        } catch (error) {
            console.error('Error rendering message sender:', error);
            return 'User';
        }
    };

    if (!messages || messages.length === 0) {
        return (
            <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px',
                textAlign: 'center',
                backgroundColor: '#f0f2f5'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                }}>
                    <span style={{ fontSize: '24px', color: '#94a3b8' }}>💬</span>
                </div>
                <Text style={{ color: '#64748b', marginBottom: '8px' }}>No messages yet</Text>
                <Text style={{ fontSize: '14px', color: '#94a3b8' }}>Start the conversation by sending a message</Text>
            </div>
        );
    }

    return (
        <div className="message-list-container">
            {/* Messages */}
            <div className="message-list">
                {messages.map((message, index) => {
                    try {
                        const isOwnMessage = message.senderId === currentUserId;
                        const showDate = index === 0 ||
                            formatDate(message.timestamp) !== formatDate(messages[index - 1]?.timestamp);

                        return (
                            <div key={message.id}>
                                {/* Date separator */}
                                {showDate && (
                                    <div className="date-separator">
                                        <span className="date-separator-text">
                                            {message.timestamp.toLocaleDateString()}
                                        </span>
                                    </div>
                                )}

                                {/* Message */}
                                <div className={`message-item ${isOwnMessage ? 'own' : ''}`}>
                                    <div className="message-content">
                                        {/* Avatar */}
                                        <div className="message-avatar">
                                            {renderMessageAvatar(message)}
                                        </div>

                                        {/* Message Content */}
                                        <div className="message-bubble-container">
                                            {/* Sender Name - only show for group chats and not own messages */}
                                            {conversation.type === 'group' && !isOwnMessage && (
                                                <span className="message-sender">
                                                    {renderMessageSender(message)}
                                                </span>
                                            )}

                                            {/* Message Bubble */}
                                            <div className="message-bubble">
                                                <span className="message-text">
                                                    {message.content}
                                                </span>
                                                {/* Checkmark for sent messages */}
                                                {isOwnMessage && (
                                                    <span className="message-checkmark">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>

                                            {/* Time */}
                                            <span className="message-time">
                                                {formatTime(message.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    } catch (error) {
                        console.error('Error rendering message item:', error);
                        return (
                            <div key={message.id} style={{
                                padding: '16px',
                                textAlign: 'center',
                                color: '#dc2626'
                            }}>
                                Error loading message
                            </div>
                        );
                    }
                })}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default MessageListWhatsApp;
