import { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Pagination, Card, Table, Tag, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined, SearchOutlined } from '@ant-design/icons';
import AddEditTeacherModal from './AddEditTeacherModal';
import ConfirmActionModal from '../../components/shared/ConfirmActionModal';
import DeleteIcon from "../../assets/trash-delete.svg";
import EditIcon from "../../assets/edit.svg";

// API helpers
const API_BASE = 'http://103.189.173.7:8080/api/teachers';

function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

type Teacher = {
    id: string;
    ID: string;
    teacher_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    courses: string[];
    is_active: boolean;
    created_at: string;
};

async function fetchTeachers(search = '', page = 1, pageSize = 10): Promise<{ data: Teacher[]; total: number }> {
    const res = await fetch(`${API_BASE}?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch teachers');
    return res.json();
}

async function addTeacher(data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    courses: string[];
}): Promise<any> {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add teacher');
    return res.json();
}

async function updateTeacher(id: string, data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    courses: string[];
}): Promise<any> {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update teacher');
    return res.json();
}

async function deleteTeacher(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete teacher');
    return res.json();
}

async function activateTeacher(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/${id}/activate`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to activate teacher');
    return res.json();
}

async function deactivateTeacher(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/${id}/deactivate`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to deactivate teacher');
    return res.json();
}

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        action: 'delete' | 'activate' | 'deactivate' | null;
        teacher: Teacher | null;
        loading: boolean;
    }>({ open: false, action: null, teacher: null, loading: false });

    const loadTeachers = () => {
        setTableLoading(true);
        fetchTeachers(search, page, pageSize)
            .then((res) => {
                console.log(res);
                setTeachers(res.data.teachers);
                setTotal(res.data.total);
            })
            .catch(() => message.error('Failed to load teachers'))
            .finally(() => setTableLoading(false));
    };

    useEffect(() => { loadTeachers(); }, [search, page, pageSize]);

    const handleAdd = () => { setEditTeacher(null); setModalOpen(true); };
    const handleEdit = (teacher: Teacher) => { setEditTeacher(teacher); setModalOpen(true); };
    const handleModalClose = () => { setModalOpen(false); setEditTeacher(null); };

    const handleModalSubmit = async (data: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        courses: string[];
    }) => {
        try {
            if (editTeacher) {
                await updateTeacher(editTeacher.ID, data);
                message.success('Teacher updated!');
            } else {
                await addTeacher(data);
                message.success('Teacher added!');
            }
            setModalOpen(false);
            setEditTeacher(null);
            loadTeachers();
        } catch (e: any) {
            message.error(e.message);
        }
    };

    const openConfirmModal = (action: 'delete' | 'activate' | 'deactivate', teacher: Teacher) => {
        setConfirmModal({ open: true, action, teacher, loading: false });
    };

    const closeConfirmModal = () => {
        setConfirmModal((prev) => ({ ...prev, open: false, loading: false }));
    };

    const handleConfirmAction = async () => {
        if (!confirmModal.action || !confirmModal.teacher) return;
        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
            if (confirmModal.action === 'delete') {
                await deleteTeacher(confirmModal.teacher.ID);
                message.success('Teacher deleted!');
            } else if (confirmModal.action === 'activate') {
                await activateTeacher(confirmModal.teacher.ID);
                message.success('Teacher activated!');
            } else if (confirmModal.action === 'deactivate') {
                await deactivateTeacher(confirmModal.teacher.ID);
                message.success('Teacher deactivated!');
            }
            loadTeachers();
            closeConfirmModal();
        } catch (e: any) {
            message.error(e.message);
            setConfirmModal((prev) => ({ ...prev, loading: false }));
        }
    };

    const columns = [
        {
            title: 'Teacher ID',
            dataIndex: 'teacher_id',
            key: 'teacher_id',
            render: (text: string) => <span className="">{text}</span>,
        },
        {
            title: 'Name',
            key: 'name',
            render: (_: any, teacher: Teacher) => (
                <div>
                    <div className="">{`${teacher.first_name} ${teacher.last_name}`}</div>
                    <div className="text-gray-500">{teacher.email}</div>
                </div>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Courses',
            dataIndex: 'courses',
            key: 'courses',
            render: (courses: string[]) => (
                <div className="flex flex-wrap gap-1">
                    {courses && courses.length > 0 ? (
                        courses.slice(0, 2).map((course, index) => (
                            <Tag key={index} color="blue" className="text-xs">
                                {course}
                            </Tag>
                        ))
                    ) : (
                        <span className="">No courses</span>
                    )}
                    {courses && courses.length > 2 && (
                        <Tag color="blue" className="">
                            +{courses.length - 2} more
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (is_active: boolean) => (
                <Tag color={is_active ? 'green' : 'red'} >
                    {is_active ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, teacher: Teacher) => (
                <div className="flex gap-2">
                    <Button className="table-action-button" onClick={() => handleEdit(teacher)} ><img src={EditIcon} alt="Edit" /></Button>
                    <Button
                        className="table-action-status-button"
                        icon={teacher.is_active ? <StopOutlined /> : <CheckCircleOutlined />}
                        onClick={() => openConfirmModal(teacher.is_active ? 'deactivate' : 'activate', teacher)}
                    >
                        {teacher.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button className="table-action-button" onClick={() => openConfirmModal('delete', teacher)} ><img src={DeleteIcon} alt="delete" /></Button>
                </div>
            ),
        },
    ];

    return (
        <div className="venue-management-page">
            <Card
                className="vanue-management-card mb-6"
                title={
                    <div className="card-header-main">
                        <div className="card-header">
                            <h3 className="card-title">Manage Teachers</h3>
                        </div>
                        <Button
                            type="primary"
                            onClick={handleAdd}
                            style={{
                                backgroundColor: '#000000',
                                borderColor: '#000000',
                                fontWeight: 500,
                                color: '#ffffff',
                                borderRadius: '6px',
                            }}
                        >
                            Add Teacher
                        </Button>
                    </div>
                }
            >
                <div className="filters-bar">
                    <Input
                        placeholder="Search teachers by name, email, or teacher ID..."
                        value={search}
                        prefix={<SearchOutlined />}
                        size="large"
                        onChange={(e) => setSearch(e.target.value)}
                        className="filter-input"
                        allowClear
                        onSearch={(v) => setSearch(v)}
                    />
                </div>
                <div className="table-responsive">
                    <Table
                        columns={columns}
                        dataSource={teachers}
                        rowKey="id"
                        className="vanue-table"
                        loading={tableLoading}
                        pagination={{
                            current: page,
                            pageSize,
                            total,
                            showSizeChanger: true,
                            onChange: (p, ps) => {
                                setPage(p);
                                setPageSize(ps || 10);
                            },
                        }}
                    />
                </div>

                <AddEditTeacherModal
                    open={modalOpen}
                    onClose={handleModalClose}
                    onSubmit={handleModalSubmit}
                    initialData={editTeacher}
                />

                <ConfirmActionModal
                    open={confirmModal.open}
                    action={confirmModal.action as any}
                    departmentName={
                        confirmModal.teacher
                            ? `${confirmModal.teacher.first_name} ${confirmModal.teacher.last_name}`
                            : ''
                    }
                    onConfirm={handleConfirmAction}
                    onCancel={closeConfirmModal}
                    loading={confirmModal.loading}
                />
            </Card>
        </div>
    );
} 