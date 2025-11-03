import React, { useState, useEffect } from 'react';
import { Card, Typography, Avatar, List, Spin, message } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { getConversationParticipants, getParticipantUserDetails } from '../../../services/chatAPI';

const { Title, Text } = Typography;

interface Participant {
    id: string;
    userId: string;
    conversationId: string;
    joinedAt: Date;
    lastReadAt: Date;
    role: string;
    isActive: boolean;
    metadata: any;
}

interface UserDetails {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    isOnline?: boolean;
}

interface ParticipantListProps {
    conversationId: string;
    conversationType: 'direct' | 'group';
    isAdmin?: boolean;
}

const ParticipantList: React.FC<ParticipantListProps> = ({
    conversationId,
    conversationType,
    isAdmin = false
}) => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [userDetails, setUserDetails] = useState<Record<string, UserDetails>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadParticipants();
    }, [conversationId]);

    const loadParticipants = async () => {
        try {
            setLoading(true);

            // For now, create mock participants based on conversation type
            // In a real app, you would get this from Firebase
            const mockParticipants: Participant[] = [];
            const mockUserDetails: Record<string, UserDetails> = {};

            if (conversationType === 'group') {
                // Group chat participants with online status - works for any conversation
                const groupMembers = [
                    { id: 'current-user', name: 'Current User', email: 'current.user@university.edu', role: 'admin', isOnline: true },
                    { id: 'user-1', name: 'Shree Kumar', email: 'shree.kumar@university.edu', role: 'member', isOnline: true },
                    { id: 'user-2', name: 'Alex Johnson', email: 'alex.johnson@university.edu', role: 'member', isOnline: false },
                    { id: 'user-3', name: 'Sarah Wilson', email: 'sarah.wilson@university.edu', role: 'member', isOnline: true }
                ];

                groupMembers.forEach(member => {
                    mockParticipants.push({
                        id: `participant-${member.id}`,
                        userId: member.id,
                        conversationId: conversationId,
                        joinedAt: new Date(),
                        lastReadAt: new Date(),
                        role: member.role,
                        isActive: true,
                        metadata: {}
                    });

                    mockUserDetails[member.id] = {
                        id: member.id,
                        name: member.name,
                        email: member.email,
                        avatar: null,
                        isOnline: member.isOnline
                    };
                });
            } else {
                // Direct chat participants
                const directMembers = [
                    { id: 'current-user', name: 'Current User', email: 'current.user@university.edu', role: 'admin', isOnline: true },
                    { id: 'student-1', name: 'Shree Kumar', email: 'shree.kumar@university.edu', role: 'member', isOnline: true }
                ];

                directMembers.forEach(member => {
                    mockParticipants.push({
                        id: `participant-${member.id}`,
                        userId: member.id,
                        conversationId: conversationId,
                        joinedAt: new Date(),
                        lastReadAt: new Date(),
                        role: member.role,
                        isActive: true,
                        metadata: {}
                    });

                    mockUserDetails[member.id] = {
                        id: member.id,
                        name: member.name,
                        email: member.email,
                        avatar: null,
                        isOnline: member.isOnline
                    };
                });
            }

            setParticipants(mockParticipants);
            setUserDetails(mockUserDetails);
        } catch (error) {
            console.error('Error loading participants:', error);
            message.error('Failed to load participants');
        } finally {
            setLoading(false);
        }
    };

    const getParticipantAvatar = (userId: string) => {
        const user = userDetails[userId];
        if (user?.avatar) {
            return <Avatar src={user.avatar} />;
        }

        if (user?.name) {
            const initials = user.name
                .split(' ')
                .map(n => n.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2);
            return <Avatar>{initials}</Avatar>;
        }

        return <Avatar icon={<UserOutlined />} />;
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

    if (loading) {
        return (
            <div className="p-4 text-center">
                <Spin size="large" />
                <div className="mt-2">
                    <Text className="text-gray-500">Loading participants...</Text>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col" style={{ background: 'white', color: '#1e293b', borderLeft: '1px solid #e2e8f0' }}>
            {/* Header */}
            <div className="p-4 border-b" style={{ borderColor: '#e2e8f0' }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {conversationType === 'group' ? (
                            <TeamOutlined style={{ color: '#667eea' }} />
                        ) : (
                            <UserOutlined style={{ color: '#667eea' }} />
                        )}
                        <Title level={5} className="mb-0" style={{ color: '#1e293b' }}>
                            Participants
                        </Title>
                    </div>
                    <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => {/* Close participant list */ }}
                    >
                        ✕
                    </button>
                </div>
                <Text className="text-sm" style={{ color: '#64748b' }}>
                    {participants.length} {participants.length === 1 ? 'member' : 'members'}
                </Text>
            </div>

            {/* Add Member Button */}
            <div className="p-4">
                <button
                    className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                        background: '#667eea',
                        color: '#ffffff',
                        border: 'none'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#5a67d8';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#667eea';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    + Add Member
                </button>
            </div>

            {/* Participants List */}
            <div className="flex-1 overflow-y-auto px-4">
                {participants.length === 0 ? (
                    <div className="p-4 text-center" style={{ color: '#888888' }}>
                        <UserOutlined className="text-2xl mb-2" />
                        <p>No participants found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {participants.map((participant) => {
                            const user = userDetails[participant.userId];
                            // Get online status from user details or use mock data
                            const isOnline = user?.isOnline ?? (participant.userId === 'current-user' || participant.userId === 'user-1' || participant.userId === 'user-3');

                            return (
                                <div
                                    key={participant.userId}
                                    className="p-4 rounded-lg transition-all duration-200 hover:bg-gray-50"
                                    style={{
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        margin: '8px 16px',
                                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                {getParticipantAvatar(participant.userId)}
                                                {isOnline && (
                                                    <div
                                                        className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2"
                                                        style={{
                                                            background: '#10b981',
                                                            borderColor: '#1a1a1a'
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    <Text strong className="text-base" style={{ color: '#1e293b', marginBottom: '4px' }}>
                                                        {user?.name || `User ${participant.userId}`}
                                                    </Text>
                                                    {participant.role === 'admin' && (
                                                        <span
                                                            className="px-2 py-1 text-xs rounded-full"
                                                            style={{
                                                                background: '#1e40af',
                                                                color: '#ffffff'
                                                            }}
                                                        >
                                                            Admin
                                                        </span>
                                                    )}
                                                </div>
                                                <Text className="text-sm block" style={{ color: '#64748b', marginBottom: '2px' }}>
                                                    {user?.email || `user${participant.userId}@example.com`}
                                                </Text>
                                                <Text className="text-sm" style={{ color: '#94a3b8' }}>
                                                    {isOnline ? 'Online' : 'Offline'} • {participant.role === 'admin' ? 'Administrator' : 'Student'}
                                                </Text>
                                            </div>
                                        </div>
                                        {participant.role !== 'admin' && (
                                            <button
                                                className="text-red-400 hover:text-red-300 text-xs font-medium"
                                                onClick={() => {/* Remove participant */ }}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t" style={{ borderColor: '#e2e8f0', background: 'white' }}>
                <Text className="text-xs" style={{ color: '#94a3b8' }}>
                    {isAdmin ? 'Admin Chat System' : 'Firebase Chat System'}
                </Text>
            </div>

            <style>{`
                /* Custom scrollbar for participant list */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 4px;
                }
                .overflow-y-auto::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 2px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
};

export default ParticipantList;