import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Avatar, Tag, Space, Typography, Row, Col, Progress, Statistic } from 'antd';
import { VideoCameraOutlined, PlayCircleOutlined, DownloadOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { officesAPI, recordingAPI, storageAPI } from '../../services/officesAPI';
import { OfficeMeeting, MeetingRecording, UserStorage, CreateMeetingRequest, UpdateMeetingRequest } from '../../types/offices';
import AddEditMeetingModal from '../../components/features/offices/AddEditMeetingModal';

const { Title, Text } = Typography;

const Offices: React.FC = () => {
    const [meetings, setMeetings] = useState<OfficeMeeting[]>([]);
    const [recordings, setRecordings] = useState<MeetingRecording[]>([]);
    const [userStorage, setUserStorage] = useState<UserStorage | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('meetings');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<OfficeMeeting | undefined>(undefined);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // Load meetings from API
            const meetingsResponse = await officesAPI.getMyMeetings();
            setMeetings(meetingsResponse.data || []);

            // Load recordings from API (using recordingAPI)
            const recordingsResponse = await recordingAPI.getMeetingRecordings('');
            setRecordings(recordingsResponse || []);

            // Load storage info from API (using storageAPI)
            const storageResponse = await storageAPI.getUserStorage();
            setUserStorage(storageResponse || null);
        } catch (error) {
            console.error('Error loading data from API:', error);
            // Set empty data on error
            setMeetings([]);
            setRecordings([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SCHEDULED': return 'blue';
            case 'ONGOING': return 'green';
            case 'COMPLETED': return 'default';
            case 'CANCELLED': return 'red';
            default: return 'default';
        }
    };

    const handleCreateMeeting = async (meetingData: CreateMeetingRequest) => {
        try {
            // Create meeting via API
            const newMeeting = await officesAPI.createMeeting(meetingData);

            // Add to state
            setMeetings(prev => [newMeeting, ...prev]);
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error('Error creating meeting:', error);
        }
    };

    const handleEditMeeting = async (meetingData: UpdateMeetingRequest) => {
        if (!editingMeeting) return;

        try {
            // Update meeting via API
            const updatedMeeting = await officesAPI.updateMeeting(editingMeeting.id, meetingData);

            // Update state
            setMeetings(prev => prev.map(m => m.id === editingMeeting.id ? updatedMeeting : m));
            setEditingMeeting(undefined);
        } catch (error) {
            console.error('Error updating meeting:', error);
        }
    };

    const handleDeleteMeeting = async (meetingId: string) => {
        try {
            // Delete meeting via API
            await officesAPI.deleteMeeting(meetingId);

            // Remove from state
            setMeetings(prev => prev.filter(m => m.id !== meetingId));
        } catch (error) {
            console.error('Error deleting meeting:', error);
        }
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const openEditModal = (meeting: OfficeMeeting) => {
        setEditingMeeting(meeting);
    };

    const closeModals = () => {
        setIsCreateModalOpen(false);
        setEditingMeeting(undefined);
    };

    // Function to refresh data from API
    const refreshData = async () => {
        await loadData();
    };

    const meetingsColumns = [
        {
            title: 'Meeting',
            dataIndex: 'title',
            key: 'title',
            render: (title: string, meeting: OfficeMeeting) => (
                <Space>
                    <Avatar
                        icon={<VideoCameraOutlined />}
                        style={{ backgroundColor: '#1890ff' }}
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>{title}</div>
                        <Text type="secondary">
                            {meeting.host?.first_name} {meeting.host?.last_name}
                        </Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Time',
            dataIndex: 'start_time',
            key: 'start_time',
            render: (startTime: string, meeting: OfficeMeeting) => (
                <div>
                    <div style={{ fontWeight: 500 }}>
                        {formatDateTime(startTime)}
                    </div>
                    <Text type="secondary">
                        Duration: {Math.round((new Date(meeting.end_time).getTime() - new Date(startTime).getTime()) / (1000 * 60))} min
                    </Text>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>
                    {status}
                </Tag>
            )
        },
        {
            title: 'Participants',
            dataIndex: 'max_participants',
            key: 'max_participants',
            render: (maxParticipants: number, meeting: OfficeMeeting) => (
                <Text>
                    {meeting.participants?.length || 0} / {maxParticipants || '∞'}
                </Text>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, meeting: OfficeMeeting) => (
                <Space>
                    {meeting.status === 'SCHEDULED' && (
                        <Button type="primary" size="small">
                            Join
                        </Button>
                    )}
                    {meeting.status === 'ONGOING' && (
                        <Button type="primary" size="small" style={{ backgroundColor: '#52c41a' }}>
                            Join Now
                        </Button>
                    )}
                    <Button icon={<EditOutlined />} size="small" onClick={() => openEditModal(meeting)} />
                    <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDeleteMeeting(meeting.id)} />
                </Space>
            )
        }
    ];

    const recordingsColumns = [
        {
            title: 'Recording',
            key: 'recording',
            render: (_: any, recording: MeetingRecording) => (
                <Space>
                    <Avatar
                        icon={<PlayCircleOutlined />}
                        style={{ backgroundColor: '#ff4d4f' }}
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>
                            Recording {recording.id.slice(0, 8)}
                        </div>
                        <Text type="secondary">
                            {formatDateTime(recording.recorded_at)}
                        </Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Duration',
            dataIndex: 'duration_seconds',
            key: 'duration_seconds',
            render: (durationSeconds: number) => (
                <Text>{formatDuration(durationSeconds)}</Text>
            )
        },
        {
            title: 'Quality',
            dataIndex: 'recording_quality',
            key: 'recording_quality',
            render: (quality: string) => (
                <Tag color={quality === 'HD' ? 'green' : 'blue'}>
                    {quality}
                </Tag>
            )
        },
        {
            title: 'Size',
            dataIndex: 'file_size',
            key: 'file_size',
            render: (fileSize: number) => (
                <Text>{formatFileSize(fileSize)}</Text>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, recording: MeetingRecording) => (
                <Space>
                    <Button type="primary" size="small" icon={<PlayCircleOutlined />}>
                        Play
                    </Button>
                    <Button size="small" icon={<DownloadOutlined />}>
                        Download
                    </Button>
                    <Button icon={<DeleteOutlined />} size="small" danger />
                </Space>
            )
        }
    ];

    const renderStorageInfo = () => {
        if (!userStorage) return null;

        const usedPercentage = (userStorage.used_storage / userStorage.total_stimit) * 100;
        const storageUsedGB = userStorage.used_storage / (1024 * 1024 * 1024);
        const totalLimitGB = userStorage.total_stimit / (1024 * 1024 * 1024);

        return (
            <div>
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Used Storage"
                                value={storageUsedGB.toFixed(1)}
                                suffix="GB"
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Total Limit"
                                value={totalLimitGB.toFixed(1)}
                                suffix="GB"
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Monthly Cost"
                                value={userStorage.monthly_cost}
                                prefix="$"
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card title="Storage Usage" style={{ marginBottom: 24 }}>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text strong>Storage Usage</Text>
                            <Text type="secondary">{usedPercentage.toFixed(1)}% used</Text>
                        </div>
                        <Progress
                            percent={Math.min(usedPercentage, 100)}
                            status={usedPercentage > 90 ? 'exception' : 'normal'}
                        />
                    </div>

                    <Row gutter={16}>
                        <Col span={8}>
                            <div>
                                <Text type="secondary">Recordings</Text>
                                <div style={{ fontWeight: 500 }}>
                                    {formatFileSize(userStorage.recordings_storage)}
                                </div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                                <Text type="secondary">Documents</Text>
                                <div style={{ fontWeight: 500 }}>
                                    {formatFileSize(userStorage.documents_storage)}
                                </div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                                <Text type="secondary">Other Files</Text>
                                <div style={{ fontWeight: 500 }}>
                                    {formatFileSize(userStorage.other_files_storage)}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                <Card title={`Storage Plan: ${userStorage.storage_plan}`}>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col span={12}>
                            <div>
                                <Text type="secondary">Max Recording Duration</Text>
                                <div style={{ fontWeight: 500 }}>{userStorage.max_recording_duration} minutes</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <Text type="secondary">Retention Period</Text>
                                <div style={{ fontWeight: 500 }}>{userStorage.retention_period_days} days</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <Text type="secondary">Max File Size</Text>
                                <div style={{ fontWeight: 500 }}>{formatFileSize(userStorage.max_file_size)}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <Text type="secondary">Next Billing</Text>
                                <div style={{ fontWeight: 500 }}>
                                    {new Date(userStorage.next_billing_date).toLocaleDateString()}
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Button type="primary" block>
                        Upgrade Storage Plan
                    </Button>
                </Card>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'meetings':
                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Title level={4}>My Meetings</Title>
                            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                                Create Meeting
                            </Button>
                        </div>
                        <Table
                            dataSource={meetings}
                            columns={meetingsColumns}
                            loading={loading}
                            rowKey="id"
                        />
                    </div>
                );
            case 'recordings':
                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Title level={4}>My Recordings</Title>
                            <Button icon={<DownloadOutlined />}>
                                Download All
                            </Button>
                        </div>
                        <Table
                            dataSource={recordings}
                            columns={recordingsColumns}
                            loading={loading}
                            rowKey="id"
                        />
                    </div>
                );
            case 'storage':
                return renderStorageInfo();
            default:
                return null;
        }
    };

    const tabs = [
        { key: 'meetings', label: `My Meetings (${meetings.length})` },
        { key: 'recordings', label: `Recordings (${recordings.length})` },
        { key: 'storage', label: 'Storage' }
    ];

    return (
        <div style={{ padding: 24, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <div style={{ marginBottom: 24 }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ margin: 0 }}>
                            <VideoCameraOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                            Offices
                        </Title>
                        <Text type="secondary">Unified Communication Platform</Text>
                        <div style={{ marginTop: 8 }}>
                            <Tag color="blue" icon={<VideoCameraOutlined />}>
                                API Mode
                            </Tag>
                            <Text type="secondary" style={{ marginLeft: 8 }}>
                                Connected to backend • {meetings.length} meetings loaded
                            </Text>
                        </div>
                    </Col>
                    <Col>
                        <Space>
                            <Button onClick={refreshData} size="small" loading={loading}>
                                Refresh Data
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <div style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', gap: 0 }}>
                            {tabs.map(tab => (
                                <div
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    style={{
                                        padding: '12px 24px',
                                        cursor: 'pointer',
                                        borderBottom: activeTab === tab.key ? '2px solid #1890ff' : 'none',
                                        color: activeTab === tab.key ? '#1890ff' : '#666',
                                        fontWeight: activeTab === tab.key ? 500 : 400,
                                        backgroundColor: activeTab === tab.key ? '#f6ffed' : 'transparent'
                                    }}
                                >
                                    {tab.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    {renderContent()}
                </div>
            </Card>

            {/* Create/Edit Meeting Modal */}
            <AddEditMeetingModal
                isOpen={isCreateModalOpen || !!editingMeeting}
                onClose={closeModals}
                meeting={editingMeeting}
                onSave={(meetingData: CreateMeetingRequest | UpdateMeetingRequest) => {
                    if (editingMeeting) {
                        handleEditMeeting(meetingData as UpdateMeetingRequest);
                    } else {
                        handleCreateMeeting(meetingData as CreateMeetingRequest);
                    }
                }}
                mode={editingMeeting ? 'edit' : 'create'}
            />
        </div>
    );
};

export default Offices; 