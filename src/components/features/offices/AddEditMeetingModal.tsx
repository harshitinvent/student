import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, DatePicker, Select, Space, Avatar, List, Typography, Form, Row, Col, Divider } from 'antd';
import { PlusOutlined, CloseOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { OfficeMeeting, CreateMeetingRequest, UpdateMeetingRequest } from '../../../types/offices';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

interface AddEditMeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
    meeting?: OfficeMeeting;
    onSave: (meetingData: CreateMeetingRequest | UpdateMeetingRequest) => void;
    mode: 'create' | 'edit';
}

interface Participant {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    avatar_url?: string;
    email: string;
}

const AddEditMeetingModal: React.FC<AddEditMeetingModalProps> = ({
    isOpen,
    onClose,
    meeting,
    onSave,
    mode
}) => {
    const [form] = Form.useForm();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Participant[]>([]);
    const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (meeting && mode === 'edit') {
            form.setFieldsValue({
                title: meeting.title,
                start_time: dayjs(meeting.start_time),
                end_time: dayjs(meeting.end_time),
                meeting_type: meeting.meeting_type,
                max_participants: meeting.max_participants || 10,
                description: meeting.description || '',
            });
        }
    }, [meeting, mode, form]);

    // Fetch participants when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchParticipants();
        }
    }, [isOpen]);

    const fetchParticipants = async () => {
        setIsSearching(true);
        try {
            // Fetch all users from common/users API
            const token = localStorage.getItem('token');
            const response = await fetch('/api/common/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            const users = data.data || [];

            // Transform API response to Participant format
            const participants: Participant[] = users.map((user: any) => ({
                id: user.id,
                first_name: user.first_name || user.firstName || '',
                last_name: user.last_name || user.lastName || '',
                username: user.username || '',
                email: user.email || '',
                avatar_url: user.avatar_url || user.avatarUrl || '/pic/user-avatar.jpg'
            }));

            setSearchResults(participants);
        } catch (error) {
            console.error('Error fetching users:', error);
            // Fallback to empty results on error
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = async (query: string) => {
        if (query.length < 3) {
            // If search query is too short, show all participants
            await fetchParticipants();
            return;
        }

        setIsSearching(true);
        try {
            // Search users from common/users API
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/common/users?search=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to search users');
            }

            const data = await response.json();
            const users = data.data || [];

            // Transform API response to Participant format
            const participants: Participant[] = users.map((user: any) => ({
                id: user.id,
                first_name: user.first_name || user.firstName || '',
                last_name: user.last_name || user.lastName || '',
                username: user.username || '',
                email: user.email || '',
                avatar_url: user.avatar_url || user.avatarUrl || '/pic/user-avatar.jpg'
            }));

            setSearchResults(participants);
        } catch (error) {
            console.error('Error searching users:', error);
            // Fallback to empty results on error
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const addParticipant = (participant: Participant) => {
        if (!selectedParticipants.find(p => p.id === participant.id)) {
            setSelectedParticipants(prev => [...prev, participant]);
        }
        setSearchQuery('');
        setSearchResults([]);
    };

    const removeParticipant = (participantId: string) => {
        setSelectedParticipants(prev => prev.filter(p => p.id !== participantId));
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const meetingData = {
                ...values,
                start_time: values.start_time.format('YYYY-MM-DDTHH:mm:ssZ'),
                end_time: values.end_time.format('YYYY-MM-DDTHH:mm:ssZ'),
                participants: selectedParticipants.map(p => p.id)
            };

            if (mode === 'edit' && meeting) {
                const updateData: UpdateMeetingRequest = {
                    title: meetingData.title,
                    start_time: meetingData.start_time,
                    end_time: meetingData.end_time,
                    max_participants: meetingData.max_participants,
                    description: meetingData.description,
                };
                onSave(updateData);
            } else {
                onSave(meetingData as CreateMeetingRequest);
            }
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

    const validateForm = () => {
        return true; // Allow form submission even without participants
    };

    return (
        <Modal
            title={
                <Space>
                    <VideoCameraOutlined style={{ color: '#1890ff' }} />
                    {mode === 'create' ? 'Create New Meeting' : 'Edit Meeting'}
                </Space>
            }
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    disabled={!validateForm()}
                >
                    {mode === 'create' ? 'Create Meeting' : 'Update Meeting'}
                </Button>
            ]}
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    meeting_type: 'AD_HOC',
                    max_participants: 10,
                }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="title"
                            label="Meeting Title"
                            rules={[{ required: true, message: 'Please enter meeting title' }]}
                        >
                            <Input placeholder="Enter meeting title" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="meeting_type"
                            label="Meeting Type"
                        >
                            <Select>
                                <Select.Option value="AD_HOC">Ad-hoc Meeting</Select.Option>
                                <Select.Option value="STUDY_GROUP">Study Group</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="start_time"
                            label="Start Time"
                            rules={[{ required: true, message: 'Please select start time' }]}
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                placeholder="Select start time"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="end_time"
                            label="End Time"
                            rules={[{ required: true, message: 'Please select end time' }]}
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                placeholder="Select end time"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="description"
                    label="Description"
                >
                    <TextArea
                        placeholder="Enter meeting description"
                        rows={3}
                    />
                </Form.Item>

                <Form.Item
                    name="max_participants"
                    label="Max Participants"
                >
                    <Input type="number" min={1} max={100} />
                </Form.Item>

                <Divider orientation="left">Participants</Divider>

                <Form.Item label="Participants">
                    <div style={{ marginBottom: 8 }}>
                        <Input.Search
                            placeholder="Search by name, username, or email"
                            onSearch={handleSearch}
                            loading={isSearching}
                            allowClear
                            style={{ marginBottom: 8 }}
                        />
                        <Button
                            type="link"
                            onClick={fetchParticipants}
                            disabled={isSearching}
                            style={{ padding: 0 }}
                        >
                            Show All Users
                        </Button>
                    </div>
                </Form.Item>

                {searchResults.length > 0 && (
                    <List
                        size="small"
                        dataSource={searchResults}
                        renderItem={(participant) => (
                            <List.Item
                                style={{ cursor: 'pointer', padding: '8px 12px' }}
                                onClick={() => addParticipant(participant)}
                                className="hover:bg-gray-50"
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            src={participant.avatar_url}
                                            icon={<UserOutlined />}
                                        />
                                    }
                                    title={`${participant.first_name} ${participant.last_name}`}
                                    description={`@${participant.username} • ${participant.email}`}
                                />
                                <PlusOutlined style={{ color: '#1890ff' }} />
                            </List.Item>
                        )}
                    />
                )}

                {selectedParticipants.length > 0 && (
                    <div>
                        <Text strong>Selected Participants ({selectedParticipants.length})</Text>
                        <List
                            size="small"
                            dataSource={selectedParticipants}
                            renderItem={(participant) => (
                                <List.Item
                                    style={{
                                        backgroundColor: '#f6ffed',
                                        margin: '8px 0',
                                        borderRadius: '6px',
                                        padding: '8px 12px'
                                    }}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                src={participant.avatar_url}
                                                icon={<UserOutlined />}
                                            />
                                        }
                                        title={`${participant.first_name} ${participant.last_name}`}
                                        description={participant.email}
                                    />
                                    <Button
                                        type="text"
                                        danger
                                        icon={<CloseOutlined />}
                                        onClick={() => removeParticipant(participant.id)}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                )}
            </Form>
        </Modal>
    );
};

export default AddEditMeetingModal; 