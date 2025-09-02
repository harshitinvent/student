import { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Pagination, Card, Table, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import AddEditDepartmentModal from './AddEditDepartmentModal';
import ConfirmActionModal from '../../components/shared/ConfirmActionModal';

// API helpers
const API_BASE = 'http://103.189.173.7:8080/api/departments';

function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Error handling function
function handleDepartmentAPIError(error: any, operation: string): string {
    console.error(`${operation} error:`, error);

    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return 'Network error: Unable to connect to server. Please check your internet connection.';
    }

    // Handle error message
    if (error.message) {
        const errorMsg = error.message.toLowerCase();

        // HTTP status code errors
        if (errorMsg.includes('401') || errorMsg.includes('unauthorized')) {
            return 'Authentication error: Please login again.';
        }
        if (errorMsg.includes('403') || errorMsg.includes('forbidden')) {
            return 'Access denied: You don\'t have permission to perform this action.';
        }
        if (errorMsg.includes('404') || errorMsg.includes('not found')) {
            return 'Resource not found: The requested department does not exist.';
        }
        if (errorMsg.includes('409') || errorMsg.includes('conflict')) {
            return 'Conflict: A department with this name already exists.';
        }
        if (errorMsg.includes('422') || errorMsg.includes('validation')) {
            return 'Validation error: Please check the department name and try again.';
        }
        if (errorMsg.includes('500') || errorMsg.includes('internal server error')) {
            return 'Server error: Something went wrong on our end. Please try again later.';
        }

        // Return the original error message if it's meaningful
        if (error.message.length > 0 && error.message !== 'Failed to fetch departments') {
            return error.message;
        }
    }

    return `Failed to ${operation.toLowerCase()}. Please try again.`;
}

type Department = any;

async function fetchDepartments(search = '', page = 1, pageSize = 10): Promise<{ data: Department[]; total: number }> {
    try {
        const res = await fetch(`${API_BASE}?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`, {
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`);
        }

        const response = await res.json();

        // Check if response has error format
        if (response.status === false && response.message) {
            throw new Error(response.message);
        }

        return response;
    } catch (error) {
        throw new Error(handleDepartmentAPIError(error, 'fetch departments'));
    }
}
async function addDepartment(data: { name: string }): Promise<any> {
    try {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`);
        }

        const response = await res.json();

        // Check if response has error format
        if (response.status === false && response.message) {
            throw new Error(response.message);
        }

        return response;
    } catch (error) {
        throw new Error(handleDepartmentAPIError(error, 'add department'));
    }
}
async function updateDepartment(id: string, data: { name: string }): Promise<any> {
    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`);
        }

        const response = await res.json();

        // Check if response has error format
        if (response.status === false && response.message) {
            throw new Error(response.message);
        }

        return response;
    } catch (error) {
        throw new Error(handleDepartmentAPIError(error, 'update department'));
    }
}

async function deleteDepartment(id: string): Promise<any> {
    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`);
        }

        const response = await res.json();

        // Check if response has error format
        if (response.status === false && response.message) {
            throw new Error(response.message);
        }

        return response;
    } catch (error) {
        throw new Error(handleDepartmentAPIError(error, 'delete department'));
    }
}

async function activateDepartment(id: string): Promise<any> {
    try {
        const res = await fetch(`${API_BASE}/${id}/activate`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`);
        }

        const response = await res.json();

        // Check if response has error format
        if (response.status === false && response.message) {
            throw new Error(response.message);
        }

        return response;
    } catch (error) {
        throw new Error(handleDepartmentAPIError(error, 'activate department'));
    }
}

async function deactivateDepartment(id: string): Promise<any> {
    try {
        const res = await fetch(`${API_BASE}/${id}/deactivate`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`);
        }

        const response = await res.json();

        // Check if response has error format
        if (response.status === false && response.message) {
            throw new Error(response.message);
        }

        return response;
    } catch (error) {
        throw new Error(handleDepartmentAPIError(error, 'deactivate department'));
    }
}

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editDepartment, setEditDepartment] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);
    const [modalError, setModalError] = useState('');
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        action: 'delete' | 'activate' | 'deactivate' | null;
        dept: Department | null;
        loading: boolean;
    }>({ open: false, action: null, dept: null, loading: false });

    const loadDepartments = () => {
        setTableLoading(true);
        fetchDepartments(search, page, pageSize)
            .then((res) => {
                setDepartments(res.data || res.departments || []);
                setTotal(res.total || 0);
            })
            .catch((error) => {
                const errorMessage = error.message || 'Failed to load departments';
                console.error('Load departments error:', error);
                console.log('Error message to show:', errorMessage);
                message.error(errorMessage);
            })
            .finally(() => setTableLoading(false));
    };
    useEffect(() => { loadDepartments(); }, [search, page, pageSize]);

    const handleAdd = () => { setEditDepartment(null); setModalOpen(true); setModalError(''); };
    const handleEdit = (dept: Department) => { setEditDepartment(dept); setModalOpen(true); setModalError(''); };
    const handleModalClose = () => { setModalOpen(false); setEditDepartment(null); setModalError(''); };
    const handleModalSubmit = async (data: { name: string }) => {
        try {
            if (editDepartment) {
                await updateDepartment(editDepartment.ID, data);
                message.success('Department updated successfully!');
            } else {
                await addDepartment(data);
                message.success('Department added successfully!');
            }
            setModalOpen(false);
            setEditDepartment(null);
            loadDepartments();
        } catch (error: any) {
            let errorMessage = error.message || 'Failed to save department';
            console.log(error.message, "errorerror");

            // Extract only the message part from HTTP response
            if (errorMessage.includes('HTTP 400:') && errorMessage.includes('"message"')) {
                try {
                    const jsonStart = errorMessage.indexOf('{');
                    const jsonEnd = errorMessage.lastIndexOf('}') + 1;
                    const jsonString = errorMessage.substring(jsonStart, jsonEnd);
                    const jsonData = JSON.parse(jsonString);
                    errorMessage = jsonData.message || errorMessage;
                } catch (parseError) {
                    // If parsing fails, keep original message
                    console.log('Failed to parse error message:', parseError);
                }
            }

            setModalError(errorMessage); // Set error in modal
        }
    };
    const openConfirmModal = (action: 'delete' | 'activate' | 'deactivate', dept: Department) => {
        setConfirmModal({ open: true, action, dept, loading: false });
    };
    const closeConfirmModal = () => {
        setConfirmModal((prev) => ({ ...prev, open: false, loading: false }));
    };
    const handleConfirmAction = async () => {
        if (!confirmModal.action || !confirmModal.dept) return;
        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
            if (confirmModal.action === 'delete') {
                await deleteDepartment(confirmModal.dept.ID);
                message.success('Department deleted successfully!');
            } else if (confirmModal.action === 'activate') {
                await activateDepartment(confirmModal.dept.ID);
                message.success('Department activated successfully!');
            } else if (confirmModal.action === 'deactivate') {
                await deactivateDepartment(confirmModal.dept.ID);
                message.success('Department deactivated successfully!');
            }
            loadDepartments();
            closeConfirmModal();
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to perform action';
            message.error(errorMessage);
            console.error('Confirm action error:', error);
            setConfirmModal((prev) => ({ ...prev, loading: false }));
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className="font-medium">{text}</span>,
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
            render: (_: any, dept: any) => (
                <div className="flex gap-2">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(dept)} />
                    <Button
                        icon={dept.is_active ? <StopOutlined /> : <CheckCircleOutlined />}
                        onClick={() => openConfirmModal(dept.is_active ? 'deactivate' : 'activate', dept)}
                    >
                        {dept.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => openConfirmModal('delete', dept)} />
                </div>
            ),
        },
    ];

    return (
        <Card className="max-w-8xl mx-auto mt-8 shadow-lg">


            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Departments</h1>
                <div className="flex gap-2">
                    {/* <Button
                        onClick={() => {
                            console.log('Testing error message...');
                            setModalError('Test error message - यह एक टेस्ट error message है!');
                            setModalOpen(true);
                        }}
                        style={{ marginRight: '8px' }}
                    >
                        Test Error
                    </Button> */}
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Add Department
                    </Button>
                </div>
            </div>
            <Input.Search
                placeholder="Search department..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-4 max-w-xs"
                allowClear
                onSearch={v => setSearch(v)}
            />
            <Table
                columns={columns}
                dataSource={departments}
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
            <AddEditDepartmentModal
                open={modalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                initialData={editDepartment}
                errorMessage={modalError}
            />
            <ConfirmActionModal
                open={confirmModal.open}
                action={confirmModal.action as any}
                departmentName={confirmModal.dept?.name}
                onConfirm={handleConfirmAction}
                onCancel={closeConfirmModal}
                loading={confirmModal.loading}
            />
        </Card>
    );
} 