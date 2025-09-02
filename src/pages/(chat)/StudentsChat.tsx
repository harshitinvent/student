import React, { useState } from 'react';
import { Layout, Card, Typography, Button, Modal, message } from 'antd';
import { MessageOutlined, PlusOutlined } from '@ant-design/icons';
import StudentList from '../../components/features/chat/StudentList';
import { type Student } from '../../services/studentAPI';
import { createConversation } from '../../services/chatAPI';

const { Content } = Layout;
const { Title, Text } = Typography;

const StudentsChat: React.FC = () => {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isStartingChat, setIsStartingChat] = useState(false);


    const handleStudentSelect = (student: Student) => {
        setSelectedStudent(student);
    };

    const handleStartChat = async () => {
        if (!selectedStudent) return;

        try {
            setIsStartingChat(true);

            // Create a new conversation with the selected student
            const conversation = await createConversation({
                type: 'direct',
                participants: [selectedStudent.ID.toString()],
                title: `Chat with ${selectedStudent.first_name} ${selectedStudent.last_name}`,
                metadata: {
                    studentId: selectedStudent.ID.toString(),
                    studentName: `${selectedStudent.first_name} ${selectedStudent.last_name}`,
                    studentEmail: selectedStudent.email
                }
            });

            message.success(`Chat started with ${selectedStudent.first_name}!`);

            // Navigate to the chat page with the new conversation
            window.location.href = `/chat?conversation=${conversation.id}`;

        } catch (error) {
            console.error('Error starting chat:', error);
            message.error('Failed to start chat. Please try again.');
        } finally {
            setIsStartingChat(false);
        }
    };

    const handleViewProfile = () => {
        if (selectedStudent) {
            Modal.info({
                title: 'Student Profile',
                content: (
                    <div className="space-y-3">
                        <div>
                            <strong>Name:</strong> {selectedStudent.first_name} {selectedStudent.last_name}
                        </div>
                        <div>
                            <strong>Student ID:</strong> {selectedStudent.student_id}
                        </div>
                        <div>
                            <strong>Email:</strong> {selectedStudent.email}
                        </div>
                        <div>
                            <strong>Phone:</strong> {selectedStudent.phone_number}
                        </div>
                        <div>
                            <strong>Program:</strong> {selectedStudent.program}
                        </div>
                        <div>
                            <strong>Year:</strong> {selectedStudent.year_of_study} Year
                        </div>
                        <div>
                            <strong>Status:</strong> {selectedStudent.is_active ? 'Active' : 'Inactive'}
                        </div>
                        <div>
                            <strong>Enrolled:</strong> {new Date(selectedStudent.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ),
                width: 500,
            });
        }
    };

    const getYearText = (year: number) => {
        const yearMap: { [key: number]: string } = {
            1: '1st Year',
            2: '2nd Year',
            3: '3rd Year',
            4: '4th Year',
            5: '5th Year'
        };
        return yearMap[year] || `${year}th Year`;
    };

    return (
        <Layout className="h-screen bg-gray-50">
            <Content className="p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <Title level={2} className="mb-2">
                            Students Chat
                        </Title>
                        <Text className="text-gray-600">
                            Browse your student list and start real-time conversations
                        </Text>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Student List */}
                        <div className="lg:col-span-2">
                            <Card
                                title={
                                    <div className="flex items-center space-x-2">
                                        <MessageOutlined className="text-blue-500" />
                                        <span>Students</span>
                                    </div>
                                }
                                className="h-full"
                            >
                                <StudentList
                                    onStudentSelect={handleStudentSelect}
                                    selectedStudentId={selectedStudent?.ID.toString()}
                                />
                            </Card>
                        </div>

                        {/* Student Details & Actions */}
                        <div className="lg:col-span-1">
                            <Card
                                title="Student Details"
                                className="h-full"
                                extra={
                                    selectedStudent && (
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={handleStartChat}
                                            loading={isStartingChat}
                                            disabled={!selectedStudent}
                                        >
                                            Start Chat
                                        </Button>
                                    )
                                }
                            >
                                {selectedStudent ? (
                                    <div className="space-y-4">
                                        {/* Student Avatar and Basic Info */}
                                        <div className="text-center">
                                            <div className="w-20 h-20 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-2xl text-blue-600">
                                                    {selectedStudent.first_name.charAt(0)}{selectedStudent.last_name.charAt(0)}
                                                </span>
                                            </div>
                                            <Title level={4} className="mb-1">
                                                {selectedStudent.first_name} {selectedStudent.last_name}
                                            </Title>
                                            <Text className="text-gray-500">{selectedStudent.student_id}</Text>
                                        </div>

                                        {/* Student Information */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <Text className="text-gray-600">Email:</Text>
                                                <Text className="font-medium">{selectedStudent.email}</Text>
                                            </div>
                                            <div className="flex justify-between">
                                                <Text className="text-gray-600">Phone:</Text>
                                                <Text className="font-medium">{selectedStudent.phone_number}</Text>
                                            </div>
                                            <div className="flex justify-between">
                                                <Text className="text-gray-600">Program:</Text>
                                                <Text className="font-medium">{selectedStudent.program}</Text>
                                            </div>
                                            <div className="flex justify-between">
                                                <Text className="text-gray-600">Year:</Text>
                                                <Text className="font-medium">{getYearText(selectedStudent.year_of_study)}</Text>
                                            </div>
                                            <div className="flex justify-between">
                                                <Text className="text-gray-600">Status:</Text>
                                                <Text className="font-medium">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${selectedStudent.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {selectedStudent.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </Text>
                                            </div>
                                            <div className="flex justify-between">
                                                <Text className="text-gray-600">Enrolled:</Text>
                                                <Text className="font-medium">
                                                    {new Date(selectedStudent.created_at).toLocaleDateString()}
                                                </Text>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="space-y-2 pt-4 border-t border-gray-200">
                                            <Button
                                                block
                                                onClick={handleViewProfile}
                                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                            >
                                                View Full Profile
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <MessageOutlined className="text-4xl mb-4 text-gray-300" />
                                        <p>Select a student to view details</p>
                                        <p className="text-sm">and start a conversation</p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default StudentsChat; 