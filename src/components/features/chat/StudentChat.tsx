import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Button, Input, message, Spin, Empty } from 'antd';
import { MessageOutlined, SendOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useFirebaseAuth } from '../../../providers/firebaseAuth';
import {
    getConversations,
    sendMessage,
    subscribeToMessages,
    subscribeToConversations,
    createDMConversation,
    createTestData,
    createTestGroupData,
    debugStudentConversations,
    debugLocalStorage,
    getUserIdFromLocalStorage,
    forceLoadConversations,
    createTestMessage
} from '../../../services/chatAPI';
import { getAllStudents, type Student } from '../../../services/studentAPI';
import ParticipantList from './ParticipantList';
import type { Conversation, Message } from '../../../types/chat';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../services/firebase';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const StudentChat: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [messageLoading, setMessageLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Load conversations and students on component mount
    useEffect(() => {
        console.log('StudentChat component mounted');

        // Get user data from localStorage
        const loadUserData = () => {
            try {
                // Try regular login data first
                const userData = localStorage.getItem('userData');
                if (userData) {
                    const user = JSON.parse(userData);
                    console.log('Found user data in localStorage:', user);
                    setCurrentUser(user);
                    return user;
                }

                // Try Firebase student data
                const studentData = localStorage.getItem('studentData');
                if (studentData) {
                    const student = JSON.parse(studentData);
                    console.log('Found student data in localStorage:', student);
                    setCurrentUser(student);
                    return student;
                }

                console.log('No user data found in localStorage');
                return null;
            } catch (error) {
                console.error('Error loading user data:', error);
                return null;
            }
        };

        const user = loadUserData();

        if (user) {
            setLoading(true);
            loadStudents();

            // Set up real-time conversation subscription
            const unsubscribe = subscribeToConversations((conversations) => {
                console.log('Real-time conversations update:', conversations);
                console.log('Number of conversations:', conversations.length);
                console.log('Conversation details:', conversations.map(c => ({
                    id: c.id,
                    title: c.title,
                    type: c.type,
                    participants: c.participants,
                    lastMessage: c.lastMessage,
                    lastMessageTime: c.lastMessageTime,
                    createdAt: c.createdAt
                })));
                setConversations(conversations);
                setLoading(false);
            });

            return () => {
                if (unsubscribe) {
                    unsubscribe();
                }
                setLoading(false);
            };
        } else {
            console.log('No user data found, showing empty state');
            setConversations([]);
            setLoading(false);
        }
    }, []);

    // Load messages when conversation is selected
    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.id);
        }
    }, [selectedConversation]);

    const loadMessages = async (conversationId: string) => {
        if (!currentUser) {
            console.log('No current user, cannot load messages');
            return;
        }

        try {
            setMessageLoading(true);

            // Load Firebase messages with real-time subscription
            const unsubscribe = subscribeToMessages(conversationId, (newMessages) => {
                console.log('Messages loaded for conversation:', conversationId, newMessages);
                setMessages(newMessages);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error('Error loading messages:', error);
            setMessages([]);
        } finally {
            setMessageLoading(false);
        }
    };

    const loadStudents = async () => {
        try {
            const allStudents = await getAllStudents();
            // Filter out the current student
            const currentUserId = currentUser?.id || currentUser?.ID;
            const otherStudents = allStudents.filter(s => s.ID.toString() !== currentUserId?.toString());
            console.log('Loaded students:', otherStudents.length);
            setStudents(otherStudents);
        } catch (error) {
            console.error('Error loading students:', error);
            message.error('Failed to load students');
        }
    };

    const handleStartChat = async (targetStudent: Student) => {
        if (!currentUser) {
            message.error('No user data found. Please login again.');
            return;
        }

        try {
            setMessageLoading(true);
            console.log('Starting chat with student:', targetStudent);
            console.log('Current user:', currentUser);
            console.log('Target student email:', targetStudent.email);

            // Use the email to create or find Firebase user
            const conversation = await createDMConversation({
                recipient_email: targetStudent.email
            });

            console.log('Created conversation:', conversation);

            message.success(`Chat started with ${targetStudent.first_name}!`);
            setSelectedConversation(conversation);
            // Conversation will be added automatically via real-time subscription
        } catch (error) {
            console.error('Error starting chat:', error);
            message.error('Failed to start chat');
        } finally {
            setMessageLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || !currentUser) return;

        try {
            setMessageLoading(true);

            // Send message using Firebase
            await sendMessage({
                conversationId: selectedConversation.id,
                content: newMessage.trim(),
                contentType: 'text'
            });

            message.success('Message sent!');
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            message.error('Failed to send message');
        } finally {
            setMessageLoading(false);
        }
    };

    const formatTime = (timestamp: Date) => {
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
    };

    const getConversationTitle = (conversation: Conversation) => {
        if (conversation.title) {
            return conversation.title;
        }

        // For direct messages, show the other person's name
        if (conversation.type === 'direct' && conversation.metadata?.studentName) {
            return conversation.metadata.studentName;
        }

        return 'Untitled Conversation';
    };

    if (!currentUser) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Empty
                    description="Please log in to access chat"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    return (
        <Layout className="h-screen bg-gray-50">
            <Content className="flex">
                {/* Left Sidebar - Conversations */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                        <Title level={4} className="mb-0">
                            <MessageOutlined className="mr-2" />
                            My Chats
                        </Title>
                        <Text className="text-gray-500 text-sm">
                            Welcome, {currentUser.first_name || currentUser.name || 'User'}!
                        </Text>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center">
                                <Spin />
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                <MessageOutlined className="text-2xl mb-2" />
                                <p>No conversations yet</p>
                                <p className="text-sm">Start chatting with other students</p>
                            </div>
                        ) : (
                            <div className="space-y-1 p-2">
                                {conversations.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedConversation?.id === conversation.id
                                            ? 'bg-blue-50 border border-blue-200'
                                            : 'hover:bg-gray-50'
                                            }`}
                                        onClick={() => setSelectedConversation(conversation)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                {conversation.type === 'group' ? (
                                                    <TeamOutlined className="text-blue-600" />
                                                ) : (
                                                    <UserOutlined className="text-blue-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Text strong className="block truncate">
                                                    {getConversationTitle(conversation)}
                                                </Text>
                                                <Text className="text-sm text-gray-500 truncate">
                                                    {conversation.lastMessage?.content || 'No messages yet'}
                                                </Text>
                                                <Text className="text-xs text-gray-400">
                                                    {conversation.lastMessageTime ? formatTime(conversation.lastMessageTime) : ''}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Chat Area */}
                <div className="flex-1 flex">
                    {selectedConversation ? (
                        <>
                            {/* Main Chat Area */}
                            <div className="flex-1 flex flex-col">
                                {/* Chat Header */}
                                <div className="p-4 border-b border-gray-200 bg-white">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            {selectedConversation.type === 'group' ? (
                                                <TeamOutlined className="text-blue-600" />
                                            ) : (
                                                <UserOutlined className="text-blue-600" />
                                            )}
                                        </div>
                                        <div>
                                            <Title level={5} className="mb-0">
                                                {getConversationTitle(selectedConversation)}
                                            </Title>
                                            <Text className="text-sm text-gray-500">
                                                {selectedConversation.type === 'group' ? 'Group Chat' : 'Direct Message'}
                                            </Text>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.length === 0 ? (
                                        <div className="text-center text-gray-500 py-8">
                                            <MessageOutlined className="text-2xl mb-2" />
                                            <p>No messages yet</p>
                                            <p className="text-sm">Start the conversation!</p>
                                        </div>
                                    ) : (
                                        messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.senderId === (currentUser?.id || currentUser?.ID) ? 'justify-end' : 'justify-start'
                                                    }`}
                                            >
                                                <div
                                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.senderId === (currentUser?.id || currentUser?.ID)
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-800'
                                                        }`}
                                                >
                                                    <p className="text-sm">{message.content}</p>
                                                    <p
                                                        className={`text-xs mt-1 ${message.senderId === (currentUser?.id || currentUser?.ID)
                                                            ? 'text-blue-100'
                                                            : 'text-gray-500'
                                                            }`}
                                                    >
                                                        {formatTime(message.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t border-gray-200 bg-white">
                                    <div className="flex space-x-2">
                                        <TextArea
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            autoSize={{ minRows: 1, maxRows: 4 }}
                                            onPressEnter={(e) => {
                                                if (!e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="primary"
                                            icon={<SendOutlined />}
                                            onClick={handleSendMessage}
                                            loading={messageLoading}
                                            disabled={!newMessage.trim()}
                                        >
                                            Send
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Participant List */}
                            <div className="w-80 border-l border-gray-200 bg-gray-50">
                                <ParticipantList
                                    conversationId={selectedConversation.id}
                                    conversationType={selectedConversation.type}
                                    isAdmin={false}
                                />
                            </div>
                        </>
                    ) : (
                        /* Welcome Screen */
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageOutlined className="text-3xl text-blue-600" />
                                </div>
                                <Title level={3} className="mb-2">
                                    Welcome to Student Chat
                                </Title>
                                <Text className="text-gray-500 mb-6 block">
                                    Select a conversation or start a new chat with other students
                                </Text>

                                {/* Test Data Buttons */}
                                <div className="mb-4 space-x-2">
                                    <Button
                                        type="dashed"
                                        onClick={async () => {
                                            try {
                                                await createTestData();
                                                message.success('Direct message test data created! Check your conversations.');
                                            } catch (error) {
                                                message.error('Failed to create test data');
                                            }
                                        }}
                                    >
                                        Create Direct Message
                                    </Button>
                                    <Button
                                        type="dashed"
                                        onClick={async () => {
                                            try {
                                                await createTestGroupData();
                                                message.success('Group chat test data created! Check your conversations.');
                                            } catch (error) {
                                                message.error('Failed to create group test data');
                                            }
                                        }}
                                    >
                                        Create Group Chat
                                    </Button>
                                    <Button
                                        type="dashed"
                                        onClick={async () => {
                                            try {
                                                await debugStudentConversations();
                                                message.info('Debug info logged to console. Check browser console.');
                                            } catch (error) {
                                                message.error('Failed to debug conversations');
                                            }
                                        }}
                                    >
                                        Debug Conversations
                                    </Button>
                                    <Button
                                        type="dashed"
                                        onClick={() => {
                                            debugLocalStorage();
                                            message.info('LocalStorage debug info logged to console.');
                                        }}
                                    >
                                        Debug LocalStorage
                                    </Button>
                                    <Button
                                        type="dashed"
                                        onClick={() => {
                                            const userId = getUserIdFromLocalStorage();
                                            if (userId) {
                                                message.success(`User ID from localStorage: ${userId}`);
                                                console.log('User ID from localStorage:', userId);
                                            } else {
                                                message.error('No user ID found in localStorage');
                                                console.log('No user ID found in localStorage');
                                            }
                                        }}
                                    >
                                        Test User ID
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={async () => {
                                            try {
                                                await forceLoadConversations((conversations) => {
                                                    console.log('Force loaded conversations:', conversations);
                                                    setConversations(conversations);
                                                    message.success(`Force loaded ${conversations.length} conversations`);
                                                });
                                            } catch (error) {
                                                message.error('Failed to force load conversations');
                                                console.error('Force load error:', error);
                                            }
                                        }}
                                    >
                                        Force Load Conversations
                                    </Button>
                                    <Button
                                        type="dashed"
                                        onClick={async () => {
                                            try {
                                                // Get first conversation ID and create a test message
                                                const userId = getUserIdFromLocalStorage();
                                                if (!userId) {
                                                    message.error('No user ID found');
                                                    return;
                                                }

                                                // Get participant records to find conversation IDs
                                                const participantsQuery = query(
                                                    collection(db, 'conversation_participants'),
                                                    where('userId', '==', userId),
                                                    where('isActive', '==', true)
                                                );

                                                const participantsSnapshot = await getDocs(participantsQuery);
                                                if (participantsSnapshot.docs.length > 0) {
                                                    const conversationId = participantsSnapshot.docs[0].data().conversationId;
                                                    await createTestMessage(conversationId, `Test message from user ${userId} at ${new Date().toLocaleTimeString()}`);
                                                    message.success('Test message created!');
                                                } else {
                                                    message.error('No conversations found to add message to');
                                                }
                                            } catch (error) {
                                                message.error('Failed to create test message');
                                                console.error('Test message error:', error);
                                            }
                                        }}
                                    >
                                        Create Test Message
                                    </Button>
                                </div>

                                {/* Available Students */}
                                <div className="max-w-md mx-auto">
                                    <Text className="text-sm text-gray-600 mb-3 block">Available Students:</Text>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {students.slice(0, 5).map((student) => (
                                            <div
                                                key={student.ID}
                                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Text className="text-xs font-medium text-blue-600">
                                                            {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                                                        </Text>
                                                    </div>
                                                    <div>
                                                        <Text className="text-sm font-medium">
                                                            {student.first_name} {student.last_name}
                                                        </Text>
                                                        <Text className="text-xs text-gray-500">
                                                            {student.program}
                                                        </Text>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="small"
                                                    type="primary"
                                                    onClick={() => handleStartChat(student)}
                                                    loading={messageLoading}
                                                >
                                                    Chat
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default StudentChat;