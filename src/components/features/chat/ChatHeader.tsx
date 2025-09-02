import React from 'react';
import { Button, Avatar, Typography, Badge, Space, Dropdown } from 'antd';
import { ArrowLeftOutlined, MoreOutlined, TeamOutlined, UserOutlined, PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons';
import type { Conversation } from '../../../types/chat';

const { Text, Title } = Typography;

interface ChatHeaderProps {
    conversation: Conversation;
    onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, onBack }) => {
    const getConversationTitle = () => {
        if (conversation.title) {
            return conversation.title;
        }

        if (conversation.type === 'direct' && conversation.metadata?.studentName) {
            return conversation.metadata.studentName;
        }

        return 'Untitled Conversation';
    };

    const getConversationSubtitle = () => {
        if (conversation.type === 'group') {
            return `Group • ${conversation.participants?.length || 0} members`;
        }

        if (conversation.metadata?.studentId) {
            return `Student ID: ${conversation.metadata.studentId}`;
        }

        return 'Direct Message';
    };

    const getConversationAvatar = () => {
        if (conversation.type === 'group') {
            return (
                <Avatar
                    size={40}
                    icon={<TeamOutlined />}
                    className="bg-blue-500"
                />
            );
        }

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
    };

    const getStatusBadge = () => {
        if (conversation.type === 'group') {
            return (
                <Badge
                    status="success"
                    text="Active"
                    className="text-xs"
                />
            );
        }

        // For students, show online status (mock for now)
        return (
            <Badge
                status="success"
                text="Online"
                className="text-xs"
            />
        );
    };

    const handleCall = () => {
        // Implementation for voice call
        console.log('Voice call to:', getConversationTitle());
    };

    const handleVideoCall = () => {
        // Implementation for video call
        console.log('Video call to:', getConversationTitle());
    };

    const handleViewProfile = () => {
        // Implementation for viewing profile
        console.log('View profile:', getConversationTitle());
    };

    const handleArchive = () => {
        // Implementation for archiving conversation
        console.log('Archive conversation:', conversation.id);
    };

    const handleDelete = () => {
        // Implementation for deleting conversation
        console.log('Delete conversation:', conversation.id);
    };

    const moreMenuItems = [
        {
            key: 'profile',
            label: 'View Profile',
            icon: <UserOutlined />,
            onClick: handleViewProfile
        },
        {
            key: 'archive',
            label: 'Archive Chat',
            icon: <UserOutlined />,
            onClick: handleArchive
        },
        {
            type: 'divider' as const
        },
        {
            key: 'delete',
            label: 'Delete Chat',
            icon: <UserOutlined />,
            danger: true,
            onClick: handleDelete
        }
    ];

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            {/* Left side - Back button and conversation info */}
            <div className="flex items-center space-x-3">
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={onBack}
                    className="lg:hidden"
                />

                <div className="flex items-center space-x-3">
                    {getConversationAvatar()}

                    <div>
                        <div className="flex items-center space-x-2">
                            <Title level={5} className="mb-0">
                                {getConversationTitle()}
                            </Title>
                            {getStatusBadge()}
                        </div>
                        <Text className="text-sm text-gray-500">
                            {getConversationSubtitle()}
                        </Text>
                    </div>
                </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
                {/* Call buttons - only show for direct messages */}
                {conversation.type === 'direct' && (
                    <>
                        <Button
                            type="text"
                            icon={<PhoneOutlined />}
                            onClick={handleCall}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Voice Call"
                        />
                        <Button
                            type="text"
                            icon={<VideoCameraOutlined />}
                            onClick={handleVideoCall}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Video Call"
                        />
                    </>
                )}

                {/* More options */}
                <Dropdown
                    menu={{ items: moreMenuItems }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Button
                        type="text"
                        icon={<MoreOutlined />}
                        className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    />
                </Dropdown>
            </div>
        </div>
    );
};

export default ChatHeader; 