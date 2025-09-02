import { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Pagination, Card, Table, Tag, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ConfirmActionModal from '../../components/shared/ConfirmActionModal';

// API helpers
const API_BASE = 'http://103.189.173.7:8080/api/streams';

function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

type Stream = {
    ID: string;
    name: string;
    description?: string;
    status: 'Active' | 'Inactive';
    created_at: string;
    updated_at: string;
};

async function fetchStreams(search = '', page = 1, pageSize = 10): Promise<{ streams: Stream[]; total: number }> {
    const res = await fetch(`${API_BASE}?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch streams');
    return res.json();
}

async function addStream(data: { name: string; description?: string; status: 'Active' | 'Inactive' }): Promise<any> {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add stream');
    return res.json();
}

async function updateStream(id: string, data: { name: string; description?: string; status: 'Active' | 'Inactive' }): Promise<any> {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update stream');
    return res.json();
}

async function deleteStream(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete stream');
    return res.json();
}

export default function StreamsPage() {
    const [streams, setStreams] = useState<Stream[]>([]);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editStream, setEditStream] = useState<Stream | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        action: 'delete' | null;
        stream: Stream | null;
        loading: boolean;
    }>({ open: false, action: null, stream: null, loading: false });

    const loadStreams = () => {
        setTableLoading(true);
        fetchStreams(search, page, pageSize)
            .then(({ streams, total }) => {
                setStreams(streams);
                setTotal(total);
            })
            .catch((error) => {
                message.error('Failed to load streams');
                console.error(error);
            })
            .finally(() => setTableLoading(false));
    };

    useEffect(() => {
        loadStreams();
    }, [search, page, pageSize]);

    const handleAdd = () => { setEditStream(null); setModalOpen(true); };
    const handleEdit = (stream: Stream) => { setEditStream(stream); setModalOpen(true); };
    const handleModalClose = () => { setModalOpen(false); setEditStream(null); };

    const handleModalSubmit = async (data: { name: string; description?: string; status: 'Active' | 'Inactive' }) => {
        try {
            if (editStream) {
                await updateStream(editStream.ID, data);
                message.success('Stream updated successfully!');
            } else {
                await addStream(data);
                message.success('Stream added successfully!');
            }
            setModalOpen(false);
            setEditStream(null);
            loadStreams();
        } catch (error: any) {
            message.error(error.message || 'Failed to save stream');
        }
    };

    const openConfirmModal = (action: 'delete', stream: Stream) => {
        setConfirmModal({ open: true, action, stream, loading: false });
    };

    const closeConfirmModal = () => {
        setConfirmModal((prev) => ({ ...prev, open: false, loading: false }));
    };

    const handleConfirmAction = async () => {
        if (!confirmModal.action || !confirmModal.stream) return;
        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
            if (confirmModal.action === 'delete') {
                await deleteStream(confirmModal.stream.ID);
                message.success('Stream deleted successfully!');
            }
            loadStreams();
            closeConfirmModal();
        } catch (error: any) {
            message.error(error.message || 'Failed to perform action');
            setConfirmModal((prev) => ({ ...prev, loading: false }));
        }
    };

    const columns = [
        {
            title: 'Stream Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => (
                <span className="text-gray-600">
                    {text || 'No description provided'}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (is_active: 'Active' | 'Inactive') => (
                <Tag color={is_active ? 'green' : 'red'}>
                    {is_active ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: 'Created',
            dataIndex: 'CreatedAt',
            key: 'CreatedAt',
            render: (date: string) => (
                <span className="text-sm text-gray-500">
                    {new Date(date).toLocaleDateString()}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, stream: Stream) => (
                <div className="flex gap-2">
                    <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(stream)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => openConfirmModal('delete', stream)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Stream Management</h1>
                <p className="text-gray-600">Manage academic streams and fields of study</p>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <Input.Search
                        placeholder="Search streams..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: 300 }}
                        allowClear
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Add Stream
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={streams}
                    rowKey="ID"
                    loading={tableLoading}
                    pagination={false}
                    className="mb-4"
                />

                <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={total}
                    onChange={(page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                    }}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} streams`
                    }
                />
            </Card>

            {/* Add/Edit Stream Modal */}
            <AddEditStreamModal
                open={modalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                initialData={editStream}
            />

            <ConfirmActionModal
                open={confirmModal.open}
                action={confirmModal.action as any}
                streamName={confirmModal.stream?.name || ''}
                onConfirm={handleConfirmAction}
                onCancel={closeConfirmModal}
                loading={confirmModal.loading}
            />
        </div>
    );
}

// Add/Edit Stream Modal Component
function AddEditStreamModal({ open, onClose, onSubmit, initialData }: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description?: string; status: 'Active' | 'Inactive' }) => void;
    initialData?: Stream | null;
}) {
    const [form] = Form.useForm();
    const isEditing = !!initialData;

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.setFieldsValue({
                    name: initialData.name,
                    description: initialData.description,
                    status: initialData.status,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, initialData, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSubmit(values);
        } catch (error) {
            message.error('Please fill all required fields correctly');
        }
    };

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            title={
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">
                        {isEditing ? 'Edit Stream' : 'Add New Stream'}
                    </h2>
                    <p className="text-gray-600 text-sm">
                        {isEditing ? 'Update stream information' : 'Enter stream details'}
                    </p>
                </div>
            }
            width={600}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                className="mt-6"
            >
                <Form.Item
                    name="name"
                    label="Stream Name"
                    rules={[
                        { required: true, message: 'Please enter stream name' },
                        { min: 2, message: 'Stream name must be at least 2 characters' },
                        { max: 100, message: 'Stream name cannot exceed 100 characters' }
                    ]}
                >
                    <Input
                        placeholder="e.g., Science, Commerce, Arts, Engineering"
                        size="large"
                        className="text-base"
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                        { max: 500, message: 'Description cannot exceed 500 characters' }
                    ]}
                >
                    <Input.TextArea
                        placeholder="Enter stream description (optional)"
                        rows={4}
                        showCount
                        maxLength={500}
                        className="text-base"
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
                        <Select.Option value="Active">Active</Select.Option>
                        <Select.Option value="Inactive">Inactive</Select.Option>
                    </Select>
                </Form.Item>

                <div className="flex gap-3 mt-6">
                    <Button
                        size="large"
                        block
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        block
                        onClick={handleSubmit}
                    >
                        {isEditing ? 'Update Stream' : 'Add Stream'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
} 