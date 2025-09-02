import React from 'react';
import { List, Avatar, Typography, Badge, Empty, Button } from 'antd';
import { UserOutlined, TeamOutlined, MessageOutlined } from '@ant-design/icons';
import type { Conversation } from '../../../types/chat';

const { Text } = Typography;

interface ConversationListProps {
    conversations: Conversation[];
    selectedConversationId?: string;
    onConversationSelect: (conversation: Conversation) => void;
    currentUserId: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    selectedConversationId,
    onConversationSelect,
    currentUserId
}) => {
    const formatTime = (timestamp: Date) => {
        try {
            const now = new Date();
            const diff = now.getTime() - timestamp.getTime();
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (minutes < 1) return 'Just now';
            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            if (days < 7) return `${days}d ago`;
            return timestamp.toLocaleDateString();
        } catch (error) {
            console.error('Error formatting time:', error);
            return 'Unknown time';
        }
    };

    const getConversationTitle = (conversation: Conversation) => {
        try {
            if (conversation.title) {
                return conversation.title;
            }

            // For direct messages, show the other person's name
            if (conversation.type === 'direct' && conversation.metadata?.studentName) {
                return conversation.metadata.studentName;
            }

            return 'Untitled Conversation';
        } catch (error) {
            console.error('Error getting conversation title:', error);
            return 'Error loading title';
        }
    };

    const getConversationIcon = (conversation: Conversation) => {
        try {
            if (conversation.type === 'group') {
                return <TeamOutlined />;
            }
            return <UserOutlined />;
        } catch (error) {
            console.error('Error getting conversation icon:', error);
            return <UserOutlined />;
        }
    };

    const getConversationAvatar = (conversation: Conversation) => {
        try {
            if (conversation.type === 'group') {
                return (
                    <Avatar
                        size={40}
                        icon={<TeamOutlined />}
                        className="bg-blue-500"
                    />
                );
            }

            // For direct messages, show student initials
            if (conversation.metadata?.studentName) {
                const names = conversation.metadata.studentName.split(' ');
                const initials = names.map(n => n.charAt(0)).join('').toUpperCase();
                return (
                    <Avatar
                        size={40}
                        className="bg-green-500"
                    >
                        {initials}
                    </Avatar>
                );
            }

            return (
                <Avatar
                    size={40}
                    icon={<UserOutlined />}
                    className="bg-gray-500"
                />
            );
        } catch (error) {
            console.error('Error getting conversation avatar:', error);
            return (
                <Avatar
                    size={40}
                    icon={<UserOutlined />}
                    className="bg-gray-500"
                />
            );
        }
    };

    if (!conversations || conversations.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MessageOutlined className="text-2xl text-gray-400" />
                </div>
                <Text className="text-gray-500 mb-2">No conversations yet</Text>
                <Text className="text-sm text-gray-400">Start chatting with your students</Text>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Search placeholder - can be added later */}
            <div className="p-4 border-b border-gray-100">
                <Text className="text-sm text-gray-500">
                    {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                </Text>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                <List
                    dataSource={conversations}
                    renderItem={(conversation) => (
                        <List.Item
                            key={conversation.id}
                            className={`cursor-pointer transition-colors duration-200 border-0 ${selectedConversationId === conversation.id
                                ? 'bg-blue-50 border-r-2 border-blue-500'
                                : 'hover:bg-gray-50'
                                }`}
                            onClick={() => {
                                try {
                                    onConversationSelect(conversation);
                                } catch (error) {
                                    console.error('Error selecting conversation:', error);
                                }
                            }}
                        >
                            <div className="flex items-center space-x-3 w-full p-3">
                                <div className="relative">
                                    {getConversationAvatar(conversation)}
                                    {conversation.type === 'group' && (
                                        <Badge
                                            status="success"
                                            className="absolute -bottom-1 -right-1"
                                        />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <Text
                                            strong
                                            className={`block truncate ${selectedConversationId === conversation.id ? 'text-blue-600' : 'text-gray-900'
                                                }`}
                                        >
                                            {getConversationTitle(conversation)}
                                        </Text>
                                        <Text className="text-xs text-gray-400">
                                            {formatTime(conversation.createdAt)}
                                        </Text>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Text className="text-sm text-gray-600 truncate">
                                            {conversation.lastMessage ? conversation.lastMessage.content : 'No messages yet'}
                                        </Text>
                                        {conversation.unreadCount > 0 && (
                                            <Badge
                                                count={conversation.unreadCount}
                                                size="small"
                                                className="ml-auto"
                                            />
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-1 mt-1">
                                        {getConversationIcon(conversation)}
                                        <Text className="text-xs text-gray-400">
                                            {conversation.type === 'group' ? 'Group' : 'Direct'}
                                        </Text>
                                        {conversation.metadata?.studentId && (
                                            <>
                                                <Text className="text-xs text-gray-300">•</Text>
                                                <Text className="text-xs text-gray-400">
                                                    {conversation.metadata.studentId}
                                                </Text>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                    className="conversation-list"
                />
            </div>
        </div>
    );
};

export default ConversationList; 