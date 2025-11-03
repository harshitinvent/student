import React from 'react';
import { Card, Typography, Button, Space, Divider } from 'antd';
import { MessageOutlined, UserOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const TestFirebaseChat: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageOutlined className="text-3xl text-white" />
                    </div>
                    <Title level={1} className="mb-2">
                        Firebase Real-Time Chat Integration
                    </Title>
                    <Text className="text-lg text-gray-600">
                        Test the real-time chat functionality with Firebase
                    </Text>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="h-full">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserOutlined className="text-2xl text-green-600" />
                            </div>
                            <Title level={3} className="mb-2">
                                Student Login
                            </Title>
                            <Paragraph className="text-gray-600 mb-4">
                                Login as a student to access the real-time chat system.
                                Students can only see their own conversations and chat with other students.
                            </Paragraph>
                            <Link to="/student-login">
                                <Button type="primary" size="large" className="w-full">
                                    Student Login
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    <Card className="h-full">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DatabaseOutlined className="text-2xl text-blue-600" />
                            </div>
                            <Title level={3} className="mb-2">
                                Admin Chat
                            </Title>
                            <Paragraph className="text-gray-600 mb-4">
                                Access the admin chat system to manage student conversations
                                and view all chat activities.
                            </Paragraph>
                            <Link to="/students-chat">
                                <Button type="default" size="large" className="w-full">
                                    Admin Chat
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>

                <Card>
                    <Title level={3} className="mb-4">
                        Features Implemented
                    </Title>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Title level={5} className="mb-2">Firebase Integration</Title>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                <li>Real-time Firestore database</li>
                                <li>Firebase Authentication</li>
                                <li>Real-time message listeners</li>
                                <li>Student-specific data filtering</li>
                            </ul>
                        </div>
                        <div>
                            <Title level={5} className="mb-2">Chat Features</Title>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                <li>Direct messaging between students</li>
                                <li>Real-time message updates</li>
                                <li>Student authentication</li>
                                <li>Conversation management</li>
                            </ul>
                        </div>
                    </div>
                </Card>

                <Divider />

                <Card>
                    <Title level={3} className="mb-4">
                        How to Test
                    </Title>
                    <div className="space-y-4">
                        <div>
                            <Title level={5}>Step 1: Student Registration</Title>
                            <Paragraph>
                                Go to <Link to="/student-login">Student Login</Link> and create a new account
                                with student details. This will create a Firebase user and student profile.
                            </Paragraph>
                        </div>
                        <div>
                            <Title level={5}>Step 2: Start Chatting</Title>
                            <Paragraph>
                                After login, you'll see the student chat interface where you can:
                                <ul className="list-disc list-inside mt-2">
                                    <li>View available students to chat with</li>
                                    <li>Start new conversations</li>
                                    <li>Send and receive real-time messages</li>
                                </ul>
                            </Paragraph>
                        </div>
                        <div>
                            <Title level={5}>Step 3: Test Real-time</Title>
                            <Paragraph>
                                Open the chat in multiple browser windows with different student accounts
                                to test real-time messaging functionality.
                            </Paragraph>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TestFirebaseChat;
