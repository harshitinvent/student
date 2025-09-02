import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Form, Input, Select, Button, List, Avatar, Typography, Upload, message, Spin } from 'antd';
import { UserOutlined, TeamOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { getAllStudents, searchStudents, type Student } from '../../../services/studentAPI';
import type { CreateGroupRequest } from '../../../types/chat';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface NewChatModalProps {
    open: boolean;
    onCancel: () => void;
    onCreateGroup: (data: CreateGroupRequest) => void;
    onCreateDM: (recipientId: string) => void;
    currentUserId: string;
}

export default function NewChatModal({
    open,
    onCancel,
    onCreateGroup,
    onCreateDM,
    currentUserId
}: NewChatModalProps) {
    const [activeTab, setActiveTab] = useState('dm');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Student[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);

    const [groupForm] = Form.useForm();
    const [dmForm] = Form.useForm();

    // Load all students on component mount
    useEffect(() => {
        if (open) {
            loadAllStudents();
        }
    }, [open]);

    // Search students when search term changes
    useEffect(() => {
        if (searchTerm.trim().length >= 2) {
            performSearch();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, allStudents]);

    const loadAllStudents = async () => {
        try {
            setLoading(true);
            const students = await getAllStudents();
            setAllStudents(students);
        } catch (error) {
            console.error('Error loading students:', error);
            message.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const performSearch = async () => {
        try {
            setSearching(true);
            const results = await searchStudents(searchTerm);
            // Filter out current user if needed
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching students:', error);
            message.error('Failed to search students');
        } finally {
            setSearching(false);
        }
    };

    const handleUserSelect = (student: Student) => {
        if (activeTab === 'dm') {
            // For DM, directly create conversation
            onCreateDM(student.ID.toString());
        } else {
            // For group, add to selected students
            if (!selectedStudents.find(s => s.ID === student.ID)) {
                setSelectedStudents([...selectedStudents, student]);
            }
        }
    };

    const handleRemoveUser = (studentId: string) => {
        setSelectedStudents(selectedStudents.filter(s => s.ID.toString() !== studentId));
    };

    const handleCreateGroup = async (values: any) => {
        if (selectedStudents.length === 0) {
            message.error('Please select at least one participant');
            return;
        }

        const groupData: CreateGroupRequest = {
            name: values.name,
            participants: selectedStudents.map(s => s.ID.toString()),
            description: values.description || ''
        };

        onCreateGroup(groupData);
        handleCancel();
    };

    const handleCancel = () => {
        setActiveTab('dm');
        setSearchTerm('');
        setSearchResults([]);
        setSelectedStudents([]);
        groupForm.resetFields();
        dmForm.resetFields();
        onCancel();
    };

    const renderStudentItem = (student: Student, index: number) => (
        <List.Item
            key={student.ID}
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleUserSelect(student)}
        >
            <div className="flex items-center space-x-3 w-full">
                <Avatar
                    size={40}
                    icon={<UserOutlined />}
                    className="bg-blue-500"
                >
                    {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <Text strong className="block truncate">
                            {student.first_name} {student.last_name}
                        </Text>
                        {activeTab === 'group' && selectedStudents.find(s => s.ID === student.ID) && (
                            <div className="text-blue-500">✓</div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                        <Text className="text-sm text-gray-600">
                            {student.student_id}
                        </Text>
                        <Text className="text-sm text-gray-500">•</Text>
                        <Text className="text-sm text-gray-600">
                            {student.email}
                        </Text>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                        <Text className="text-xs text-gray-500">
                            {student.program}
                        </Text>
                        <Text className="text-xs text-gray-500">•</Text>
                        <Text className="text-xs text-gray-500">
                            Year {student.year_of_study}
                        </Text>
                    </div>
                </div>
            </div>
        </List.Item>
    );

    return (
        <Modal
            title={
                <div className="flex items-center space-x-2">
                    <TeamOutlined className="text-blue-500" />
                    <span>New Chat</span>
                </div>
            }
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={600}
            destroyOnHidden
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: 'dm',
                        label: (
                            <span>
                                <UserOutlined />
                                Direct Message
                            </span>
                        ),
                        children: (
                            <div className="mt-4">
                                <div className="mb-4">
                                    <Text className="text-gray-600">
                                        Search for a student to start a direct message conversation.
                                    </Text>
                                </div>

                                <Input
                                    placeholder="Search students by name, email, or ID..."
                                    prefix={<SearchOutlined />}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="mb-4"
                                />

                                {searching ? (
                                    <div className="text-center py-8">
                                        <Spin size="large" />
                                        <p className="mt-2 text-gray-500">Searching students...</p>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <List
                                        dataSource={searchResults}
                                        renderItem={renderStudentItem}
                                        className="max-h-64 overflow-y-auto"
                                    />
                                ) : searchTerm.trim().length >= 2 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No students found</p>
                                        <p className="text-sm">Try a different search term</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <p>Enter at least 2 characters to search</p>
                                    </div>
                                )}
                            </div>
                        )
                    },
                    {
                        key: 'group',
                        label: (
                            <span>
                                <TeamOutlined />
                                Group Chat
                            </span>
                        ),
                        children: (
                            <div className="mt-4">
                                <Form form={groupForm} layout="vertical">
                                    <Form.Item
                                        name="name"
                                        label="Group Name"
                                        rules={[{ required: true, message: 'Please enter group name' }]}
                                    >
                                        <Input placeholder="Enter group name" />
                                    </Form.Item>

                                    <Form.Item
                                        name="description"
                                        label="Description (Optional)"
                                    >
                                        <TextArea
                                            placeholder="Enter group description"
                                            rows={3}
                                        />
                                    </Form.Item>
                                </Form>

                                <div className="mb-4">
                                    <Text className="text-gray-600">
                                        Search and select students to add to the group.
                                    </Text>
                                </div>

                                <Input
                                    placeholder="Search students..."
                                    prefix={<SearchOutlined />}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="mb-4"
                                />

                                {searching ? (
                                    <div className="text-center py-4">
                                        <Spin />
                                        <p className="mt-2 text-sm text-gray-500">Searching...</p>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <List
                                        dataSource={searchResults}
                                        renderItem={renderStudentItem}
                                        className="max-h-32 overflow-y-auto mb-4"
                                    />
                                ) : searchTerm.trim().length >= 2 ? (
                                    <div className="text-center py-4 text-gray-500">
                                        <p className="text-sm">No students found</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-gray-400">
                                        <p className="text-sm">Enter at least 2 characters to search</p>
                                    </div>
                                )}

                                {selectedStudents.length > 0 && (
                                    <div className="border-t pt-4">
                                        <Text strong className="block mb-2">
                                            Selected Students ({selectedStudents.length})
                                        </Text>
                                        <div className="space-y-2">
                                            {selectedStudents.map(student => (
                                                <div key={student.ID} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar size={24} icon={<UserOutlined />}>
                                                            {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                                                        </Avatar>
                                                        <span className="text-sm">
                                                            {student.first_name} {student.last_name}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        onClick={() => handleRemoveUser(student.ID.toString())}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            type="primary"
                                            onClick={() => groupForm.submit()}
                                            className="w-full mt-4"
                                            disabled={selectedStudents.length === 0}
                                        >
                                            Create Group Chat
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )
                    }
                ]}
            />
        </Modal>
    );
} 