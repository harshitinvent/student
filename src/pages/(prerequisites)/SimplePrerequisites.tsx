import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Tag, Space, message, Modal, Form, Select, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons';

const { TextArea } = Input;

// Types
type Course = {
    ID: string;
    course_code: string;
    title: string;
    description: string;
    credit_hours: number;
    status: 'Active' | 'Retired';
};

type Prerequisite = {
    ID: string;
    course_id: string;
    course_code: string;
    course_title: string;
    prerequisite_course_id: string;
    prerequisite_course_code: string;
    prerequisite_course_title: string;
    prerequisite_type: 'SINGLE' | 'AND' | 'OR';
    created_at: string;
};

// API Functions
const API_BASE = 'http://103.189.173.7:8080/api/prerequisites';

function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchPrerequisites(): Promise<Prerequisite[]> {
    const res = await fetch(API_BASE, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch prerequisites');
    const data = await res.json();
    return data.data || data || [];
}

async function fetchCourses(): Promise<Course[]> {
    const res = await fetch('http://103.189.173.7:8080/api/courses', {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch courses');
    const data = await res.json();
    return data.courses || data || [];
}

async function addPrerequisite(data: {
    course_id: string;
    prerequisite_course_id: string;
    prerequisite_type: 'SINGLE' | 'AND' | 'OR';
}): Promise<any> {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add prerequisite');
    return res.json();
}

async function updatePrerequisite(id: string, data: {
    course_id: string;
    prerequisite_course_id: string;
    prerequisite_type: 'SINGLE' | 'AND' | 'OR';
}): Promise<any> {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update prerequisite');
    return res.json();
}

async function deletePrerequisite(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete prerequisite');
    return res.json();
}

export default function SimplePrerequisitesPage() {
    const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editPrerequisite, setEditPrerequisite] = useState<Prerequisite | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [form] = Form.useForm();

    const loadData = async () => {
        setLoading(true);
        try {
            const [prerequisitesData, coursesData] = await Promise.all([
                fetchPrerequisites(),
                fetchCourses()
            ]);
            setPrerequisites(prerequisitesData);
            setCourses(coursesData);
        } catch (error) {
            message.error('Failed to load data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAdd = () => {
        setEditPrerequisite(null);
        setModalOpen(true);
        form.resetFields();
    };

    const handleEdit = (prerequisite: Prerequisite) => {
        setEditPrerequisite(prerequisite);
        setModalOpen(true);
        form.setFieldsValue({
            course_id: prerequisite.course_id,
            prerequisite_course_id: prerequisite.prerequisite_course_id,
            prerequisite_type: prerequisite.prerequisite_type
        });
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditPrerequisite(null);
        form.resetFields();
    };

    const handleModalSubmit = async (values: any) => {
        setModalLoading(true);
        try {
            if (editPrerequisite) {
                await updatePrerequisite(editPrerequisite.ID, values);
                message.success('Prerequisite updated successfully');
            } else {
                await addPrerequisite(values);
                message.success('Prerequisite added successfully');
            }

            setModalOpen(false);
            setEditPrerequisite(null);
            form.resetFields();
            loadData();
        } catch (error: any) {
            message.error(error.message || 'Failed to save prerequisite');
        } finally {
            setModalLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: 'Delete Prerequisite',
            content: 'Are you sure you want to delete this prerequisite?',
            onOk: async () => {
                try {
                    await deletePrerequisite(id);
                    message.success('Prerequisite deleted successfully');
                    loadData();
                } catch (error: any) {
                    message.error(error.message || 'Failed to delete prerequisite');
                }
            },
        });
    };

    const getPrerequisiteTypeColor = (type: string) => {
        switch (type) {
            case 'SINGLE': return 'blue';
            case 'AND': return 'green';
            case 'OR': return 'orange';
            default: return 'default';
        }
    };

    const getPrerequisiteTypeLabel = (type: string) => {
        switch (type) {
            case 'SINGLE': return 'Single';
            case 'AND': return 'AND';
            case 'OR': return 'OR';
            default: return type;
        }
    };

    const columns = [
        {
            title: 'Course',
            dataIndex: 'course_code',
            key: 'course_code',
            render: (code: string, record: Prerequisite) => (
                <div>
                    <div className="font-medium">{code}</div>
                    <div className="text-sm text-gray-500">{record.course_title}</div>
                </div>
            ),
        },
        {
            title: 'Requires',
            dataIndex: 'prerequisite_course_code',
            key: 'prerequisite_course_code',
            render: (code: string, record: Prerequisite) => (
                <div>
                    <div className="font-medium">{code}</div>
                    <div className="text-sm text-gray-500">{record.prerequisite_course_title}</div>
                </div>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'prerequisite_type',
            key: 'prerequisite_type',
            render: (type: string) => (
                <Tag color={getPrerequisiteTypeColor(type)}>
                    {getPrerequisiteTypeLabel(type)}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Prerequisite) => (
                <Space>
                    <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.ID)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    if (loading) {
        return <div className="p-6">Loading prerequisites...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Prerequisites Management</h1>
                <p className="text-gray-600">Define course prerequisites and enrollment requirements</p>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-semibold">Prerequisites ({prerequisites.length})</h3>
                        <p className="text-gray-600">Manage course prerequisites and enrollment rules</p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Add Prerequisite
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={prerequisites}
                    rowKey="ID"
                    pagination={false}
                    locale={{
                        emptyText: (
                            <div className="text-center py-8">
                                <BookOutlined className="text-4xl text-gray-300 mb-4" />
                                <p className="text-gray-500">No prerequisites defined</p>
                                <Button
                                    type="primary"
                                    onClick={handleAdd}
                                    className="mt-2"
                                >
                                    Add First Prerequisite
                                </Button>
                            </div>
                        )
                    }}
                />
            </Card>

            {/* Add/Edit Prerequisite Modal */}
            <Modal
                title={
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">
                            {editPrerequisite ? 'Edit Prerequisite' : 'Add New Prerequisite'}
                        </h2>
                        <p className="text-gray-600 text-sm">
                            {editPrerequisite ? 'Update prerequisite rule' : 'Define course prerequisite'}
                        </p>
                    </div>
                }
                open={modalOpen}
                onCancel={handleModalClose}
                footer={null}
                width={600}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleModalSubmit}
                    initialValues={{
                        prerequisite_type: 'SINGLE'
                    }}
                >
                    <Form.Item
                        name="course_id"
                        label="Course"
                        rules={[{ required: true, message: 'Please select a course' }]}
                    >
                        <Select
                            placeholder="Select course that requires prerequisite"
                            showSearch
                            optionFilterProp="children"
                        >
                            {courses.map(course => (
                                <Select.Option key={course.ID} value={course.ID}>
                                    {course.course_code} - {course.title}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="prerequisite_course_id"
                        label="Prerequisite Course"
                        rules={[{ required: true, message: 'Please select prerequisite course' }]}
                    >
                        <Select
                            placeholder="Select prerequisite course"
                            showSearch
                            optionFilterProp="children"
                        >
                            {courses.map(course => (
                                <Select.Option key={course.ID} value={course.ID}>
                                    {course.course_code} - {course.title}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="prerequisite_type"
                        label="Prerequisite Type"
                        rules={[{ required: true, message: 'Please select prerequisite type' }]}
                    >
                        <Select>
                            <Select.Option value="SINGLE">
                                Single Prerequisite
                            </Select.Option>
                            <Select.Option value="AND">
                                AND Condition
                            </Select.Option>
                            <Select.Option value="OR">
                                OR Condition
                            </Select.Option>
                        </Select>
                    </Form.Item>

                    <div className="flex gap-3">
                        <Button
                            size="large"
                            block
                            onClick={handleModalClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            block
                            htmlType="submit"
                            loading={modalLoading}
                        >
                            {editPrerequisite ? 'Update Prerequisite' : 'Add Prerequisite'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
} 