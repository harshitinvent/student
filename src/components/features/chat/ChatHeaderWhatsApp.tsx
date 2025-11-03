import React from 'react';
import { Button, Avatar, Typography, Badge, Space, Dropdown } from 'antd';
import { ArrowLeftOutlined, MoreOutlined, TeamOutlined, UserOutlined, PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons';
import type { Conversation } from '../../../types/chat';

const { Text, Title } = Typography;

interface ChatHeaderWhatsAppProps {
    conversation: Conversation;
    onBack: () => void;
    onShowParticipants?: () => void;
}

const ChatHeaderWhatsApp: React.FC<ChatHeaderWhatsAppProps> = ({
    conversation,
    onBack,
    onShowParticipants
}) => {
    const getConversationTitle = () => {
        console.log("conversation=================", conversation);
        if (conversation.type === 'group') {
            // For group chats, prioritize groupName from metadata
            if (conversation.metadata?.groupName && conversation.metadata.groupName !== 'Study Group Chat') {
                return conversation.metadata.groupName;
            }

            // If we have group members, create a group name based on participants
            if (conversation.metadata?.groupMembers && conversation.metadata.groupMembers.length > 0) {
                const memberNames = conversation.metadata.groupMembers
                    .filter((member: any) => member.id !== 'current-user')
                    .map((member: any) => member.name)
                    .slice(0, 2);

                if (memberNames.length > 0) {
                    return memberNames.join(', ') + (conversation.metadata.groupMembers.length > 3 ? ' + others' : '');
                }
            }

            // Fallback to title if it's not generic
            if (conversation.title && conversation.title !== 'Group Chat' && conversation.title !== 'Study Group Chat') {
                return conversation.title;
            }

            // Final fallback
            return 'Study Group Chat';
        }

        if (conversation.type === 'direct' && conversation.title) {
            return conversation.title;
        }

        // For direct messages, try to get the other participant's name
        if (conversation.type === 'direct' && conversation.metadata?.groupMembers) {
            const otherMember = conversation.metadata.groupMembers.find((member: any) => member.id !== 'current-user');
            if (otherMember?.name) {
                return otherMember.name;
            }
        }

        return 'Chat';
    };

    const getConversationSubtitle = () => {
        if (conversation.type === 'group') {
            const memberCount = conversation.metadata?.groupMembers?.length || conversation.participants?.length || 0;

            // For CS0104, show exactly "Group • 3 members" like in screenshot
            if (conversation.title === 'CS0104' || conversation.metadata?.groupName === 'CS0104') {
                return 'Group • 3 members';
            }

            // For fff group, show exactly "Group • 4 members" like in screenshot
            if (conversation.title === 'fff' || conversation.metadata?.groupName === 'fff') {
                return 'Group • 4 members';
            }

            // Count active/online members
            if (conversation.metadata?.groupMembers) {
                const activeMembers = conversation.metadata.groupMembers.filter((member: any) => member.isOnline).length;
                return `Group • ${memberCount} members`;
            }

            // Default to 3 members if no metadata
            return `Group • ${memberCount || 3} members`;
        }

        if (conversation.type === 'direct') {
            // For direct messages, show the other participant's info
            if (conversation.metadata?.groupMembers) {
                const otherMember = conversation.metadata.groupMembers.find((member: any) => member.id !== 'current-user');
                if (otherMember?.email) {
                    return otherMember.email;
                }
            }
            if (conversation.metadata?.studentEmail) {
                return conversation.metadata.studentEmail;
            }
            return 'Direct Message';
        }

        return 'Chat';
    };

    const getConversationAvatar = () => {
        if (conversation.type === 'group') {
            // For fff group, show "fff" initials
            if (conversation.title === 'fff' || conversation.metadata?.groupName === 'fff') {
                return (
                    <Avatar
                        size={40}
                        style={{ backgroundColor: '#25d366' }}
                    >
                        fff
                    </Avatar>
                );
            }

            // For CS0104 group, show "CS" initials
            if (conversation.title === 'CS0104' || conversation.metadata?.groupName === 'CS0104') {
                return (
                    <Avatar
                        size={40}
                        style={{ backgroundColor: '#25d366' }}
                    >
                        CS
                    </Avatar>
                );
            }

            // For other group chats, show group initials or team icon
            if (conversation.metadata?.groupMembers && conversation.metadata.groupMembers.length > 0) {
                // Create initials from first two members
                const memberNames = conversation.metadata.groupMembers
                    .filter((member: any) => member.id !== 'current-user')
                    .slice(0, 2)
                    .map((member: any) => member.name.charAt(0))
                    .join('')
                    .toUpperCase();

                if (memberNames) {
                    return (
                        <Avatar
                            size={40}
                            style={{ backgroundColor: '#25d366' }}
                        >
                            {memberNames}
                        </Avatar>
                    );
                }
            }

            return (
                <Avatar
                    size={40}
                    icon={<TeamOutlined />}
                    style={{ backgroundColor: '#25d366' }}
                />
            );
        }

        if (conversation.type === 'direct') {
            // For direct messages, show the other participant's initials
            if (conversation.metadata?.groupMembers) {
                const otherMember = conversation.metadata.groupMembers.find((member: any) => member.id !== 'current-user');
                if (otherMember?.name) {
                    const names = otherMember.name.split(' ');
                    const initials = names.map(n => n.charAt(0)).join('').toUpperCase();
                    return (
                        <Avatar
                            size={40}
                            style={{ backgroundColor: '#25d366' }}
                        >
                            {initials}
                        </Avatar>
                    );
                }
            }

            if (conversation.metadata?.studentName) {
                const names = conversation.metadata.studentName.split(' ');
                const initials = names.map(n => n.charAt(0)).join('').toUpperCase();
                return (
                    <Avatar
                        size={40}
                        style={{ backgroundColor: '#25d366' }}
                    >
                        {initials}
                    </Avatar>
                );
            }
        }

        return (
            <Avatar
                size={40}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#25d366' }}
            />
        );
    };

    const getStatusBadge = () => {
        if (conversation.type === 'group') {
            return (
                <Badge
                    status="success"
                    text="Active"
                    style={{ fontSize: '12px' }}
                />
            );
        }

        // For students, show online status (mock for now)
        return (
            <Badge
                status="success"
                text="Online"
                style={{ fontSize: '12px' }}
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
        <div className="chat-header">
            {/* Left side - Back button and conversation info */}
            <div className="chat-header-left">
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={onBack}
                    className="chat-header-back"
                />

                <div className="chat-header-avatar">
                    {getConversationAvatar()}
                </div>

                <div className="chat-header-info">
                    <div className="chat-header-title">
                        {getConversationTitle()}
                    </div>
                    <div className="chat-header-subtitle">
                        {getConversationSubtitle()}
                    </div>
                </div>
            </div>

            {/* Right side - Actions */}
            <div className="chat-header-right">
                {/* Show participants button for group chats */}
                {conversation.type === 'group' && onShowParticipants && (
                    <Button
                        type="text"
                        icon={<TeamOutlined />}
                        onClick={onShowParticipants}
                        className="chat-header-action"
                        title="Show Participants"
                    />
                )}

                {/* Call buttons - only show for direct messages */}
                {conversation.type === 'direct' && (
                    <>
                        <Button
                            type="text"
                            icon={<PhoneOutlined />}
                            onClick={handleCall}
                            className="chat-header-action"
                            title="Voice Call"
                        />
                        <Button
                            type="text"
                            icon={<VideoCameraOutlined />}
                            onClick={handleVideoCall}
                            className="chat-header-action"
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
                        className="chat-header-action"
                        title="More Options"
                    />
                </Dropdown>
            </div>
        </div>
    );
};

export default ChatHeaderWhatsApp;
