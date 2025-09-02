import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Input,
    Modal,
    Form,
    message,
    Space,
    Tag,
    Popconfirm,
    Select,
    Card,
    Row,
    Col,
    Statistic,
    Tabs,
    Badge,
    Tooltip
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ClockCircleOutlined,
    UserOutlined,
    BookOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import {
    Class,
    CreateClassRequest,
    UpdateClassRequest,
    ClassMeetingTime,
    CreateMeetingTimeRequest,
    Semester
} from '../../types/scheduling';
import {
    classAPI,
    semesterAPI,
    meetingTimeAPI,
    venueAPI
} from '../../services/schedulingAPI';
import PageTitleArea from '../../components/shared/PageTitleArea';
import AddEditClassModal from '../../components/features/scheduling/AddEditClassModal';
import AddMeetingTimeModal from '../../components/features/scheduling/AddMeetingTimeModal';

const { Search } = Input;
const { TabPane } = Tabs;

export default function ClassManagementPage() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [venues, setVenues] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState<string>('');
    const [searchText, setSearchText] = useState('');
    const [classModalVisible, setClassModalVisible] = useState(false);
    const [meetingModalVisible, setMeetingModalVisible] = useState(false);
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [selectedClassForMeeting, setSelectedClassForMeeting] = useState<Class | null>(null);

    useEffect(() => {
        loadSemesters();
        loadVenues();
    }, []);

    useEffect(() => {
        if (selectedSemester) {
            loadClasses();
        }
    }, [selectedSemester]);

    const loadSemesters = async () => {
        try {
            const data = await semesterAPI.getAllSemesters();
            setSemesters(data);
            if (data.length > 0) {
                setSelectedSemester(data[0].id);
            }
        } catch (error) {
            message.error('Failed to load semesters');
            console.error('Error loading semesters:', error);
        }
    };

    const loadVenues = async () => {
        try {
            const data = await venueAPI.getAllVenues();
            setVenues(data);
        } catch (error) {
            message.error('Failed to load venues');
            console.error('Error loading venues:', error);
        }
    };

    const loadClasses = async () => {
        if (!selectedSemester) return;

        setLoading(true);
        try {
            const response = await classAPI.getAllClasses({ semester_id: selectedSemester });
            setClasses(response.data);
        } catch (error) {
            message.error('Failed to load classes');
            console.error('Error loading classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClass = () => {
        setEditingClass(null);
        setClassModalVisible(true);
    };

    const handleEditClass = (classItem: Class) => {
        setEditingClass(classItem);
        setClassModalVisible(true);
    };

    const handleDeleteClass = async (id: string) => {
        try {
            await classAPI.deleteClass(id);
            message.success('Class deleted successfully');
            loadClasses();
        } catch (error) {
            message.error('Failed to delete class');
            console.error('Error deleting class:', error);
        }
    };

    const handleClassModalSubmit = async (classData: CreateClassRequest | UpdateClassRequest) => {
        try {
            if (editingClass) {
                await classAPI.updateClass(editingClass.id, classData as UpdateClassRequest);
                message.success('Class updated successfully');
            } else {
                await classAPI.createClass(classData as CreateClassRequest);
                message.success('Class created successfully');
            }
            setClassModalVisible(false);
            loadClasses();
        } catch (error) {
            message.error('Failed to save class');
            console.error('Error saving class:', error);
        }
    };

    const handleAddMeetingTime = (classItem: Class) => {
        setSelectedClassForMeeting(classItem);
        setMeetingModalVisible(true);
    };

    const handleMeetingModalSubmit = async (meetingData: CreateMeetingTimeRequest) => {
        try {
            await meetingTimeAPI.addMeetingTime(selectedClassForMeeting!.id, meetingData);
            message.success('Meeting time added successfully');
            setMeetingModalVisible(false);
            loadClasses();
        } catch (error) {
            if (error instanceof Error && error.message.includes('Schedule conflict')) {
                message.error(error.message);
            } else {
                message.error('Failed to add meeting time');
            }
            console.error('Error adding meeting time:', error);
        }
    };

    const handleDeleteMeetingTime = async (meetingId: string) => {
        try {
            await meetingTimeAPI.deleteMeetingTime(meetingId);
            message.success('Meeting time deleted successfully');
            loadClasses();
        } catch (error) {
            message.error('Failed to delete meeting time');
            console.error('Error deleting meeting time:', error);
        }
    };

    const filteredClasses = classes.filter(classItem =>
        classItem.course?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        classItem.course?.course_code?.toLowerCase().includes(searchText.toLowerCase()) ||
        classItem.section_code.toLowerCase().includes(searchText.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'green';
            case 'PLANNED':
                return 'blue';
            case 'CANCELLED':
                return 'red';
            case 'COMPLETED':
                return 'gray';
            default:
                return 'default';
        }
    };

    const getDeliveryModeColor = (mode: string) => {
        switch (mode) {
            case 'IN_PERSON':
                return 'blue';
            case 'ONLINE_SYNC':
                return 'green';
            case 'ONLINE_ASYNC':
                return 'orange';
            case 'HYBRID':
                return 'purple';
            default:
                return 'default';
        }
    };

    const getDeliveryModeText = (mode: string) => {
        switch (mode) {
            case 'IN_PERSON':
                return 'In-Person';
            case 'ONLINE_SYNC':
                return 'Online Sync';
            case 'ONLINE_ASYNC':
                return 'Online Async';
            case 'HYBRID':
                return 'Hybrid';
            default:
                return mode;
        }
    };

    const columns = [
        {
            title: 'Course',
            key: 'course',
            render: (record: Class) => (
                <div>
                    <div className="font-medium text-gray-900">
                        {record.course?.course_code} - {record.course?.title}
                    </div>
                    <div className="text-sm text-gray-500">
                        Section {record.section_code}
                    </div>
                </div>
            ),
        },
        {
            title: 'Instructor',
            key: 'instructor',
            render: (record: Class) => (
                <div className="flex items-center gap-2">
                    <UserOutlined className="text-gray-400" />
                    <span>{record.instructor?.first_name} {record.instructor?.last_name}</span>
                </div>
            ),
        },
        {
            title: 'Capacity',
            key: 'capacity',
            render: (record: Class) => (
                <div className="text-center">
                    <div className="font-medium">
                        {record.current_enrollment}/{record.max_capacity}
                    </div>
                    <div className="text-xs text-gray-500">
                        {Math.round((record.current_enrollment / record.max_capacity) * 100)}% Full
                    </div>
                </div>
            ),
        },
        {
            title: 'Delivery Mode',
            dataIndex: 'delivery_mode',
            key: 'delivery_mode',
            render: (mode: string) => (
                <Tag color={getDeliveryModeColor(mode)}>
                    {getDeliveryModeText(mode)}
                </Tag>
            ),
        },
        {
            title: 'Meeting Times',
            key: 'meeting_times',
            render: (record: Class) => (
                <div>
                    {record.meeting_times && record.meeting_times.length > 0 ? (
                        <div className="space-y-1">
                            {record.meeting_times.map((meeting, index) => (
                                <div key={meeting.id} className="flex items-center justify-between text-sm">
                                    <span>
                                        {meeting.day_of_week.slice(0, 3)} {meeting.start_time}-{meeting.end_time}
                                    </span>
                                    <Button
                                        type="text"
                                        size="small"
                                        danger
                                        onClick={() => handleDeleteMeetingTime(meeting.id)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className="text-gray-400 text-sm">No meeting times set</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: Class) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditClass(record)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Edit
                    </Button>
                    <Button
                        type="text"
                        icon={<ClockCircleOutlined />}
                        onClick={() => handleAddMeetingTime(record)}
                        className="text-green-600 hover:text-green-800"
                    >
                        Add Time
                    </Button>
                    <Popconfirm
                        title="Delete Class"
                        description="Are you sure you want to delete this class? This action cannot be undone."
                        onConfirm={() => handleDeleteClass(record.id)}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            className="text-red-600 hover:text-red-800"
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const activeClasses = classes.filter(classItem => classItem.status === 'ACTIVE').length;
    const plannedClasses = classes.filter(classItem => classItem.status === 'PLANNED').length;
    const totalEnrollment = classes.reduce((sum, classItem) => sum + classItem.current_enrollment, 0);
    const totalCapacity = classes.reduce((sum, classItem) => sum + classItem.max_capacity, 0);

    return (
        <div className="p-6">
            <PageTitleArea
                title="Class Management"
                subtitle="Create and manage class sections with meeting times and venue assignments"
                action={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateClass}
                        size="large"
                        disabled={!selectedSemester}
                    >
                        Add Class Section
                    </Button>
                }
            />

            {/* Term Selection */}
            <Card className="mb-6">
                <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">Academic Term:</span>
                    <Select
                        value={selectedSemester}
                        onChange={setSelectedSemester}
                        style={{ width: 200 }}
                        placeholder="Select academic term"
                    >
                        {semesters.map(semester => (
                            <Select.Option key={semester.id} value={semester.id}>
                                {semester.name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </Card>

            {/* Statistics Cards */}
            <Row gutter={16} className="mb-6">
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Classes"
                            value={classes.length}
                            prefix={<BookOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Active Classes"
                            value={activeClasses}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Planned Classes"
                            value={plannedClasses}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Enrollment Rate"
                            value={totalCapacity > 0 ? Math.round((totalEnrollment / totalCapacity) * 100) : 0}
                            suffix="%"
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Classes Table */}
            <Card>
                <div className="mb-4">
                    <Search
                        placeholder="Search classes by course code, title, or section..."
                        allowClear
                        enterButton
                        size="large"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ maxWidth: 400 }}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredClasses}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} classes`,
                    }}
                />
            </Card>

            {/* Add/Edit Class Modal */}
            <AddEditClassModal
                open={classModalVisible}
                onClose={() => setClassModalVisible(false)}
                onSubmit={handleClassModalSubmit}
                initialData={editingClass}
                semesters={semesters}
                venues={venues}
            />

            {/* Add Meeting Time Modal */}
            <AddMeetingTimeModal
                open={meetingModalVisible}
                onClose={() => setMeetingModalVisible(false)}
                onSubmit={handleMeetingModalSubmit}
                classData={selectedClassForMeeting}
                venues={venues}
            />
        </div>
    );
} 