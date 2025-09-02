import React, { useState, useEffect } from 'react';
import {
    Card,
    Select,
    Button,
    Row,
    Col,
    Calendar,
    Badge,
    Space,
    Tabs,
    List,
    Avatar,
    Tag,
    Tooltip
} from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    UserOutlined,
    EnvironmentOutlined,
    BookOutlined
} from '@ant-design/icons';
import {
    CalendarEvent,
    WeeklySchedule,
    Semester
} from '../../types/scheduling';
import {
    calendarAPI,
    classAPI,
    semesterAPI
} from '../../services/schedulingAPI';
import PageTitleArea from '../../components/shared/PageTitleArea';
import dayjs, { Dayjs } from 'dayjs';

const { TabPane } = Tabs;

export default function ClassCalendarPage() {
    const [selectedTerm, setSelectedTerm] = useState<string>('');
    const [terms, setTerms] = useState<Semester[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule | null>(null);
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTerms();
    }, []);

    useEffect(() => {
        if (selectedTerm) {
            loadCalendarData();
        }
    }, [selectedTerm, currentDate, viewMode]);

    const loadTerms = async () => {
        try {
            const data = await semesterAPI.getAllSemesters();
            setTerms(data);
            if (data.length > 0) {
                setSelectedTerm(data[0].id);
            }
        } catch (error) {
            console.error('Error loading terms:', error);
        }
    };

    const loadCalendarData = async () => {
        if (!selectedTerm) return;

        setLoading(true);
        try {
            let startDate: string, endDate: string;

            if (viewMode === 'month') {
                startDate = currentDate.startOf('month').format('YYYY-MM-DD');
                endDate = currentDate.endOf('month').format('YYYY-MM-DD');
            } else if (viewMode === 'week') {
                startDate = currentDate.startOf('week').format('YYYY-MM-DD');
                endDate = currentDate.endOf('week').format('YYYY-MM-DD');
            } else {
                startDate = currentDate.format('YYYY-MM-DD');
                endDate = currentDate.format('YYYY-MM-DD');
            }

            const events = await calendarAPI.getCalendarEvents(startDate, endDate, selectedTerm);
            setCalendarEvents(events);

            if (viewMode === 'week') {
                const weekly = await calendarAPI.getWeeklySchedule(startDate, selectedTerm);
                setWeeklySchedule(weekly);
            }
        } catch (error) {
            console.error('Error loading calendar data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date: Dayjs) => {
        setCurrentDate(date);
    };

    const handlePrevPeriod = () => {
        if (viewMode === 'month') {
            setCurrentDate(currentDate.subtract(1, 'month'));
        } else if (viewMode === 'week') {
            setCurrentDate(currentDate.subtract(1, 'week'));
        } else {
            setCurrentDate(currentDate.subtract(1, 'day'));
        }
    };

    const handleNextPeriod = () => {
        if (viewMode === 'month') {
            setCurrentDate(currentDate.add(1, 'month'));
        } else if (viewMode === 'week') {
            setCurrentDate(currentDate.add(1, 'week'));
        } else {
            setCurrentDate(currentDate.add(1, 'day'));
        }
    };

    const handleToday = () => {
        setCurrentDate(dayjs());
    };

    const getDateCellRender = (date: Dayjs) => {
        const dayEvents = calendarEvents.filter(event =>
            dayjs(event.start).isSame(date, 'day')
        );

        return (
            <div className="calendar-cell">
                {dayEvents.map(event => (
                    <Tooltip
                        key={event.id}
                        title={
                            <div>
                                <div><strong>{event.title}</strong></div>
                                <div>{event.course_title}</div>
                                <div>{event.instructor_name}</div>
                                <div>{event.venue_name}</div>
                                <div>{dayjs(event.start).format('HH:mm')} - {dayjs(event.end).format('HH:mm')}</div>
                            </div>
                        }
                    >
                        <Badge
                            key={event.id}
                            color={event.color}
                            text={
                                <div className="text-xs truncate">
                                    {event.title}
                                </div>
                            }
                        />
                    </Tooltip>
                ))}
            </div>
        );
    };

    const renderWeeklyView = () => {
        if (!weeklySchedule) return null;

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        return (
            <div className="weekly-schedule">
                <Row gutter={16}>
                    {days.map((day, index) => (
                        <Col span={3} key={day}>
                            <Card
                                title={
                                    <div className="text-center">
                                        <div className="font-medium">{dayLabels[index]}</div>
                                        <div className="text-sm text-gray-500">
                                            {currentDate.startOf('week').add(index, 'day').format('MMM DD')}
                                        </div>
                                    </div>
                                }
                                size="small"
                                className="h-96 overflow-y-auto"
                            >
                                {weeklySchedule[day as keyof WeeklySchedule]?.map(meeting => (
                                    <Card
                                        key={meeting.id}
                                        size="small"
                                        className="mb-2"
                                        bodyStyle={{ padding: '8px' }}
                                    >
                                        <div className="text-xs font-medium text-blue-600">
                                            {meeting.start_time} - {meeting.end_time}
                                        </div>
                                        <div className="text-xs text-gray-700">
                                            {meeting.venue?.name} {meeting.venue?.room_number}
                                        </div>
                                    </Card>
                                ))}
                                {(!weeklySchedule[day as keyof WeeklySchedule] ||
                                    weeklySchedule[day as keyof WeeklySchedule].length === 0) && (
                                        <div className="text-center text-gray-400 text-xs py-8">
                                            No classes
                                        </div>
                                    )}
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        );
    };

    const renderDailyView = () => {
        const dayEvents = calendarEvents.filter(event =>
            dayjs(event.start).isSame(currentDate, 'day')
        );

        return (
            <div className="daily-schedule">
                <Card>
                    <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold">
                            {currentDate.format('dddd, MMMM DD, YYYY')}
                        </h3>
                    </div>

                    {dayEvents.length > 0 ? (
                        <List
                            dataSource={dayEvents}
                            renderItem={event => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                style={{ backgroundColor: event.color }}
                                                icon={<CalendarOutlined />}
                                            />
                                        }
                                        title={
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{event.title}</span>
                                                <Tag color={event.color}>
                                                    {dayjs(event.start).format('HH:mm')} - {dayjs(event.end).format('HH:mm')}
                                                </Tag>
                                            </div>
                                        }
                                        description={
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <BookOutlined className="text-gray-400" />
                                                    <span>{event.course_title}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <UserOutlined className="text-gray-400" />
                                                    <span>{event.instructor_name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <EnvironmentOutlined className="text-gray-400" />
                                                    <span>{event.venue_name}</span>
                                                </div>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        <div className="text-center text-gray-400 py-12">
                            <CalendarOutlined className="text-4xl mb-4" />
                            <div>No classes scheduled for this day</div>
                        </div>
                    )}
                </Card>
            </div>
        );
    };

    return (
        <div className="p-6">
            <PageTitleArea
                title="Class Calendar"
                subtitle="View class schedules in calendar format with weekly, monthly, and daily views"
            />

            {/* Controls */}
            <Card className="mb-6">
                <Row gutter={16} align="middle">
                    <Col>
                        <span className="text-gray-700 font-medium mr-2">Semester:</span>
                        <Select
                            value={selectedTerm}
                            onChange={setSelectedTerm}
                            style={{ width: 200 }}
                            placeholder="Select semester"
                        >
                            {terms.map(term => (
                                <Select.Option key={term.id} value={term.id}>
                                    {term.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>

                    <Col>
                        <span className="text-gray-700 font-medium mr-2">View:</span>
                        <Select
                            value={viewMode}
                            onChange={setViewMode}
                            style={{ width: 120 }}
                        >
                            <Select.Option value="month">Month</Select.Option>
                            <Select.Option value="week">Week</Select.Option>
                            <Select.Option value="day">Day</Select.Option>
                        </Select>
                    </Col>

                    <Col>
                        <Space>
                            <Button icon={<LeftOutlined />} onClick={handlePrevPeriod}>
                                Previous
                            </Button>
                            <Button onClick={handleToday}>Today</Button>
                            <Button icon={<RightOutlined />} onClick={handleNextPeriod}>
                                Next
                            </Button>
                        </Space>
                    </Col>

                    <Col>
                        <span className="text-gray-700 font-medium">
                            {viewMode === 'month' && currentDate.format('MMMM YYYY')}
                            {viewMode === 'week' && `${currentDate.startOf('week').format('MMM DD')} - ${currentDate.endOf('week').format('MMM DD, YYYY')}`}
                            {viewMode === 'day' && currentDate.format('MMMM DD, YYYY')}
                        </span>
                    </Col>
                </Row>
            </Card>

            {/* Calendar Views */}
            <Tabs activeKey={viewMode} onChange={(key) => setViewMode(key as any)}>
                <TabPane tab="Month View" key="month">
                    <Card>
                        <Calendar
                            value={currentDate}
                            onChange={handleDateChange}
                            dateCellRender={getDateCellRender}
                        />
                    </Card>
                </TabPane>

                <TabPane tab="Week View" key="week">
                    {renderWeeklyView()}
                </TabPane>

                <TabPane tab="Day View" key="day">
                    {renderDailyView()}
                </TabPane>
            </Tabs>
        </div>
    );
} 