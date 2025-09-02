import React from 'react';
import { List, Avatar, Typography, Badge, Empty } from 'antd';
import { UserOutlined, FileOutlined, MessageOutlined } from '@ant-design/icons';
import type { Message, Conversation } from '../../../types/chat';

const { Text } = Typography;

interface MessageListProps {
    messages: Message[];
    currentUserId: string;
    conversation: Conversation;
}

const MessageList: React.FC<MessageListProps> = ({
    messages,
    currentUserId,
    conversation
}) => {
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
                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                            <Text className="text-gray-900 whitespace-pre-wrap">
                                {message.content}
                            </Text>
                        </div>
                    );

                case 'file':
                    return (
                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                            <div className="flex items-center space-x-2">
                                <FileOutlined className="text-blue-500" />
                                <Text className="text-blue-600 cursor-pointer hover:underline">
                                    {message.content}
                                </Text>
                            </div>
                        </div>
                    );

                default:
                    return (
                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                            <Text className="text-gray-500 italic">
                                Unsupported message type
                            </Text>
                        </div>
                    );
            }
        } catch (error) {
            console.error('Error rendering message content:', error);
            return (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <Text className="text-red-600">Error loading message</Text>
                </div>
            );
        }
    };

    const renderMessageAvatar = (message: Message) => {
        try {
            const isOwnMessage = message.senderId === currentUserId;

            if (isOwnMessage) {
                return (
                    <Avatar
                        size={32}
                        icon={<UserOutlined />}
                        className="bg-blue-500"
                    />
                );
            }

            // For student messages, show initials
            if (conversation.metadata?.studentName) {
                const names = conversation.metadata.studentName.split(' ');
                const initials = names.map(n => n.charAt(0)).join('').toUpperCase();
                return (
                    <Avatar
                        size={32}
                        className="bg-green-500"
                    >
                        {initials}
                    </Avatar>
                );
            }

            return (
                <Avatar
                    size={32}
                    icon={<UserOutlined />}
                    className="bg-gray-500"
                />
            );
        } catch (error) {
            console.error('Error rendering message avatar:', error);
            return (
                <Avatar
                    size={32}
                    icon={<UserOutlined />}
                    className="bg-gray-500"
                />
            );
        }
    };

    const renderMessageSender = (message: Message) => {
        try {
            const isOwnMessage = message.senderId === currentUserId;

            if (isOwnMessage) {
                return 'You';
            }

            if (conversation.metadata?.studentName) {
                return conversation.metadata.studentName;
            }

            return 'Unknown User';
        } catch (error) {
            console.error('Error rendering message sender:', error);
            return 'Unknown User';
        }
    };

    if (!messages || messages.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MessageOutlined className="text-2xl text-gray-400" />
                </div>
                <Text className="text-gray-500 mb-2">No messages yet</Text>
                <Text className="text-sm text-gray-400">Start the conversation by sending a message</Text>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Date Header */}
            <div className="p-4 text-center">
                <Text className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {formatDate(messages[0]?.timestamp || new Date())}
                </Text>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
                <List
                    dataSource={messages}
                    renderItem={(message, index) => {
                        try {
                            const isOwnMessage = message.senderId === currentUserId;
                            const showDate = index === 0 ||
                                formatDate(message.timestamp) !== formatDate(messages[index - 1]?.timestamp);

                            return (
                                <div key={message.id}>
                                    {/* Date separator */}
                                    {showDate && index > 0 && (
                                        <div className="text-center my-4">
                                            <Text className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                {formatDate(message.timestamp)}
                                            </Text>
                                        </div>
                                    )}

                                    {/* Message */}
                                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
                                        <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs lg:max-w-md`}>
                                            {/* Avatar */}
                                            <div className="flex-shrink-0">
                                                {renderMessageAvatar(message)}
                                            </div>

                                            {/* Message Content */}
                                            <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                                                {/* Sender Name */}
                                                <Text className="text-xs text-gray-500 mb-1">
                                                    {renderMessageSender(message)}
                                                </Text>

                                                {/* Message Bubble */}
                                                <div className={`${isOwnMessage ? 'order-2' : 'order-1'}`}>
                                                    {renderMessageContent(message)}
                                                </div>

                                                {/* Time */}
                                                <Text className={`text-xs text-gray-400 mt-1 ${isOwnMessage ? 'order-1' : 'order-2'}`}>
                                                    {formatTime(message.timestamp)}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        } catch (error) {
                            console.error('Error rendering message item:', error);
                            return (
                                <div key={message.id} className="p-4 text-center text-red-500">
                                    Error loading message
                                </div>
                            );
                        }
                    }}
                    className="message-list"
                />
            </div>
        </div>
    );
};

export default MessageList; 