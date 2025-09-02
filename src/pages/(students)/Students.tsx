import { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Pagination, Card, Table, Tag, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined, SearchOutlined } from '@ant-design/icons';
import AddEditStudentModal from './AddEditStudentModal';
import ConfirmActionModal from '../../components/shared/ConfirmActionModal';
import DeleteIcon from "../../assets/trash-delete.svg";
import EditIcon from "../../assets/edit.svg";
// API helpers
const API_BASE = 'http://103.189.173.7:8080/api/students';

function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

type Student = {
    id: string;
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    program: string;
    year_of_study: number;
    is_active: boolean;
    created_at: string;
};

async function fetchStudents(search = '', page = 1, pageSize = 10): Promise<{ students: Student[]; total: number }> {
    const res = await fetch(`${API_BASE}?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
}

async function addStudent(data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    program: string;
    year_of_study: number;
}): Promise<any> {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add student');
    return res.json();
}

async function updateStudent(id: string, data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    program: string;
    year_of_study: number;
}): Promise<any> {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update student');
    return res.json();
}

async function deleteStudent(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete student');
    return res.json();
}

async function activateStudent(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/${id}/activate`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to activate student');
    return res.json();
}

async function deactivateStudent(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/${id}/deactivate`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to deactivate student');
    return res.json();
}

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editStudent, setEditStudent] = useState<Student | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        action: 'delete' | 'activate' | 'deactivate' | null;
        student: Student | null;
        loading: boolean;
    }>({ open: false, action: null, student: null, loading: false });

    const loadStudents = () => {
        setTableLoading(true);
        fetchStudents(search, page, pageSize)
            .then((res) => {
                setStudents(res.data.students);
                setTotal(res.data.total);
            })
            .catch(() => message.error('Failed to load students'))
            .finally(() => setTableLoading(false));
    };

    useEffect(() => { loadStudents(); }, [search, page, pageSize]);

    const handleAdd = () => { setEditStudent(null); setModalOpen(true); };
    const handleEdit = (student: Student) => { setEditStudent(student); setModalOpen(true); };
    const handleModalClose = () => { setModalOpen(false); setEditStudent(null); };

    const handleModalSubmit = async (data: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        program: string;
        year_of_study: number;
    }) => {
        try {
            if (editStudent) {
                await updateStudent(editStudent.ID, data);
                message.success('Student updated!');
            } else {
                await addStudent(data);
                message.success('Student added!');
            }
            setModalOpen(false);
            setEditStudent(null);
            loadStudents();
        } catch (e: any) {
            message.error(e.message);
        }
    };

    const openConfirmModal = (action: 'delete' | 'activate' | 'deactivate', student: Student) => {
        setConfirmModal({ open: true, action, student, loading: false });
    };

    const closeConfirmModal = () => {
        setConfirmModal((prev) => ({ ...prev, open: false, loading: false }));
    };

    const handleConfirmAction = async () => {
        if (!confirmModal.action || !confirmModal.student) return;
        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
            if (confirmModal.action === 'delete') {
                await deleteStudent(confirmModal.student.ID);
                message.success('Student deleted!');
            } else if (confirmModal.action === 'activate') {
                await activateStudent(confirmModal.student.ID);
                message.success('Student activated!');
            } else if (confirmModal.action === 'deactivate') {
                await deactivateStudent(confirmModal.student.ID);
                message.success('Student deactivated!');
            }
            loadStudents();
            closeConfirmModal();
        } catch (e: any) {
            message.error(e.message);
            setConfirmModal((prev) => ({ ...prev, loading: false }));
        }
    };

    const columns = [
        {
            title: 'Student ID',
            dataIndex: 'student_id',
            key: 'student_id',
            render: (text: string) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Name',
            key: 'name',
            render: (_: any, student: Student) => (
                <div>
                    <div className="font-medium">{`${student.first_name} ${student.last_name}`}</div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                </div>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Program',
            dataIndex: 'program',
            key: 'program',
        },
        {
            title: 'Year',
            dataIndex: 'year_of_study',
            key: 'year_of_study',
            render: (year: number) => `Year ${year}`,
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (is_active: boolean) => (
                <Tag color={is_active ? 'green' : 'red'} icon={is_active ? <CheckCircleOutlined /> : <StopOutlined />}>
                    {is_active ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, student: Student) => (
                <div className="flex gap-2">
                    <Button className="table-action-button" onClick={() => handleEdit(student)} ><img src={EditIcon} alt="Edit" /></Button>
                    <Button
                        className="table-action-status-button"
                        icon={student.is_active ? <StopOutlined /> : <CheckCircleOutlined />}
                        onClick={() => openConfirmModal(student.is_active ? 'deactivate' : 'activate', student)}
                    >
                        {student.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button className="table-action-button" onClick={() => openConfirmModal('delete', student)} ><img src={DeleteIcon} alt="delete" /></Button>
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
                            <h3 className="card-title">Manage Students</h3>

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
                            Add Student
                        </Button>
                    </div>
                }>
                <div className="filters-bar">
                    <Input
                        placeholder="Search students by name, email, or student ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        prefix={<SearchOutlined />}
                        className="filter-input"
                        allowClear
                        onSearch={v => setSearch(v)}
                    />
                </div>
                <div className='table-responsive'>
                    <Table
                        columns={columns}
                        dataSource={students}
                        rowKey="id"
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

                <AddEditStudentModal
                    open={modalOpen}
                    onClose={handleModalClose}
                    onSubmit={handleModalSubmit}
                    initialData={editStudent}
                />

                <ConfirmActionModal
                    open={confirmModal.open}
                    action={confirmModal.action as any}
                    departmentName={confirmModal.student ? `${confirmModal.student.first_name} ${confirmModal.student.last_name}` : ''}
                    onConfirm={handleConfirmAction}
                    onCancel={closeConfirmModal}
                    loading={confirmModal.loading}
                />
            </Card>
        </div>
    );
} 