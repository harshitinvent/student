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
    DatePicker,
    Select,
    Card,
    Row,
    Col,
    Statistic
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import { AcademicTerm, CreateAcademicTermRequest, UpdateAcademicTermRequest } from '../../types/scheduling';
import { academicTermAPI } from '../../services/schedulingAPI';
import PageTitleArea from '../../components/shared/PageTitleArea';
import dayjs from 'dayjs';

const { Search } = Input;
const { RangePicker } = DatePicker;

export default function AcademicTermsPage() {
    const [terms, setTerms] = useState<AcademicTerm[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTerm, setEditingTerm] = useState<AcademicTerm | null>(null);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        loadTerms();
    }, []);

    const loadTerms = async () => {
        setLoading(true);
        try {
            const data = await academicTermAPI.getAllTerms();
            setTerms(data);
        } catch (error) {
            message.error('Failed to load academic terms');
            console.error('Error loading terms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingTerm(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (term: AcademicTerm) => {
        setEditingTerm(term);
        form.setFieldsValue({
            name: term.name,
            date_range: [dayjs(term.start_date), dayjs(term.end_date)],
            status: term.status
        });
        setModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await academicTermAPI.deleteTerm(id);
            message.success('Academic term deleted successfully');
            loadTerms();
        } catch (error) {
            message.error('Failed to delete academic term');
            console.error('Error deleting term:', error);
        }
    };

    const handleModalSubmit = async () => {
        try {
            const values = await form.validateFields();
            const { date_range, ...otherValues } = values;

            const termData = {
                ...otherValues,
                start_date: date_range[0].format('YYYY-MM-DD'),
                end_date: date_range[1].format('YYYY-MM-DD')
            };

            if (editingTerm) {
                await academicTermAPI.updateTerm(editingTerm.id, termData);
                message.success('Academic term updated successfully');
            } else {
                await academicTermAPI.createTerm(termData);
                message.success('Academic term created successfully');
            }

            setModalVisible(false);
            loadTerms();
        } catch (error) {
            message.error('Failed to save academic term');
            console.error('Error saving term:', error);
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setEditingTerm(null);
        form.resetFields();
    };

    const filteredTerms = terms.filter(term =>
        term.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'green';
            case 'PLANNED':
                return 'blue';
            case 'COMPLETED':
                return 'gray';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'Active';
            case 'PLANNED':
                return 'Planned';
            case 'COMPLETED':
                return 'Completed';
            default:
                return status;
        }
    };

    const columns = [
        {
            title: 'Term Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => (
                <span className="font-medium text-gray-900">{name}</span>
            ),
        },
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
        },
        {
            title: 'Duration',
            key: 'duration',
            render: (record: AcademicTerm) => {
                const start = dayjs(record.start_date);
                const end = dayjs(record.end_date);
                const weeks = Math.ceil(end.diff(start, 'week', true));
                return `${weeks} weeks`;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: AcademicTerm) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Academic Term"
                        description="Are you sure you want to delete this academic term? This action cannot be undone."
                        onConfirm={() => handleDelete(record.id)}
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

    const activeTerms = terms.filter(term => term.status === 'ACTIVE').length;
    const plannedTerms = terms.filter(term => term.status === 'PLANNED').length;
    const completedTerms = terms.filter(term => term.status === 'COMPLETED').length;

    return (
        <div className="p-6">
            <PageTitleArea
                title="Academic Terms Management"
                subtitle="Create and manage academic terms for scheduling classes"
                action={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        size="large"
                    >
                        Add Academic Term
                    </Button>
                }
            />

            {/* Statistics Cards */}
            <Row gutter={16} className="mb-6">
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Terms"
                            value={terms.length}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Active Terms"
                            value={activeTerms}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Planned Terms"
                            value={plannedTerms}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Completed Terms"
                            value={completedTerms}
                            valueStyle={{ color: '#8c8c8c' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Search and Table */}
            <Card>
                <div className="mb-4">
                    <Search
                        placeholder="Search academic terms..."
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
                    dataSource={filteredTerms}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} terms`,
                    }}
                />
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                title={
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">
                            {editingTerm ? 'Edit Academic Term' : 'Add New Academic Term'}
                        </h2>
                        <p className="text-gray-600 text-sm">
                            {editingTerm ? 'Update term information' : 'Enter term details'}
                        </p>
                    </div>
                }
                open={modalVisible}
                onCancel={handleModalCancel}
                footer={null}
                width={600}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-6"
                    onFinish={handleModalSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Term Name"
                        rules={[
                            { required: true, message: 'Please enter term name' },
                            { min: 3, message: 'Term name must be at least 3 characters' },
                            { max: 100, message: 'Term name cannot exceed 100 characters' }
                        ]}
                    >
                        <Input
                            placeholder="e.g., Fall 2025, Spring 2026"
                            size="large"
                            className="text-base"
                        />
                    </Form.Item>

                    <Form.Item
                        name="date_range"
                        label="Term Duration"
                        rules={[
                            { required: true, message: 'Please select term duration' }
                        ]}
                    >
                        <RangePicker
                            size="large"
                            className="w-full text-base"
                            format="MMM DD, YYYY"
                            placeholder={['Start Date', 'End Date']}
                        />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[
                            { required: true, message: 'Please select status' }
                        ]}
                    >
                        <Select
                            placeholder="Select status"
                            size="large"
                            className="text-base"
                        >
                            <Select.Option value="PLANNED">Planned</Select.Option>
                            <Select.Option value="ACTIVE">Active</Select.Option>
                            <Select.Option value="COMPLETED">Completed</Select.Option>
                        </Select>
                    </Form.Item>

                    <div className="flex gap-3 mt-6">
                        <Button
                            size="large"
                            block
                            onClick={handleModalCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            block
                            htmlType="submit"
                        >
                            {editingTerm ? 'Update Term' : 'Create Term'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
} 