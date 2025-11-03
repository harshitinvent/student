import React, { useState, useEffect } from 'react';
import { Avatar, Typography, Button, Spin, message } from 'antd';
import { UserOutlined, TeamOutlined, PlusOutlined, UserDeleteOutlined } from '@ant-design/icons';
import type { Conversation } from '../../../types/chat';

const { Title, Text } = Typography;

interface ChatParticipantsListProps {
    conversation: Conversation;
    canManageParticipants?: boolean;
}

interface Participant {
    id: string;
    name: string;
    email: string;
    role: string;
    isOnline: boolean;
    joinedAt: Date;
}

const ChatParticipantsList: React.FC<ChatParticipantsListProps> = ({
    conversation,
    canManageParticipants = false
}) => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadParticipants();
    }, [conversation]);

    const loadParticipants = async () => {
        try {
            setLoading(true);

            // Get participants from conversation metadata or create mock data
            let participantsList: Participant[] = [];

            if (conversation.metadata?.groupMembers) {
                participantsList = conversation.metadata.groupMembers.map((member: any) => ({
                    id: member.id,
                    name: member.name,
                    email: member.email,
                    role: member.id === 'current-user' ? 'admin' : 'member',
                    isOnline: member.isOnline || false,
                    joinedAt: new Date()
                }));
            } else {
                // Fallback mock data based on conversation type
                if (conversation.type === 'group') {
                    participantsList = [
                        { id: 'current-user', name: 'Current User', email: 'current.user@university.edu', role: 'admin', isOnline: true, joinedAt: new Date() },
                        { id: 'user-1', name: 'Shree Kumar', email: 'shree.kumar@university.edu', role: 'member', isOnline: true, joinedAt: new Date() },
                        { id: 'user-2', name: 'Alex Johnson', email: 'alex.johnson@university.edu', role: 'member', isOnline: false, joinedAt: new Date() },
                        { id: 'user-3', name: 'Sarah Wilson', email: 'sarah.wilson@university.edu', role: 'member', isOnline: true, joinedAt: new Date() }
                    ];
                } else {
                    participantsList = [
                        { id: 'current-user', name: 'Current User', email: 'current.user@university.edu', role: 'admin', isOnline: true, joinedAt: new Date() },
                        { id: 'student-1', name: 'Shree Kumar', email: 'shree.kumar@university.edu', role: 'member', isOnline: true, joinedAt: new Date() }
                    ];
                }
            }

            setParticipants(participantsList);
        } catch (error) {
            console.error('Error loading participants:', error);
            message.error('Failed to load participants');
        } finally {
            setLoading(false);
        }
    };

    const getParticipantAvatar = (participant: Participant) => {
        if (participant.name) {
            const initials = participant.name
                .split(' ')
                .map(n => n.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2);
            return <Avatar style={{ backgroundColor: '#25d366' }}>{initials}</Avatar>;
        }
        return <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#25d366' }} />;
    };

    const formatJoinDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / 86400000);

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    const handleAddMember = () => {
        // Implementation for adding new member
        console.log('Add member clicked');
    };

    const handleRemoveMember = (participantId: string) => {
        // Implementation for removing member
        console.log('Remove member:', participantId);
    };

    if (loading) {
        return (
            <div style={{ padding: '16px', textAlign: 'center' }}>
                <Spin size="large" />
                <div style={{ marginTop: '8px' }}>
                    <Text style={{ color: '#64748b' }}>Loading participants...</Text>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {conversation.type === 'group' ? (
                            <TeamOutlined style={{ color: '#25d366', fontSize: '18px' }} />
                        ) : (
                            <UserOutlined style={{ color: '#25d366', fontSize: '18px' }} />
                        )}
                        <Title level={5} style={{ margin: 0, color: '#1e293b' }}>
                            Participants
                        </Title>
                    </div>
                </div>
                <Text style={{ fontSize: '14px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    {participants.length} {participants.length === 1 ? 'member' : 'members'}
                </Text>
            </div>

            {/* Add Member Button */}
            {canManageParticipants && conversation.type === 'group' && (
                <div style={{ padding: '16px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddMember}
                        style={{
                            width: '100%',
                            backgroundColor: '#25d366',
                            borderColor: '#25d366',
                            borderRadius: '8px',
                            height: '40px',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}
                    >
                        Add Member
                    </Button>
                </div>
            )}

            {/* Participants List */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 16px'
            }}>
                {participants.length === 0 ? (
                    <div style={{
                        padding: '32px',
                        textAlign: 'center',
                        color: '#64748b'
                    }}>
                        <UserOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                        <p>No participants found</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 0' }}>
                        {participants.map((participant) => (
                            <div
                                key={participant.id}
                                style={{
                                    padding: '12px',
                                    borderRadius: '8px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ position: 'relative' }}>
                                            {getParticipantAvatar(participant)}
                                            {participant.isOnline && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '-2px',
                                                        right: '-2px',
                                                        width: '12px',
                                                        height: '12px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#10b981',
                                                        border: '2px solid #ffffff'
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <Text strong style={{
                                                    fontSize: '14px',
                                                    color: '#1e293b',
                                                    margin: 0
                                                }}>
                                                    {participant.name}
                                                </Text>
                                                {participant.role === 'admin' && (
                                                    <span
                                                        style={{
                                                            padding: '2px 6px',
                                                            fontSize: '10px',
                                                            borderRadius: '4px',
                                                            backgroundColor: '#1e40af',
                                                            color: '#ffffff',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        Admin
                                                    </span>
                                                )}
                                            </div>
                                            <Text style={{
                                                fontSize: '12px',
                                                color: '#64748b',
                                                display: 'block',
                                                marginBottom: '2px'
                                            }}>
                                                {participant.email}
                                            </Text>
                                            <Text style={{
                                                fontSize: '11px',
                                                color: '#94a3b8'
                                            }}>
                                                {participant.isOnline ? 'Online' : 'Offline'} •
                                                Joined {formatJoinDate(participant.joinedAt)}
                                            </Text>
                                        </div>
                                    </div>
                                    {canManageParticipants && participant.role !== 'admin' && (
                                        <Button
                                            type="text"
                                            icon={<UserDeleteOutlined />}
                                            onClick={() => handleRemoveMember(participant.id)}
                                            style={{
                                                color: '#ef4444',
                                                fontSize: '16px'
                                            }}
                                            title="Remove participant"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{
                padding: '16px',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc'
            }}>
                <Text style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    textAlign: 'center',
                    display: 'block'
                }}>
                    Chat System
                </Text>
            </div>
        </div>
    );
};

export default ChatParticipantsList;
